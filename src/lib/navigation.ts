import { Arrival } from '../types/analytics'

export const jobPath = (id: string): string => {
  return `/jobs/${id}`
}

export const readFrom = (state: unknown): string | undefined => {
  if (state && typeof state === 'object' && 'from' in state && typeof state.from === 'string') {
    return state.from
  }
  return undefined
}

export const readArrival = (state: unknown): Arrival => {
  if (state && typeof state === 'object' && 'source' in state) {
    if (state.source === Arrival.List || state.source === Arrival.SimilarJobs) return state.source
  }
  return Arrival.Direct
}
