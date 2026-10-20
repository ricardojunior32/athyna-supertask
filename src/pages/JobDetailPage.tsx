import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ApplyButton } from '../components/jobs/ApplyButton'
import { FloatingApplyButton } from '../components/jobs/FloatingApplyButton'
import { JobDescription } from '../components/jobs/JobDescription'
import { JobHero } from '../components/jobs/JobHero'
import { JobSummary } from '../components/jobs/JobSummary'
import { SimilarJobs } from '../components/jobs/SimilarJobs'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { StateMessage } from '../components/ui/StateMessage'
import { JOBS_PATH } from '../constants/routes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useJob } from '../hooks/useJob'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { track } from '../lib/analytics'
import { cn } from '../lib/cn'
import { describeError, isNotFound } from '../lib/errors'
import { formatSalary } from '../lib/format'
import { readArrival, readFrom } from '../lib/navigation'
import { resolveSkills } from '../lib/skills'
import { AnalyticsEvent, ApplyPlacement } from '../types/analytics'
import { StateRole } from '../types/components/ui'

const LAYOUT =
  'flex flex-col gap-8 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12'
const LAYOUT_TOP = 'flex flex-col gap-5 lg:contents'
const LAYOUT_TITLE = 'lg:col-start-2'
const LAYOUT_SUMMARY =
  'lg:sticky lg:top-30 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-h-[calc(100svh-9rem)] lg:self-start'
const LAYOUT_BODY = 'lg:col-start-2'

const JobDetailSkeleton = () => {
  return (
    <div role="status" aria-label="Loading job" className={LAYOUT}>
      <div className={LAYOUT_TOP}>
        <div className={cn('flex flex-col gap-5 md:items-center lg:items-start', LAYOUT_TITLE)}>
          <div className="flex w-full items-center gap-4 md:flex-col lg:flex-row">
            <Skeleton className="size-16 shrink-0 rounded-xl md:size-20" />
            <Skeleton className="h-8 flex-1 md:h-12 md:w-full md:max-w-lg md:flex-none" />
          </div>
          <Skeleton className="h-6 w-2/3 max-w-xs" />
        </div>
        <div
          className={cn(
            'flex w-full flex-col gap-4 rounded-xl border border-neutral-4 p-4 md:p-6',
            LAYOUT_SUMMARY,
          )}
        >
          <div className="grid grid-cols-2 gap-2 md:gap-3 lg:hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[74px] rounded-xl md:h-[82px]" />
            ))}
          </div>
          <Skeleton className="hidden h-[195px] rounded-xl lg:block" />
          <Skeleton className="h-14 rounded-full" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>
      <div className={cn('flex flex-col gap-3', LAYOUT_BODY)}>
        <Skeleton className="h-6 w-1/3" />
        {['w-full', 'w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-2/3'].map(
          (width, index) => (
            <Skeleton key={index} className={`h-4 ${width}`} />
          ),
        )}
      </div>
    </div>
  )
}

export const JobDetailPage = () => {
  const { id = '' } = useParams()
  const location = useLocation()
  const backTo = readFrom(location.state) ?? JOBS_PATH
  const { data: job, error, isPending, isError, isFetching, refetch } = useJob(id)
  const heroApplyRef = useRef<HTMLAnchorElement>(null)
  const footerApplyRef = useRef<HTMLAnchorElement>(null)
  const isSmallScreen = useMediaQuery('(max-width: 47.99rem)')

  useDocumentTitle(job ? `${job.title} at ${job.company.name}` : 'Job')

  const arrival = readArrival(location.state)
  const viewedJobId = useRef<string | null>(null)
  useEffect(() => {
    if (!job || viewedJobId.current === job.id) return
    viewedJobId.current = job.id
    track(AnalyticsEvent.JobViewed, {
      job_id: job.id,
      arrival,
      is_remote: job.location.isRemote,
      has_salary: formatSalary(job.salary) !== null,
      seniority: job.seniority,
      employment_type: job.employmentType,
      skills_source: resolveSkills(job).source,
    })
  }, [job, arrival])

  return (
    <div className="mx-auto flex w-full max-w-article flex-col gap-8 px-6 lg:max-w-detail">
      <Link
        to={backTo}
        className="sticky top-18 z-40 -ml-3 inline-flex w-fit items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-sm text-foreground/60 backdrop-blur-sm transition-colors hover:text-foreground md:top-20"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Back to jobs
      </Link>

      {isPending ? (
        <JobDetailSkeleton />
      ) : isError && isNotFound(error) ? (
        <StateMessage
          title="This job is no longer available"
          description="It may have been filled or removed. There are plenty of other roles to explore."
          action={<Button to={JOBS_PATH}>Browse all jobs</Button>}
        />
      ) : !job ? (
        <StateMessage
          role={StateRole.Alert}
          title="We couldn't load this job"
          description={describeError(error)}
          action={
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Try again'}
            </Button>
          }
        />
      ) : (
        <article className={LAYOUT}>
          <div className={LAYOUT_TOP}>
            <JobHero job={job} className={LAYOUT_TITLE} />
            <JobSummary job={job} applyRef={heroApplyRef} className={LAYOUT_SUMMARY} />
          </div>
          <div className={cn('flex flex-col gap-8', LAYOUT_BODY)}>
            {job.description && (
              <>
                <JobDescription markdown={job.description} />
                <ApplyButton
                  job={job}
                  placement={ApplyPlacement.Footer}
                  ref={footerApplyRef}
                  className="lg:hidden"
                />
              </>
            )}
            <SimilarJobs job={job} />
          </div>
          {isSmallScreen && (
            <FloatingApplyButton
              job={job}
              heroButton={heroApplyRef}
              footerButton={footerApplyRef}
            />
          )}
        </article>
      )}
    </div>
  )
}
