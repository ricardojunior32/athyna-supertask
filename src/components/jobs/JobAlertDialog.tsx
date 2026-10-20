import { ArrowRight, Check } from 'lucide-react'
import { type FormEvent, useId, useMemo, useState } from 'react'
import { JOB_ALERT_MAX_SKILLS } from '../../constants/jobAlerts'
import { PRIVACY_URL } from '../../constants/links'
import { track } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { isValidEmail } from '../../lib/jobAlerts'
import { resolveSkills } from '../../lib/skills'
import { AnalyticsEvent } from '../../types/analytics'
import type { JobAlertDialogProps } from '../../types/components/jobs'
import { ButtonSize } from '../../types/components/ui'
import { JobAlertStep } from '../../types/jobAlerts'
import { SkillsSource } from '../../types/skills'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { SkillTag } from './SkillTag'

export const JobAlertDialog = ({
  job,
  open,
  savedEmail,
  onClose,
  onCreated,
}: JobAlertDialogProps) => {
  const [step, setStep] = useState(JobAlertStep.Form)
  const [email, setEmail] = useState(savedEmail ?? '')
  const [showError, setShowError] = useState(false)
  const inputId = useId()
  const errorId = useId()
  const { skills, source } = useMemo(
    () => resolveSkills({ skills: job.skills, description: job.description }, JOB_ALERT_MAX_SKILLS),
    [job.skills, job.description],
  )

  const close = () => {
    setStep(JobAlertStep.Form)
    setShowError(false)
    onClose()
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setShowError(true)
      return
    }
    const trimmed = email.trim()
    setEmail(trimmed)
    setStep(JobAlertStep.Done)
    onCreated(trimmed)
    track(AnalyticsEvent.JobAlertCreated, { job_id: job.id, skills_count: skills.length })
  }

  return (
    <Modal open={open} title="Get jobs like this by email" onClose={close}>
      {step === JobAlertStep.Form ? (
        <form noValidate onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-4 bg-white p-4">
            <p className="text-sm text-neutral-11">
              We'll email you new roles like{' '}
              <span className="font-medium text-foreground">{job.title}</span>
              {skills.length > 0 && ', matching these skills:'}
            </p>
            {skills.length > 0 && (
              <ul aria-label="Skills" className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <li key={skill} className="flex max-w-full">
                    <SkillTag skill={skill} derived={source === SkillsSource.Derived} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={inputId} className="text-sm font-medium">
              Email
              <span aria-hidden className="text-error-11">
                {' '}
                *
              </span>
            </label>
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              aria-invalid={showError}
              aria-describedby={showError ? errorId : undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                setShowError(false)
              }}
              className={cn(
                'h-12 rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-neutral-9 focus:border-foreground focus:outline-none',
                showError ? 'border-error-11' : 'border-neutral-6',
              )}
            />
            {showError && (
              <p id={errorId} className="text-sm text-error-11">
                Enter a valid email, like name@example.com.
              </p>
            )}
          </div>

          <p className="text-center text-xs leading-relaxed text-neutral-10">
            By creating an alert, you agree to receive job emails from Athyna. You can unsubscribe
            at any time. See our{' '}
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Privacy Policy
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>

          <Button type="submit" size={ButtonSize.Lg} fullWidth>
            Create alert
            <ArrowRight aria-hidden className="size-5" />
          </Button>
        </form>
      ) : (
        <div role="status" className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-mint">
            <Check aria-hidden className="size-7" />
          </span>
          <p className="text-lg font-medium">You're all set!</p>
          <p className="text-sm text-neutral-11">
            We'll email <span className="font-medium text-foreground">{email}</span> when roles
            like <span className="font-medium text-foreground">{job.title}</span> go live.
          </p>
          <Button size={ButtonSize.Lg} fullWidth autoFocus onClick={close} className="mt-2">
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
