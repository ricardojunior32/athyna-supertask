import { useMemo } from 'react'
import { AUTH_URLS } from '../../constants/links'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { resolveSkills } from '../../lib/skills'
import { AnalyticsEvent, ApplyPlacement, AuthCta, AuthCtaPlacement } from '../../types/analytics'
import type { JobSummaryProps } from '../../types/components/jobs'
import { ButtonSize, ButtonVariant, TagSize } from '../../types/components/ui'
import { SkillsSource } from '../../types/skills'
import { Button } from '../ui/Button'
import { ApplyButton } from './ApplyButton'
import { JobAlertButton } from './JobAlertButton'
import { JobFactCards } from './JobFactCards'
import { MatchTeaser } from './MatchTeaser'
import { SaveJobButton } from './SaveJobButton'
import { ShareJobButton } from './ShareJobButton'
import { SkillTag } from './SkillTag'

export const JobSummary = ({ job, applyRef, className }: JobSummaryProps) => {
  const { skills, source } = useMemo(
    () => resolveSkills({ skills: job.skills, description: job.description }),
    [job.skills, job.description],
  )

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-xl border border-foreground bg-background p-4 shadow-hard md:items-center md:p-6 lg:items-stretch',
        className,
      )}
    >
      <div className="contents lg:flex lg:min-h-0 lg:flex-col lg:gap-4 lg:overflow-y-auto">
        <JobFactCards job={job} />
        {skills.length > 0 && (
          <ul
            aria-label="Skills"
            className="flex flex-wrap gap-1.5 md:justify-center lg:justify-start"
          >
            {skills.map((skill) => (
              <li key={skill} className="flex max-w-full">
                <SkillTag skill={skill} derived={source === SkillsSource.Derived} size={TagSize.Md} />
              </li>
            ))}
          </ul>
        )}
        <JobAlertButton job={job} className="self-start md:self-center lg:self-start" />
      </div>
      <ApplyButton job={job} placement={ApplyPlacement.Hero} ref={applyRef} />
      <Button
        href={AUTH_URLS[AuthCta.Login]}
        variant={ButtonVariant.Outline}
        size={ButtonSize.Lg}
        fullWidth
        onClick={() =>
          track(AnalyticsEvent.AuthCtaClicked, {
            cta: AuthCta.Login,
            placement: AuthCtaPlacement.UnlockAllJobs,
          })
        }
      >
        Unlock all jobs
        <span className="sr-only"> (log in required)</span>
      </Button>
      <div className="grid w-full grid-cols-2 gap-2">
        <SaveJobButton />
        <ShareJobButton job={job} />
      </div>
      <MatchTeaser href={AUTH_URLS[AuthCta.Login]} className="self-start md:self-center" />
    </div>
  )
}
