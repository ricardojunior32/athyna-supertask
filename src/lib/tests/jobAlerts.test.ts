import { describe, expect, it } from 'vitest'
import { addJobAlert, hasJobAlert, isValidEmail } from '../jobAlerts'

describe('isValidEmail', () => {
  it('accepts a regular address, ignoring surrounding spaces', () => {
    expect(isValidEmail('ana@example.com')).toBe(true)
    expect(isValidEmail('  ana.silva+jobs@mail.co.uk ')).toBe(true)
  })

  it('rejects incomplete addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('ana')).toBe(false)
    expect(isValidEmail('ana@example')).toBe(false)
    expect(isValidEmail('ana @example.com')).toBe(false)
  })
})

describe('addJobAlert', () => {
  it('starts the list with the first job', () => {
    expect(addJobAlert(null, 'ana@example.com', 'job-1')).toEqual({
      email: 'ana@example.com',
      jobIds: ['job-1'],
    })
  })

  it('adds new jobs once and keeps the latest email', () => {
    const first = addJobAlert(null, 'ana@example.com', 'job-1')
    const second = addJobAlert(first, 'ana@work.com', 'job-2')
    expect(second).toEqual({ email: 'ana@work.com', jobIds: ['job-1', 'job-2'] })
    expect(addJobAlert(second, 'ana@work.com', 'job-1').jobIds).toEqual(['job-1', 'job-2'])
  })
})

describe('hasJobAlert', () => {
  it('is on only for the jobs that created an alert', () => {
    const alerts = { email: 'ana@example.com', jobIds: ['job-1'] }
    expect(hasJobAlert(alerts, 'job-1')).toBe(true)
    expect(hasJobAlert(alerts, 'job-2')).toBe(false)
    expect(hasJobAlert(null, 'job-1')).toBe(false)
  })
})
