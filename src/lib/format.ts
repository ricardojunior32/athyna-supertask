import { NEW_JOB_MAX_DAYS, SALARY_PERIOD_SUFFIX, SENIORITY_LABELS } from '../constants/jobs'
import { DAY_MS, HOUR_MS, MINUTE_MS } from '../constants/time'
import { type Job, SalaryPeriod, Seniority } from '../types/job'

// The API sends these as free strings, so a value outside the enum falls back instead of breaking.
const isEnumValue = <T extends string>(values: Record<string, T>, value: string | null): value is T => {
  return value !== null && (Object.values(values) as string[]).includes(value)
}

export const formatSeniority = (seniority: Job['seniority']): string | null => {
  const value = seniority?.trim()
  if (!value) return null
  const level = value.toUpperCase()
  return isEnumValue(Seniority, level) ? SENIORITY_LABELS[level] : value
}

export const formatEmploymentType = (type: Job['employmentType']): string | null => {
  return type?.trim() || null
}

export const formatLocation = (location: Job['location']): string | null => {
  const locality =
    location.locality?.replace(/[\s,]+$/, '').trim() ||
    [location.city, location.country].filter(Boolean).join(', ') ||
    null

  if (!location.isRemote) return locality
  if (!locality || /^remote$/i.test(locality)) return 'Remote'
  return /remote/i.test(locality) ? locality : `Remote · ${locality}`
}

const formatMoney = (amount: number, currency: string | null): string => {
  const compact = { notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1 } as const
  if (currency) {
    try {
      return new Intl.NumberFormat('en-US', { ...compact, style: 'currency', currency }).format(
        amount,
      )
    } catch {
    }
  }
  return new Intl.NumberFormat('en-US', compact).format(amount)
}

export const formatSalary = (salary: Job['salary']): string | null => {
  if (!salary) return null
  const min = salary.min && salary.min > 0 ? salary.min : null
  const max = salary.max && salary.max > 0 ? salary.max : null
  const suffix = isEnumValue(SalaryPeriod, salary.period) ? SALARY_PERIOD_SUFFIX[salary.period] : ''
  const money = (amount: number) => formatMoney(amount, salary.currency)

  if (min !== null && max !== null) {
    return (min === max ? money(min) : `${money(min)}–${money(max)}`) + suffix
  }
  if (min !== null) return `From ${money(min)}${suffix}`
  if (max !== null) return `Up to ${money(max)}${suffix}`
  return null
}

export const formatSkills = (skills: Job['skills']): string[] => {
  return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))]
}

const parseDate = (iso: string): Date | null => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })

export const formatDate = (iso: string): string | null => {
  const date = parseDate(iso)
  return date ? longDate.format(date) : null
}

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const daysSince = (date: Date, now: number): number => {
  return Math.max(0, Math.floor((now - date.getTime()) / DAY_MS))
}

export const formatRelativeDate = (iso: string, now: number = Date.now()): string | null => {
  const date = parseDate(iso)
  if (!date) return null
  const days = daysSince(date, now)
  if (days < 7) return relativeTime.format(-days, 'day')
  if (days < 30) return relativeTime.format(-Math.floor(days / 7), 'week')
  if (days < 365) return relativeTime.format(-Math.floor(days / 30), 'month')
  return relativeTime.format(-Math.floor(days / 365), 'year')
}

export const formatTimeAgo = (iso: string, now: number = Date.now()): string | null => {
  const date = parseDate(iso)
  if (!date) return null
  const elapsed = Math.max(0, now - date.getTime())
  if (elapsed < MINUTE_MS) return 'just now'
  if (elapsed < HOUR_MS) return relativeTime.format(-Math.floor(elapsed / MINUTE_MS), 'minute')
  if (elapsed < DAY_MS) return relativeTime.format(-Math.floor(elapsed / HOUR_MS), 'hour')
  return formatRelativeDate(iso, now)
}

// "today" or "yesterday" in formatRelativeDate terms.
export const isNewJob = (iso: string, now: number = Date.now()): boolean => {
  const date = parseDate(iso)
  return date !== null && daysSince(date, now) <= NEW_JOB_MAX_DAYS
}
