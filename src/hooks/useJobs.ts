import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchJobs, jobKeys } from '../api/jobs'
import { JOBS_PAGE_SIZE } from '../constants/jobs'
import { CLIENT_FILTER_MAX_PAGES, CLIENT_FILTER_PAGE_SIZE } from '../constants/search'
import { toJobsQuery } from '../lib/jobSearch'
import { matchesLocations } from '../lib/location'
import { matchesSkills } from '../lib/skills'
import type { JobSearch } from '../types/search'

/**
 * The API cannot filter by location or skills (the fields behind its `country` and `skills`
 * parameters are empty), so with either selected the list is read in pages of
 * CLIENT_FILTER_PAGE_SIZE and filtered here. Every further page is one request the visitor asks
 * for, never a burst. The count is what was found so far, not a total.
 */
export const useJobs = (search: JobSearch) => {
  const { locations, skills } = search.filters
  const isClientFiltered = locations.length > 0 || skills.length > 0
  const query = toJobsQuery(search, isClientFiltered ? CLIENT_FILTER_PAGE_SIZE : JOBS_PAGE_SIZE)

  const result = useInfiniteQuery({
    queryKey: jobKeys.pages(query),
    queryFn: ({ pageParam, signal }) => fetchJobs({ ...query, pageNumber: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.hasNextPage ? pagination.pageNumber + 1 : undefined,
    placeholderData: keepPreviousData,
  })

  const pages = result.data?.pages
  const summary = useMemo(() => {
    if (!pages?.length) return undefined
    const loaded = pages.flatMap((page) => page.data)
    return {
      jobs: isClientFiltered
        ? loaded.filter((job) => matchesLocations(job, locations) && matchesSkills(job, skills))
        : loaded,
      totalItems: pages[0].pagination.totalItems,
      canLoadMore: isClientFiltered && result.hasNextPage && pages.length < CLIENT_FILTER_MAX_PAGES,
    }
  }, [pages, isClientFiltered, locations, skills, result.hasNextPage])

  return { ...result, summary, isClientFiltered }
}
