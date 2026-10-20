import {
  EMPLOYMENT_TYPE_OPTIONS,
  NO_FILTERS,
  REMOTE_KEYWORD,
  SENIORITY_OPTIONS,
} from '../constants/search'
import { type JobsQuery, SortBy, SortOrder } from '../types/job'
import { readLocations, writeLocations } from './location'
import { readTechSkills } from './skills'
import { type JobFilters, type JobSearch, type Option, SortOption } from '../types/search'

export const parseAmount = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null
}

const findOption = <T extends string>(options: Option<T>[], value: string | null): T | null => {
  if (!value) return null
  return options.find((option) => option.value.toLowerCase() === value.toLowerCase())?.value ?? null
}

export const readJobSearch = (params: URLSearchParams): JobSearch => {
  return {
    q: params.get('q')?.trim() ?? '',
    filters: {
      remote: params.get('remote') === '1',
      locations: readLocations(params.get('location')),
      skills: readTechSkills(params.get('skills')),
      seniority: findOption(SENIORITY_OPTIONS, params.get('level')),
      employmentType: findOption(EMPLOYMENT_TYPE_OPTIONS, params.get('type')),
      minSalary: parseAmount(params.get('minSalary')),
      maxSalary: parseAmount(params.get('maxSalary')),
      sort: params.get('sort') === SortOption.Title ? SortOption.Title : SortOption.Newest,
    },
  }
}

// The API matches q against the title only, so a typed "remote" would miss remote jobs
// whose title does not say it. The word becomes the remote filter instead.
export const splitRemoteKeyword = (q: string): { q: string; remote: boolean } => {
  const words = q.split(/\s+/).filter(Boolean)
  const rest = words.filter((word) => word.toLowerCase() !== REMOTE_KEYWORD)
  if (rest.length === words.length) return { q, remote: false }
  return { q: rest.join(' '), remote: true }
}

export const writeJobSearch = ({ q, filters }: JobSearch): URLSearchParams => {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (filters.remote) params.set('remote', '1')
  const location = writeLocations(filters.locations)
  if (location) params.set('location', location)
  if (filters.skills.length > 0) params.set('skills', filters.skills.join(','))
  if (filters.employmentType) params.set('type', filters.employmentType)
  if (filters.seniority) params.set('level', filters.seniority)
  if (filters.minSalary !== null) params.set('minSalary', String(filters.minSalary))
  if (filters.maxSalary !== null) params.set('maxSalary', String(filters.maxSalary))
  if (filters.sort !== SortOption.Newest) params.set('sort', filters.sort)
  return params
}

export const toJobsQuery = ({ q, filters }: JobSearch, pageSize: number): JobsQuery => {
  return {
    q: q || undefined,
    pageNumber: 1,
    pageSize,
    remote: filters.remote || undefined,
    seniority: filters.seniority ?? undefined,
    employmentType: filters.employmentType ?? undefined,
    minSalary: filters.minSalary ?? undefined,
    maxSalary: filters.maxSalary ?? undefined,
    ...(filters.sort === SortOption.Title && { sortBy: SortBy.Title, sortOrder: SortOrder.Asc }),
  }
}

export const activeFilterNames = (filters: JobFilters): Array<keyof JobFilters> => {
  const names = Object.keys(filters) as Array<keyof JobFilters>
  return names.filter((name) => {
    const value = filters[name]
    return Array.isArray(value) ? value.length > 0 : value !== NO_FILTERS[name]
  })
}

export const hasActiveFilters = (filters: JobFilters): boolean => {
  return activeFilterNames(filters).length > 0
}
