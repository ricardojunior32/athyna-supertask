import { useEffect, useRef } from 'react'
import { SIMILAR_JOBS_LIMIT } from '../../constants/jobs'
import { useSimilarJobs } from '../../hooks/useSimilarJobs'
import { track } from '../../lib/analytics'
import { AnalyticsEvent } from '../../types/analytics'
import type { SimilarJobsProps } from '../../types/components/jobs'
import { Skeleton } from '../ui/Skeleton'
import { JobCard } from './JobCard'

export const SimilarJobs = ({ job }: SimilarJobsProps) => {
  const { data: jobs, isPending, isError } = useSimilarJobs(job)
  const sectionRef = useRef<HTMLElement>(null)
  const count = jobs?.length ?? 0

  useEffect(() => {
    const section = sectionRef.current
    if (!section || count === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        track(AnalyticsEvent.SimilarJobsViewed, { job_id: job.id, count })
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [job.id, count])

  if (isError || jobs?.length === 0) return null

  return (
    <section ref={sectionRef} aria-labelledby="similar-jobs-title" className="flex flex-col gap-4">
      <h2 id="similar-jobs-title" className="text-2xl">
        Similar jobs
      </h2>
      {isPending ? (
        <div
          role="status"
          aria-label="Loading similar jobs"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {Array.from({ length: SIMILAR_JOBS_LIMIT }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {jobs.map((similar) => (
            <li key={similar.id}>
              <JobCard job={similar} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
