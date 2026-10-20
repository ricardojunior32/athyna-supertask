import { useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router'
import { jobKeys } from '../../api/jobs'
import { JOBS_PATH } from '../../constants/routes'
import { track } from '../../lib/analytics'
import { jobPath, readFrom } from '../../lib/navigation'
import { AnalyticsEvent, Arrival } from '../../types/analytics'
import type { JobLinkProps } from '../../types/components/jobs'
import type { JobLinkState } from '../../types/navigation'

export const JobLink = ({ job, ref, className, children }: JobLinkProps) => {
  const location = useLocation()
  const { id: fromJobId } = useParams()
  const queryClient = useQueryClient()

  const source = location.pathname === JOBS_PATH ? Arrival.List : Arrival.SimilarJobs
  const from =
    source === Arrival.List ? location.pathname + location.search : readFrom(location.state)
  const state: JobLinkState = { from, source }

  const handleClick = () => {
    queryClient.setQueryData(jobKeys.detail(job.id), job, { updatedAt: 0 })
    if (source === Arrival.List) track(AnalyticsEvent.JobOpened, { job_id: job.id, source })
    else track(AnalyticsEvent.SimilarJobClicked, { job_id: job.id, from_job_id: fromJobId ?? null })
  }

  return (
    <Link
      ref={ref}
      to={jobPath(job.id)}
      state={state}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}
