import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { SECONDARY_ACTION_CLASS } from '../../constants/ui'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { AnalyticsEvent } from '../../types/analytics'
import type { ShareJobProps } from '../../types/components/jobs'
import { ShareJobDialog } from './ShareJobDialog'

export const ShareJobButton = ({ job, className }: ShareJobProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
    track(AnalyticsEvent.ShareOpened, { job_id: job.id })
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className={cn(SECONDARY_ACTION_CLASS, 'cursor-pointer', className)}
      >
        <Share2 aria-hidden className="size-4 text-primary-10" />
        Share
        <span className="sr-only"> this job</span>
      </button>
      <ShareJobDialog job={job} open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
