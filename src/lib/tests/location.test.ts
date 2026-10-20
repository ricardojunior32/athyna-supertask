import { describe, expect, it } from 'vitest'
import { REGIONS } from '../../constants/locations'
import { Country, Region } from '../../types/location'
import {
  groupLocations,
  parseCountry,
  readLocations,
  regionSelection,
  toggleCountry,
  toggleRegion,
  writeLocations,
} from '../location'

describe('parseCountry', () => {
  it.each([
    ['Cincinnati, OH, United States', Country.UnitedStates],
    ['GB: Sunbury - ICBT, United Kingdom', Country.UnitedKingdom],
    ['R-Australia', Country.Australia],
    ['Remote Anywhere, Remote, AL 35806, US', Country.UnitedStates],
    ['Hanover, MD; Information Technology', Country.UnitedStates],
    ['100% Remote in the U.S', Country.UnitedStates],
    ['US-OR-Tualatin (1034)', Country.UnitedStates],
    ['São Paulo, SP', Country.Brazil],
    ['Toronto, ON, CA', Country.Canada],
    ['Bengaluru, KA, IN', Country.India],
    ['Katowice, PL, 40-202', Country.Poland],
  ])('reads %s', (locality, country) => {
    expect(parseCountry(locality)).toBe(country)
  })

  it('prefers the place named last, and the longer name on a tie', () => {
    expect(parseCountry('Albuquerque, New Mexico')).toBe(Country.UnitedStates)
    expect(parseCountry('Belfast, Northern Ireland')).toBe(Country.UnitedKingdom)
    expect(parseCountry('Porto Alegre, RS')).toBe(Country.Brazil)
    expect(parseCountry('London, Ontario')).toBe(Country.Canada)
  })

  it('does not read codes out of prose', () => {
    expect(parseCountry('Remote OR Hybrid')).toBeNull()
    expect(parseCountry('Indianapolis')).toBeNull()
  })

  it('returns null when there is no country to read', () => {
    expect(parseCountry('Remote')).toBeNull()
    expect(parseCountry('Thurston County – Olympia')).toBeNull()
    expect(parseCountry('')).toBeNull()
    expect(parseCountry(null)).toBeNull()
  })
})

describe('REGIONS', () => {
  it('puts every country in exactly one region', () => {
    const listed = Object.values(REGIONS).flatMap((region) => region.countries)
    expect(listed).toHaveLength(new Set(listed).size)
    expect(new Set(listed)).toEqual(new Set(Object.values(Country)))
  })
})

describe('readLocations and writeLocations', () => {
  it('expands regions and keeps a canonical order', () => {
    expect(readLocations('GB,north-america')).toEqual([
      Country.UnitedStates,
      Country.Canada,
      Country.UnitedKingdom,
    ])
  })

  it('drops values it does not understand and duplicates', () => {
    expect(readLocations('xx,br,BR,mars')).toEqual([Country.Brazil])
    expect(readLocations(null)).toEqual([])
  })

  it('writes whole regions as their slug', () => {
    const countries = [...REGIONS[Region.Latam].countries, Country.Germany]
    expect(writeLocations(countries)).toBe('latam,DE')
    expect(writeLocations([])).toBeNull()
  })

  it('survives a round trip', () => {
    const countries = readLocations('europe,BR,US')
    expect(readLocations(writeLocations(countries))).toEqual(countries)
  })
})

describe('selection helpers', () => {
  it('toggles a whole region on and off', () => {
    const latam = toggleRegion(Region.Latam, [Country.Brazil])
    expect(latam).toEqual(REGIONS[Region.Latam].countries)
    expect(toggleRegion(Region.Latam, latam)).toEqual([])
  })

  it('reports a partly selected region as indeterminate', () => {
    expect(regionSelection(Region.Latam, [Country.Brazil])).toEqual({
      checked: false,
      indeterminate: true,
    })
    expect(regionSelection(Region.Latam, [])).toEqual({ checked: false, indeterminate: false })
  })

  it('toggles a single country', () => {
    expect(toggleCountry(Country.Brazil, [])).toEqual([Country.Brazil])
    expect(toggleCountry(Country.Brazil, [Country.Brazil])).toEqual([])
  })

  it('groups a selection into regions and loose countries', () => {
    const groups = groupLocations([...REGIONS[Region.NorthAmerica].countries, Country.Brazil])
    expect(groups.map((group) => group.label)).toEqual(['North America', 'Brazil'])
  })
})
