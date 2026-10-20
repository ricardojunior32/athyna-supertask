import { COUNTRIES, REGIONS } from '../constants/locations'
import type { Job } from '../types/job'
import { Country, type LocationGroup, Region, type RegionSelection } from '../types/location'

const ALL_COUNTRIES = Object.values(Country)
const ALL_REGIONS = Object.values(Region)

const normalize = (text: string): string => {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const NAME_PATTERNS = ALL_COUNTRIES.flatMap((country) =>
  COUNTRIES[country].aliases.map((alias) => ({
    country,
    length: alias.length,
    pattern: new RegExp(`(?<![a-z])${escapeRegExp(alias)}(?![a-z])`, 'g'),
  })),
)

const COUNTRY_BY_CODE = new Map(
  ALL_COUNTRIES.flatMap((country) => COUNTRIES[country].codes.map((code) => [code, country])),
)

/** Country named in the text: the match that ends last wins, and the longer alias on a tie. */
const countryFromNames = (text: string): Country | null => {
  const normalized = normalize(text)
  let best: { country: Country; end: number; length: number } | null = null
  for (const { country, length, pattern } of NAME_PATTERNS) {
    for (const match of normalized.matchAll(pattern)) {
      const end = match.index + length
      if (!best || end > best.end || (end === best.end && length > best.length)) {
        best = { country, end, length }
      }
    }
  }
  return best?.country ?? null
}

/**
 * Country from uppercase codes such as "OH", "GB:", "US-Remote" or "AL 35806". Only whole
 * segments, a leading code before ":", "-" or a number, and the last word of a segment count, so a
 * stray "OR" in prose does not read as Oregon.
 */
const countryFromCodes = (text: string): Country | null => {
  let found: Country | null = null
  for (const segment of text.replace(/\./g, '').split(/[,;()/|]/)) {
    const trimmed = segment.trim()
    const words = trimmed.split(/\s+/)
    const leading = trimmed.match(/^([A-Z]{2,4})(?=\s*[:-]|\s+\d)/)?.[1]
    for (const candidate of [leading, trimmed, words.at(-1)]) {
      const country = candidate ? COUNTRY_BY_CODE.get(candidate) : undefined
      if (country) found = country
    }
  }
  return found
}

/**
 * Best guess at the country of a free-text location such as "GB: Sunbury - ICBT, United Kingdom"
 * or "Cincinnati, OH, United States". The API leaves `city` and `country` empty and puts the whole
 * location in `locality`, so this belongs in the backend's ingestion step; it lives here until then.
 */
export const parseCountry = (text: string | null | undefined): Country | null => {
  if (!text) return null
  return countryFromNames(text) ?? countryFromCodes(text)
}

export const jobCountry = (job: Job): Country | null => {
  const { locality, city, country } = job.location
  return parseCountry([locality, city, country].filter(Boolean).join(', '))
}

export const matchesLocations = (job: Job, countries: readonly Country[]): boolean => {
  if (countries.length === 0) return true
  const country = jobCountry(job)
  return country !== null && countries.includes(country)
}

/** Keeps the canonical order and drops duplicates, so equal selections compare equal. */
export const sortCountries = (countries: Iterable<Country>): Country[] => {
  const selected = new Set(countries)
  return ALL_COUNTRIES.filter((country) => selected.has(country))
}

/** Reads `location=latam,GB`: region slugs expand to their countries, unknown values are dropped. */
export const readLocations = (value: string | null): Country[] => {
  if (!value) return []
  const countries = value.split(',').flatMap((token) => {
    const trimmed = token.trim()
    if (ALL_REGIONS.includes(trimmed.toLowerCase() as Region)) {
      return REGIONS[trimmed.toLowerCase() as Region].countries
    }
    const country = trimmed.toUpperCase() as Country
    return ALL_COUNTRIES.includes(country) ? [country] : []
  })
  return sortCountries(countries)
}

/** Writes whole regions as their slug and the rest as country codes, to keep shared links short. */
export const writeLocations = (countries: readonly Country[]): string | null => {
  const groups = groupLocations(countries)
  return groups.length > 0 ? groups.map((group) => group.value).join(',') : null
}

/** Splits a selection into whole regions and loose countries, for tags and the URL. */
export const groupLocations = (countries: readonly Country[]): LocationGroup[] => {
  const remaining = new Set(countries)
  const groups: LocationGroup[] = []
  for (const region of ALL_REGIONS) {
    const regionCountries = REGIONS[region].countries
    if (regionCountries.every((country) => remaining.has(country))) {
      groups.push({ value: region, label: REGIONS[region].name, countries: regionCountries })
      for (const country of regionCountries) remaining.delete(country)
    }
  }
  for (const country of sortCountries(remaining)) {
    groups.push({ value: country, label: COUNTRIES[country].name, countries: [country] })
  }
  return groups
}

export const regionSelection = (region: Region, countries: readonly Country[]): RegionSelection => {
  const selected = REGIONS[region].countries.filter((country) => countries.includes(country))
  return {
    checked: selected.length === REGIONS[region].countries.length,
    indeterminate: selected.length > 0 && selected.length < REGIONS[region].countries.length,
  }
}

export const toggleRegion = (region: Region, countries: readonly Country[]): Country[] => {
  const regionCountries = REGIONS[region].countries
  return regionSelection(region, countries).checked
    ? countries.filter((country) => !regionCountries.includes(country))
    : sortCountries([...countries, ...regionCountries])
}

export const toggleCountry = (country: Country, countries: readonly Country[]): Country[] => {
  return countries.includes(country)
    ? countries.filter((selected) => selected !== country)
    : sortCountries([...countries, country])
}

export const withoutCountries = (
  countries: readonly Country[],
  removed: readonly Country[],
): Country[] => {
  return countries.filter((country) => !removed.includes(country))
}
