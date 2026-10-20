import { Bookmark } from 'lucide-react'
import { AUTH_URLS } from '../../constants/links'
import { SECONDARY_ACTION_CLASS } from '../../constants/ui'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { AnalyticsEvent, AuthCta, AuthCtaPlacement } from '../../types/analytics'
import type { SaveJobButtonProps } from '../../types/components/jobs'

export const SaveJobButton = ({ className }: SaveJobButtonProps) => {
  return (
    <a
      href={AUTH_URLS[AuthCta.Login]}
      className={cn(SECONDARY_ACTION_CLASS, className)}
      onClick={() =>
        track(AnalyticsEvent.AuthCtaClicked, {
          cta: AuthCta.Login,
          placement: AuthCtaPlacement.SaveJob,
        })
      }
    >
      <Bookmark aria-hidden className="size-4 text-primary-10" />
      Save
      <span className="sr-only"> this job (log in required)</span>
    </a>
  )
}
