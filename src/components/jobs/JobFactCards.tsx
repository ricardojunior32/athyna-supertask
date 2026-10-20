import { cn } from '../../lib/cn'
import { getJobFacts } from '../../lib/jobFacts'
import type { JobFactCardsProps } from '../../types/components/jobs'

export const JobFactCards = ({ job, className }: JobFactCardsProps) => {
  return (
    <dl
      className={cn(
        'grid w-full grid-cols-2 gap-2 text-left md:gap-3 lg:grid-cols-1 lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-neutral-4 lg:bg-white',
        className,
      )}
    >
      {getJobFacts(job).map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex min-w-0 flex-col gap-1 rounded-xl border border-neutral-4 bg-white p-3 md:p-4 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:px-4 lg:py-3 lg:last:border-b-0"
        >
          <dt className="flex items-center gap-1.5 text-sm text-neutral-10">
            <Icon aria-hidden className="size-4 shrink-0 text-primary-10" />
            {label}
          </dt>
          <dd
            title={value ?? undefined}
            className={cn('line-clamp-2 font-medium break-words', value === null && 'text-neutral-9')}
          >
            {value ?? 'Not specified'}
          </dd>
        </div>
      ))}
    </dl>
  )
}
