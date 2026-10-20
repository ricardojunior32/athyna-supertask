import type { JobListProps, JobListSkeletonProps } from '../../types/components/jobs'
import { Skeleton } from '../ui/Skeleton'
import { JobCard } from './JobCard'
import { JobTable } from './JobTable'

export const JobList = ({ jobs, pinnedSkills }: JobListProps) => {
  return (
    <>
      <div className="hidden xl:block">
        <JobTable jobs={jobs} pinnedSkills={pinnedSkills} />
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:hidden">
        {jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} pinnedSkills={pinnedSkills} />
          </li>
        ))}
      </ul>
    </>
  )
}

export const JobListSkeleton = ({ rows = 8 }: JobListSkeletonProps) => {
  return (
    <div
      role="status"
      aria-label="Loading jobs"
      className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1"
    >
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl xl:h-14" />
      ))}
    </div>
  )
}
