import { EmploymentType, SalaryPeriod, Seniority } from '../types/job'

export const SENIORITY_LABELS: Record<Seniority, string> = {
  [Seniority.Entry]: 'Entry level',
  [Seniority.Mid]: 'Mid level',
  [Seniority.Senior]: 'Senior',
  [Seniority.Executive]: 'Executive',
}

export const EMPLOYMENT_TYPES = Object.values(EmploymentType)

export const SALARY_PERIOD_SUFFIX: Record<SalaryPeriod, string> = {
  [SalaryPeriod.Yearly]: '/yr',
  [SalaryPeriod.Monthly]: '/mo',
  [SalaryPeriod.Weekly]: '/wk',
  [SalaryPeriod.Daily]: '/day',
  [SalaryPeriod.Hourly]: '/hr',
}

export const JOBS_PAGE_SIZE = 20

export const SIMILAR_JOBS_LIMIT = 4

export const JOB_TABLE_COLUMNS = [
  'Role',
  'Matching index',
  'Location',
  'Details',
  'Salary',
  'Published',
  'Actions',
]

export const JOB_TABLE_MAX_SKILLS = 3

export const NEW_JOB_MAX_DAYS = 1
