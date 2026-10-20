import { Bell, BellRing } from 'lucide-react'
import { useState } from 'react'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { addJobAlert, hasJobAlert, readJobAlerts, saveJobAlerts } from '../../lib/jobAlerts'
import { AnalyticsEvent } from '../../types/analytics'
import type { JobAlertButtonProps } from '../../types/components/jobs'
import { JobAlertDialog } from './JobAlertDialog'

export const JobAlertButton = ({ job, className }: JobAlertButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState(readJobAlerts)
  const isOn = hasJobAlert(alerts, job.id)

  const open = () => {
    setIsOpen(true)
    track(AnalyticsEvent.JobAlertOpened, { job_id: job.id, has_alert: isOn })
  }

  const create = (email: string) => {
    const next = addJobAlert(alerts, email, job.id)
    saveJobAlerts(next)
    setAlerts(next)
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className={cn(
          'inline-flex max-w-full cursor-pointer items-center gap-1.5 text-sm font-medium text-purple hover:underline',
          className,
        )}
      >
        {alerts && isOn ? (
          <>
            <BellRing aria-hidden className="size-4 shrink-0" />
            <span className="truncate">Alerts on for {alerts.email}</span>
          </>
        ) : (
          <>
            <Bell aria-hidden className="size-4 shrink-0" />
            Get jobs like this by email
          </>
        )}
      </button>
      {/* Keyed by job so a typed email never carries over to another job's dialog */}
      <JobAlertDialog
        key={job.id}
        job={job}
        open={isOpen}
        savedEmail={alerts && isOn ? alerts.email : null}
        onClose={() => setIsOpen(false)}
        onCreated={create}
      />
    </>
  )
}
