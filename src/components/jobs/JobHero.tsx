import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/format'
import type { JobHeroProps } from '../../types/components/jobs'
import { AvatarSize } from '../../types/components/ui'
import { Avatar } from '../ui/Avatar'

export const JobHero = ({ job, className }: JobHeroProps) => {
  const published = formatDate(job.publishedAt)

  return (
    <header
      className={cn(
        'flex flex-col gap-5 md:items-center md:text-center lg:items-start lg:text-left',
        className,
      )}
    >
      <div className="flex items-center gap-4 md:flex-col lg:flex-row">
        <Avatar src={job.company.logoUrl} name={job.company.name} size={AvatarSize.Lg} />
        <h1 className="flex-1 text-2xl leading-tight font-medium md:text-5xl md:leading-[48px] md:font-normal">
          {job.title}
        </h1>
      </div>

      <p className="flex flex-col gap-x-2 text-purple md:flex-row md:justify-center md:text-lg lg:justify-start">
        <span className="font-medium">@{job.company.name}</span>
        {published && (
          <>
            <span aria-hidden className="hidden md:inline">
              •
            </span>
            <span>Published on {published}</span>
          </>
        )}
      </p>
    </header>
  )
}
