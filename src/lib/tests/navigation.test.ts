import { describe, expect, it } from 'vitest'
import { Arrival } from '../../types/analytics'
import { readArrival } from '../navigation'

describe('readArrival', () => {
  it('reads the source a link left in the navigation state', () => {
    expect(readArrival({ source: 'list' })).toBe(Arrival.List)
    expect(readArrival({ source: 'similar_jobs', from: '/?q=react' })).toBe(Arrival.SimilarJobs)
  })

  it('treats a missing state as a direct visit', () => {
    expect(readArrival(null)).toBe(Arrival.Direct)
    expect(readArrival(undefined)).toBe(Arrival.Direct)
    expect(readArrival({})).toBe(Arrival.Direct)
    expect(readArrival({ from: '/' })).toBe(Arrival.Direct)
  })

  it('treats anything it does not recognise as a direct visit', () => {
    expect(readArrival('list')).toBe(Arrival.Direct)
    expect(readArrival({ source: 'email' })).toBe(Arrival.Direct)
    expect(readArrival({ source: 42 })).toBe(Arrival.Direct)
    expect(readArrival({ source: null })).toBe(Arrival.Direct)
  })
})
