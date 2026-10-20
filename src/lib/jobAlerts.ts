import { JOB_ALERT_STORAGE_KEY } from '../constants/jobAlerts'
import type { JobAlerts } from '../types/jobAlerts'

// Deliberately loose: the real check is the confirmation email a backend would send.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email.trim())

const isJobAlerts = (value: unknown): value is JobAlerts => {
  if (typeof value !== 'object' || value === null) return false
  const { email, jobIds } = value as Record<string, unknown>
  return (
    typeof email === 'string' &&
    Array.isArray(jobIds) &&
    jobIds.every((id) => typeof id === 'string')
  )
}

// A new email replaces the old one, since a browser only keeps one inbox.
export const addJobAlert = (current: JobAlerts | null, email: string, jobId: string): JobAlerts => {
  const jobIds = current?.jobIds ?? []
  return { email, jobIds: jobIds.includes(jobId) ? jobIds : [...jobIds, jobId] }
}

export const hasJobAlert = (alerts: JobAlerts | null, jobId: string): boolean => {
  return alerts?.jobIds.includes(jobId) ?? false
}

// There is no backend for alerts yet, so they live in this browser only and nothing is sent.
// Storage can throw (private mode, blocked site data) or hold junk, which reads as "no alerts".
export const readJobAlerts = (): JobAlerts | null => {
  try {
    const stored = localStorage.getItem(JOB_ALERT_STORAGE_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : null
    return isJobAlerts(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const saveJobAlerts = (alerts: JobAlerts) => {
  try {
    localStorage.setItem(JOB_ALERT_STORAGE_KEY, JSON.stringify(alerts))
  } catch {
    // The confirmation still shows; the alert just won't be remembered on the next visit.
  }
}
