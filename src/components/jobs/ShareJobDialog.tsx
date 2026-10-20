import { Check, Copy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { COPY_FEEDBACK_MS, SOCIAL_SHARE_CHANNELS } from '../../constants/share'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { formatEmploymentType, formatLocation, formatSalary } from '../../lib/format'
import { buildShareUrl, jobShareText, jobShareUrl } from '../../lib/share'
import { AnalyticsEvent } from '../../types/analytics'
import type { ShareJobDialogProps } from '../../types/components/jobs'
import { AvatarSize } from '../../types/components/ui'
import { CopyStatus, ShareChannel, type SocialShareChannel } from '../../types/share'
import { Avatar } from '../ui/Avatar'
import { Modal } from '../ui/Modal'

const CHANNEL_BUTTON = 'flex flex-col items-center gap-2 rounded-xl p-1 text-xs font-medium'
const CHANNEL_ICON =
  'flex size-12 items-center justify-center rounded-full transition-[filter,transform] duration-200 group-hover:brightness-110 group-active:scale-95'

const COPY_LABELS: Record<CopyStatus, string> = {
  [CopyStatus.Idle]: 'Copy link',
  [CopyStatus.Copied]: 'Copied!',
  [CopyStatus.Failed]: 'Copy failed',
}

export const ShareJobDialog = ({ job, open, onClose }: ShareJobDialogProps) => {
  const [copyStatus, setCopyStatus] = useState(CopyStatus.Idle)
  const payload = useMemo(
    () => ({
      url: jobShareUrl(job.id, window.location.origin),
      text: jobShareText(job.title, job.company.name),
    }),
    [job.id, job.title, job.company.name],
  )
  const details = [
    formatLocation(job.location),
    formatEmploymentType(job.employmentType),
    formatSalary(job.salary),
  ].filter(Boolean)

  useEffect(() => {
    // A failed copy keeps the link field open until the dialog closes.
    if (copyStatus !== CopyStatus.Copied) return
    const timeout = setTimeout(() => setCopyStatus(CopyStatus.Idle), COPY_FEEDBACK_MS)
    return () => clearTimeout(timeout)
  }, [copyStatus])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(payload.url)
      setCopyStatus(CopyStatus.Copied)
      track(AnalyticsEvent.JobShared, { job_id: job.id, channel: ShareChannel.CopyLink })
    } catch {
      setCopyStatus(CopyStatus.Failed)
    }
  }

  return (
    <Modal
      open={open}
      title="Share this job"
      onClose={() => {
        setCopyStatus(CopyStatus.Idle)
        onClose()
      }}
    >
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-4 bg-white px-4 py-6 text-center">
        <Avatar src={job.company.logoUrl} name={job.company.name} size={AvatarSize.Lg} />
        <p className="mt-1 line-clamp-2 text-lg leading-snug font-medium">{job.title}</p>
        <p className="text-sm font-medium text-purple">@{job.company.name}</p>
        {details.length > 0 && <p className="text-sm text-neutral-10">{details.join(' · ')}</p>}
      </div>

      <ul className="grid grid-cols-3 gap-y-4 sm:grid-cols-6">
        <li className="flex justify-center">
          <button type="button" onClick={copyLink} className={cn('group cursor-pointer', CHANNEL_BUTTON)}>
            <span
              className={cn(
                CHANNEL_ICON,
                copyStatus === CopyStatus.Copied ? 'bg-mint' : 'bg-neutral-4',
              )}
            >
              {copyStatus === CopyStatus.Copied ? (
                <Check aria-hidden className="size-5" />
              ) : (
                <Copy aria-hidden className="size-5" />
              )}
            </span>
            <span aria-live="polite">{COPY_LABELS[copyStatus]}</span>
          </button>
        </li>
        {(Object.keys(SOCIAL_SHARE_CHANNELS) as SocialShareChannel[]).map((channel) => {
          const { label, icon: Icon, className } = SOCIAL_SHARE_CHANNELS[channel]
          return (
            <li key={channel} className="flex justify-center">
              <a
                href={buildShareUrl(channel, payload)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('group', CHANNEL_BUTTON)}
                onClick={() => track(AnalyticsEvent.JobShared, { job_id: job.id, channel })}
              >
                <span className={cn(CHANNEL_ICON, 'text-white', className)}>
                  <Icon className="size-5" />
                </span>
                {label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )
        })}
      </ul>

      {copyStatus === CopyStatus.Failed && (
        <label className="flex flex-col gap-1.5 text-sm text-neutral-11">
          Copy the link below instead
          <input
            readOnly
            autoFocus
            value={payload.url}
            onFocus={(event) => event.currentTarget.select()}
            className="h-10 rounded-xl border border-neutral-6 bg-white px-3 text-foreground"
          />
        </label>
      )}
    </Modal>
  )
}
