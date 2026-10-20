import type { LucideIcon } from 'lucide-react'
import type { Pagination } from './api'

export enum SortBy {
  PublishedAt = 'publishedAt',
  Salary = 'salary',
  Title = 'title',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum Seniority {
  Entry = 'EN',
  Mid = 'MI',
  Senior = 'SE',
  Executive = 'EX',
}

export enum EmploymentType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
  Freelance = 'Freelance',
  Internship = 'Internship',
  Temporary = 'Temporary',
  Apprenticeship = 'Apprenticeship',
}

export enum SalaryPeriod {
  Yearly = 'yearly',
  Monthly = 'monthly',
  Weekly = 'weekly',
  Daily = 'daily',
  Hourly = 'hourly',
}

export type Job = {
  id: string
  slug: string
  title: string
  url: string
  applicationUrl: string | null
  company: {
    name: string
    logoUrl: string | null
    websiteUrl: string | null
  }
  location: {
    city: string | null
    country: string | null
    locality: string | null
    isRemote: boolean
  }
  employmentType: string | null
  seniority: string | null
  category: string | null
  experience: {
    minYears: number | null
    maxYears: number | null
  }
  salary: {
    min: number | null
    max: number | null
    currency: string | null
    period: string | null
  } | null
  skills: string[]
  overview: string | null
  description: string | null
  publishedAt: string
  updatedAt: string
}

export type RawJob = Omit<Job, 'company' | 'location' | 'experience' | 'skills'> & {
  [Key in 'company' | 'location' | 'experience' | 'skills']?: Partial<Job[Key]> | null
}

export type JobsResponse = {
  data: Job[]
  pagination: Pagination
}

export type RawJobsResponse = {
  data: RawJob[] | null
  pagination: Pagination
}

export type JobsQuery = {
  q?: string
  pageNumber?: number
  pageSize?: number
  remote?: true
  seniority?: string
  employmentType?: string
  minSalary?: number
  maxSalary?: number
  sortBy?: SortBy
  sortOrder?: SortOrder
}

export type JobFact = {
  label: string
  value: string | null
  icon: LucideIcon
  highlight?: boolean
}
