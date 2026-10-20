import type { Arrival } from './analytics'

export type JobLinkState = {
  from?: string
  source?: Exclude<Arrival, Arrival.Direct>
}
