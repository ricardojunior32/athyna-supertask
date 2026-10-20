import type { EmploymentType, Seniority } from '../types/job'
import { type JobFilters, type Option, SortOption } from '../types/search'
import { EMPLOYMENT_TYPES, SENIORITY_LABELS } from './jobs'

export const SEARCH_PLACEHOLDER = 'What job are you looking for today?'

export const SEARCH_DEBOUNCE_MS = 400

export const SEARCH_SETTLE_MS = 1500

export const REMOTE_KEYWORD = 'remote'

export const POPULAR_SEARCHES = [
  'AI Engineer',
  'ML',
  'Data Scientist',
  'Data Engineer',
  'Prompt Engineering',
  'NLP',
  'Gen AI',
  'Deep Learning',
  'Software Engineer',
  'DevOps',
  'QA',
  'Product Manager',
] as const

export const POPULAR_SEARCHES_VISIBLE_COUNT = 6

export const POPULAR_SEARCHES_EXTRA_COUNT = POPULAR_SEARCHES.length - POPULAR_SEARCHES_VISIBLE_COUNT

export const SENIORITY_OPTIONS = (Object.entries(SENIORITY_LABELS) as [Seniority, string][]).map(
  ([value, label]): Option<Seniority> => ({ value, label }),
)

export const EMPLOYMENT_TYPE_OPTIONS: Option<EmploymentType>[] = EMPLOYMENT_TYPES.map((type) => ({
  value: type,
  label: type,
}))

export const SORT_OPTIONS: Option<SortOption>[] = [
  { value: SortOption.Newest, label: 'Newest' },
  { value: SortOption.Title, label: 'Name A–Z' },
]

export const NO_FILTERS: JobFilters = {
  remote: false,
  locations: [],
  skills: [],
  seniority: null,
  employmentType: null,
  minSalary: null,
  maxSalary: null,
  sort: SortOption.Newest,
}

/** Jobs fetched per page while a filter the API cannot apply (location, skills) is on. */
export const CLIENT_FILTER_PAGE_SIZE = 50

/** Pages of CLIENT_FILTER_PAGE_SIZE jobs a visitor can load before the login wall. */
export const CLIENT_FILTER_MAX_PAGES = 4

export const SKILLS_HINT =
  "Skills are read from each job's description, since the API's skills field is empty."
