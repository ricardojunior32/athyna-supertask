import { ArrowUpRight } from 'lucide-react'
import { track } from '../../lib/analytics'
import { AnalyticsEvent } from '../../types/analytics'
import type { ApplyButtonProps } from '../../types/components/jobs'
import { ButtonSize, ButtonVariant } from '../../types/components/ui'
import { Button } from '../ui/Button'

export const ApplyButton = ({
  job,
  placement,
  ref,
  variant = ButtonVariant.Primary,
  fullWidth = true,
  inert,
  className,
}: ApplyButtonProps) => {
  const href = job.applicationUrl || job.url
  if (!href) return null

  return (
    <Button
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      size={ButtonSize.Lg}
      variant={variant}
      fullWidth={fullWidth}
      inert={inert}
      className={className}
      onClick={() => track(AnalyticsEvent.ApplyClicked, { job_id: job.id, placement })}
    >
      Apply now
      <ArrowUpRight aria-hidden className="size-5" />
      <span className="sr-only">(opens in a new tab)</span>
    </Button>
  )
}
