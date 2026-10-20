import { useMemo } from 'react'
import { cn } from '../../lib/cn'
import { getJobFacts } from '../../lib/jobFacts'
import { resolveSkills } from '../../lib/skills'
import type { JobFactsProps } from '../../types/components/jobs'
import { TagVariant } from '../../types/components/ui'
import { SkillsSource } from '../../types/skills'
import { Tag } from '../ui/Tag'
import { SkillTag } from './SkillTag'

export const JobFacts = ({ job, maxSkills = 4, pinnedSkills, className }: JobFactsProps) => {
  const facts = getJobFacts(job).filter((fact) => fact.value !== null)
  const { skills, source } = useMemo(
    () =>
      resolveSkills({ skills: job.skills, description: job.description }, maxSkills, pinnedSkills),
    [job.skills, job.description, maxSkills, pinnedSkills],
  )
  const hiddenSkills = skills.length - maxSkills

  if (facts.length === 0 && skills.length === 0) return null

  return (
    <ul aria-label="Key facts" className={cn('flex flex-wrap gap-1.5', className)}>
      {facts.map(({ label, value, icon: Icon, highlight }) => (
        <li key={label} className="max-w-full">
          <Tag variant={highlight ? TagVariant.Mint : TagVariant.Neutral} icon={<Icon aria-hidden />}>
            <span className="sr-only">{label}: </span>
            {value}
          </Tag>
        </li>
      ))}
      {skills.slice(0, maxSkills).map((skill) => (
        <li key={skill} className="flex max-w-full">
          <SkillTag skill={skill} derived={source === SkillsSource.Derived} />
        </li>
      ))}
      {hiddenSkills > 0 && (
        <li>
          <Tag variant={TagVariant.Primary}>
            +{hiddenSkills}
            <span className="sr-only"> more skills</span>
          </Tag>
        </li>
      )}
    </ul>
  )
}
