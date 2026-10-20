import { formatTimeAgo } from '../../lib/format'
import type { JobCardProps } from '../../types/components/jobs'
import { Avatar } from '../ui/Avatar'
import { JobFacts } from './JobFacts'
import { JobLink } from './JobLink'
import { MatchTeaser } from './MatchTeaser'

export const JobCard = ({ job, pinnedSkills }: JobCardProps) => {
  const updated = formatTimeAgo(job.updatedAt)

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-xl border border-neutral-4 bg-white p-4 transition-colors hover:border-primary-8 hover:bg-primary-2">
      <div className="flex items-start gap-3">
        <Avatar src={job.company.logoUrl} name={job.company.name} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 leading-snug font-medium">
            <JobLink job={job} className="after:absolute after:inset-0 after:rounded-xl">
              {job.title}
            </JobLink>
          </h3>
          <p className="truncate text-sm text-neutral-10">{job.company.name}</p>
        </div>
      </div>
      <JobFacts job={job} pinnedSkills={pinnedSkills} />
      <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-neutral-4 pt-3">
        <MatchTeaser />
        {updated && (
          <p className="text-xs text-neutral-10">
            Updated <time dateTime={job.updatedAt}>{updated}</time>
          </p>
        )}
      </footer>
    </article>
  )
}
