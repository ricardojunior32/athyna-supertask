import { describe, expect, it } from 'vitest'
import { formatSalary, isNewJob } from '../format'

const salary = (min: number | null, max: number | null, currency: string | null = 'USD', period: string | null = 'yearly') => ({
  min,
  max,
  currency,
  period,
})

describe('formatSalary', () => {
  it('returns nothing without a salary', () => {
    expect(formatSalary(null)).toBeNull()
    expect(formatSalary(salary(null, null))).toBeNull()
  })

  it('treats zero and negative amounts as missing', () => {
    expect(formatSalary(salary(0, 0))).toBeNull()
    expect(formatSalary(salary(-1, null))).toBeNull()
    expect(formatSalary(salary(0, 80000))).toBe('Up to $80K/yr')
  })

  it('formats a range', () => {
    expect(formatSalary(salary(100000, 150000))).toBe('$100K–$150K/yr')
    expect(formatSalary(salary(85500, 1500000))).toBe('$85.5K–$1.5M/yr')
  })

  it('collapses a range whose ends are equal', () => {
    expect(formatSalary(salary(120000, 120000))).toBe('$120K/yr')
  })

  it('formats an open-ended range', () => {
    expect(formatSalary(salary(50000, null))).toBe('From $50K/yr')
    expect(formatSalary(salary(null, 80000))).toBe('Up to $80K/yr')
  })

  it('adds a suffix for each known period', () => {
    expect(formatSalary(salary(5000, 5000, 'USD', 'monthly'))).toBe('$5K/mo')
    expect(formatSalary(salary(1200, 1200, 'USD', 'weekly'))).toBe('$1.2K/wk')
    expect(formatSalary(salary(300, 300, 'USD', 'daily'))).toBe('$300/day')
    expect(formatSalary(salary(45, 60, 'USD', 'hourly'))).toBe('$45–$60/hr')
  })

  it('omits the suffix for a missing or unknown period', () => {
    expect(formatSalary(salary(100000, 150000, 'USD', null))).toBe('$100K–$150K')
    expect(formatSalary(salary(100000, 150000, 'USD', 'biweekly'))).toBe('$100K–$150K')
  })

  it('uses the symbol of the currency', () => {
    expect(formatSalary(salary(90000, null, 'EUR'))).toBe('From €90K/yr')
    expect(formatSalary(salary(90000, null, 'GBP'))).toBe('From £90K/yr')
  })

  it('falls back to a bare number without a usable currency', () => {
    expect(formatSalary(salary(100000, 150000, null))).toBe('100K–150K/yr')
    expect(formatSalary(salary(100000, 150000, 'not-a-currency'))).toBe('100K–150K/yr')
  })
})

describe('isNewJob', () => {
  const now = Date.parse('2026-10-19T12:00:00Z')

  it('flags jobs published today or yesterday', () => {
    expect(isNewJob('2026-10-19T08:00:00Z', now)).toBe(true)
    expect(isNewJob('2026-10-18T09:00:00Z', now)).toBe(true)
  })

  it('does not flag older jobs', () => {
    expect(isNewJob('2026-10-17T09:00:00Z', now)).toBe(false)
  })

  it('does not flag an unparseable date', () => {
    expect(isNewJob('not a date', now)).toBe(false)
  })
})
