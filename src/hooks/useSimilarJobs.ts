import { useQuery } from '@tanstack/react-query'
import { jobKeys } from '../api/jobs'
import type { Job } from '../types/job'
import { fetchSimilarJobs } from '../lib/similarJobs'

export const useSimilarJobs = (job: Job) => {
  return useQuery({
    queryKey: jobKeys.similar(job.id),
    queryFn: ({ signal }) => fetchSimilarJobs(job, signal),
    staleTime: 5 * 60_000,
  })
}
