import { Sparkles } from 'lucide-react'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { AnalyticsEvent, AuthCta, AuthCtaPlacement } from '../../types/analytics'
import type { MatchTeaserProps } from '../../types/components/jobs'
import { TagVariant } from '../../types/components/ui'
import { Tag } from '../ui/Tag'

export const MatchTeaser = ({ href, compact = false, className }: MatchTeaserProps) => {
  const classes = cn('inline-flex items-center gap-2 text-sm whitespace-nowrap', className)
  const content = (
    <>
      <span className={compact ? 'sr-only' : 'text-neutral-11'}>Match percentage:</span>
      <Tag variant={TagVariant.Primary} icon={<Sparkles aria-hidden />}>
        Login to discover
      </Tag>
    </>
  )

  return href ? (
    <a
      href={href}
      className={classes}
      onClick={() =>
        track(AnalyticsEvent.AuthCtaClicked, {
          cta: AuthCta.Login,
          placement: AuthCtaPlacement.MatchTeaser,
        })
      }
    >
      {content}
    </a>
  ) : (
    <span className={classes}>{content}</span>
  )
}
