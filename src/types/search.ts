import type { EmploymentType, Seniority } from './job'
import type { Country } from './location'
import type { TechSkill } from './skills'

export enum SortOption {
  Newest = 'newest',
  Title = 'title',
}

export enum SearchSource {
  Typing = 'typing',
  Submit = 'submit',
}

export type Option<T extends string = string> = { value: T; label: string }

export type JobFilters = {
  remote: boolean
  locations: Country[]
  skills: TechSkill[]
  seniority: Seniority | null
  employmentType: EmploymentType | null
  minSalary: number | null
  maxSalary: number | null
  sort: SortOption
}

export type JobSearch = {
  q: string
  filters: JobFilters
}
