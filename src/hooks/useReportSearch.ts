import { useEffect, useRef } from 'react'
import { SEARCH_SETTLE_MS } from '../constants/search'
import { track } from '../lib/analytics'
import { activeFilterNames } from '../lib/jobSearch'
import { AnalyticsEvent } from '../types/analytics'
import type { JobFilters } from '../types/search'

let lastReported = ''

export const useReportSearch = (
  q: string,
  filters: JobFilters,
  resultsCount: number | undefined,
  resultsPartial: boolean,
) => {
  const pending = useRef<(() => void) | null>(null)

  useEffect(() => {
    pending.current = null
    const signature = JSON.stringify([q, filters])
    if (!q || resultsCount === undefined || signature === lastReported) return

    const report = () => {
      pending.current = null
      lastReported = signature
      track(AnalyticsEvent.JobsSearched, {
        query: q,
        results_count: resultsCount,
        results_partial: resultsPartial,
        filters: activeFilterNames(filters),
      })
    }
    pending.current = report
    const timer = setTimeout(report, SEARCH_SETTLE_MS)
    return () => clearTimeout(timer)
  }, [q, filters, resultsCount, resultsPartial])

  useEffect(() => () => pending.current?.(), [])
}
