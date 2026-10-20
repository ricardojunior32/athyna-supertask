import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { ActiveFilters } from '../components/jobs/ActiveFilters'
import { JobFilterBar } from '../components/jobs/JobFilterBar'
import { JobList, JobListSkeleton } from '../components/jobs/JobList'
import { PopularSearches } from '../components/jobs/PopularSearches'
import { SearchBar } from '../components/jobs/SearchBar'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { StateMessage } from '../components/ui/StateMessage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useJobs } from '../hooks/useJobs'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useReportSearch } from '../hooks/useReportSearch'
import { LOCATION_HINT } from '../constants/locations'
import { AUTH_URLS } from '../constants/links'
import { NO_FILTERS, POPULAR_SEARCHES, SKILLS_HINT } from '../constants/search'
import { track } from '../lib/analytics'
import { cn } from '../lib/cn'
import { describeError } from '../lib/errors'
import {
  hasActiveFilters,
  readJobSearch,
  splitRemoteKeyword,
  writeJobSearch,
} from '../lib/jobSearch'
import { AnalyticsEvent, AuthCta, AuthCtaPlacement } from '../types/analytics'
import { ButtonSize, ButtonVariant, StateRole } from '../types/components/ui'
import { type JobFilters, type JobSearch, SearchSource } from '../types/search'

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useMemo(() => readJobSearch(searchParams), [searchParams])
  const { q, filters } = search
  const isRemoteOnly = filters.remote
  const resultsRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useDocumentTitle(q ? `${q} jobs` : 'Remote jobs in AI and tech')

  const {
    summary,
    error,
    isPending,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isClientFiltered,
  } = useJobs(search)

  const revealTarget = useRef<string | null>(null)
  const [revealRequests, countRevealRequest] = useReducer((count: number) => count + 1, 0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isSettled = !isPending && !isPlaceholderData

  const resultsCount = isClientFiltered ? summary?.jobs.length : summary?.totalItems
  useReportSearch(q, filters, isSettled && !isError ? resultsCount : undefined, isClientFiltered)

  useEffect(() => {
    const target = revealTarget.current
    if (target === null || !isSettled) return
    if (target !== q) return

    revealTarget.current = null
    resultsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [revealRequests, isSettled, q, prefersReducedMotion])

  const revealWhenLoaded = useCallback((query: string) => {
    revealTarget.current = query
    countRevealRequest()
  }, [])

  const patchSearch = useCallback(
    (patch: (current: JobSearch) => JobSearch, replace = false) => {
      setSearchParams((params) => writeJobSearch(patch(readJobSearch(params))), {
        replace,
        preventScrollReset: true,
      })
    },
    [setSearchParams],
  )

  const applySearch = useCallback(
    (typed: string, source: SearchSource) => {
      const { q: next, remote } = splitRemoteKeyword(typed)
      if (remote && !isRemoteOnly) {
        track(AnalyticsEvent.FilterChanged, { filter: 'remote', value: true })
      }
      patchSearch(
        (current) => ({
          q: next,
          filters: remote ? { ...current.filters, remote: true } : current.filters,
        }),
        source === SearchSource.Typing,
      )
      const search = searchRef.current?.getBoundingClientRect()
      const results = resultsRef.current?.getBoundingClientRect()
      const isOverResults = !!search && !!results && results.top < search.bottom
      if ((source === SearchSource.Submit && (next || remote)) || isOverResults) {
        revealWhenLoaded(next)
      } else revealTarget.current = null
      return next
    },
    [patchSearch, revealWhenLoaded, isRemoteOnly],
  )

  const changeFilters = (next: JobFilters) => {
    revealTarget.current = null
    for (const name of Object.keys(next) as Array<keyof JobFilters>) {
      const value = next[name]
      if (value !== filters[name]) {
        track(AnalyticsEvent.FilterChanged, {
          filter: name,
          value: Array.isArray(value) ? value.join(',') : value,
        })
      }
    }
    patchSearch((current) => ({ ...current, filters: next }))
  }

  const choosePopularSearch = (term: string) => {
    if (term) track(AnalyticsEvent.PopularSearchClicked, { term })
    applySearch(term, SearchSource.Submit)
  }

  const clearAll = () => {
    revealTarget.current = null
    patchSearch(() => ({ q: '', filters: NO_FILTERS }))
  }

  const loadMoreButton = (fullWidth: boolean) => (
    <Button
      variant={ButtonVariant.Outline}
      size={fullWidth ? ButtonSize.Lg : ButtonSize.Md}
      fullWidth={fullWidth}
      onClick={() => fetchNextPage()}
      disabled={isFetchingNextPage}
    >
      {isFetchingNextPage
        ? 'Checking…'
        : isFetchNextPageError
          ? 'Could not check more jobs. Try again'
          : 'Load more jobs'}
    </Button>
  )

  const clientFilterHint = [
    filters.locations.length > 0 && LOCATION_HINT,
    filters.skills.length > 0 && SKILLS_HINT,
  ]
    .filter(Boolean)
    .join(' ')

  const filtersActive = hasActiveFilters(filters)
  const emptyHint = q
    ? `Search looks for your exact phrase. Try a shorter or more general term${filtersActive ? ', or remove a filter' : ''}.`
    : filtersActive
      ? 'Try removing a filter.'
      : undefined

  return (
    <>
      <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 text-center md:pt-4">
        <h1 className="text-5xl leading-none tracking-[-0.025em] md:text-7xl">
          Be the future{' '}
          <span className="block lg:inline">
            of <span className="font-serif text-light-purple">AI</span>
          </span>
        </h1>
        <p className="mt-6 max-w-2xl leading-relaxed font-light sm:text-lg xl:text-xl">
          Find your new opportunity to grow in the hottest field in the world. Thousands of jobs in
          AI at your fingers with Athyna.
        </p>
      </section>

      <div
        ref={searchRef}
        className="relative z-30 mt-6 bg-background px-6 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-6 after:bg-linear-to-b after:from-background after:to-transparent md:sticky md:top-20 md:z-40"
      >
        <div className="mx-auto w-full max-w-[900px]">
          <SearchBar value={q} onSearch={applySearch} examples={POPULAR_SEARCHES} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] justify-center px-6 pb-12 md:pb-16">
        <PopularSearches
          selected={q}
          onSelect={choosePopularSearch}
          className="mt-6 max-w-[900px]"
        />
      </div>

      <section
        ref={resultsRef}
        aria-labelledby="results-title"
        className="mx-auto flex w-full max-w-results scroll-mt-6 flex-col md:scroll-mt-21 gap-4 px-6"
      >
        <JobFilterBar filters={filters} onChange={changeFilters} />
        <ActiveFilters
          q={q}
          filters={filters}
          onClearSearch={() => applySearch('', SearchSource.Submit)}
          onChange={changeFilters}
          onClearAll={clearAll}
        />

        <div className="flex min-h-7 items-center gap-3">
          <h2 id="results-title" aria-live="polite">
            {summary && isClientFiltered ? (
              <>
                <span className="font-medium text-purple">{summary.jobs.length}</span> matching{' '}
                {summary.jobs.length === 1 ? 'job' : 'jobs'}
              </>
            ) : summary ? (
              <>
                <span className="font-medium text-purple">
                  {summary.totalItems.toLocaleString('en-US')}
                </span>{' '}
                matching {summary.totalItems === 1 ? 'job' : 'jobs'}
              </>
            ) : (
              <span className="sr-only">Jobs</span>
            )}
          </h2>
          {isPending && <Skeleton className="h-5 w-40" />}
        </div>

        {isPending ? (
          <JobListSkeleton />
        ) : isError ? (
          <StateMessage
            role={StateRole.Alert}
            title="We couldn't load jobs"
            description={describeError(error)}
            action={
              <Button onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Retrying…' : 'Try again'}
              </Button>
            }
          />
        ) : !summary ? null : summary.jobs.length === 0 ? (
          <StateMessage
            title={
              isClientFiltered && hasNextPage
                ? 'No matching jobs found yet'
                : q
                  ? `No jobs match “${q}”`
                  : filtersActive
                    ? 'No jobs match these filters'
                    : 'No jobs available right now'
            }
            description={isClientFiltered ? clientFilterHint : emptyHint}
            action={
              summary.canLoadMore ? (
                loadMoreButton(false)
              ) : (
                (q || filtersActive) && (
                  <Button variant={ButtonVariant.Outline} onClick={clearAll}>
                    Clear all
                  </Button>
                )
              )
            }
          />
        ) : (
          <div
            aria-busy={isPlaceholderData}
            className={cn(
              'flex flex-col gap-6 transition-opacity',
              isPlaceholderData && 'opacity-50',
            )}
          >
            <JobList jobs={summary.jobs} pinnedSkills={filters.skills} />
            {summary.canLoadMore ? (
              loadMoreButton(true)
            ) : hasNextPage && (
              <Button
                href={AUTH_URLS[AuthCta.Login]}
                size={ButtonSize.Lg}
                fullWidth
                onClick={() =>
                  track(AnalyticsEvent.AuthCtaClicked, {
                    cta: AuthCta.Login,
                    placement: AuthCtaPlacement.AllJobs,
                  })
                }
              >
                Login to discover all jobs
              </Button>
            )}
          </div>
        )}
      </section>
    </>
  )
}
