import { ChevronRight } from 'lucide-react'
import { type MouseEvent, useMemo, useRef } from 'react'
import { JOB_TABLE_COLUMNS, JOB_TABLE_MAX_SKILLS } from '../../constants/jobs'
import {
  formatEmploymentType,
  formatLocation,
  formatRelativeDate,
  formatSalary,
  formatSeniority,
  isNewJob,
} from '../../lib/format'
import { resolveSkills } from '../../lib/skills'
import type {
  JobTableCellProps,
  JobTableProps,
  JobTableRowProps,
} from '../../types/components/jobs'
import { AvatarSize } from '../../types/components/ui'
import { SkillsSource } from '../../types/skills'
import { Avatar } from '../ui/Avatar'
import { Tag } from '../ui/Tag'
import { JobLink } from './JobLink'
import { MatchTeaser } from './MatchTeaser'
import { SkillTag } from './SkillTag'

const Cell = ({ children }: JobTableCellProps) => {
  return (
    <td className="relative border-r border-neutral-4 px-2 py-3 align-middle 2xl:px-3 whitespace-nowrap first:pl-6 last:border-r-0">
      {children || (
        <span className="text-neutral-9">
          <span aria-hidden>-</span>
          <span className="sr-only">Not specified</span>
        </span>
      )}
    </td>
  )
}

const JobTableRow = ({ job, pinnedSkills }: JobTableRowProps) => {
  const location = formatLocation(job.location)
  const employmentType = formatEmploymentType(job.employmentType)
  const seniority = formatSeniority(job.seniority)
  const { skills, source } = useMemo(
    () =>
      resolveSkills(
        { skills: job.skills, description: job.description },
        JOB_TABLE_MAX_SKILLS,
        pinnedSkills,
      ),
    [job.skills, job.description, pinnedSkills],
  )
  const titleLinkRef = useRef<HTMLAnchorElement>(null)

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
    const isOnLink = event.target instanceof Element && event.target.closest('a') !== null
    const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    const isSelectingText = Boolean(window.getSelection()?.toString())
    if (isOnLink || hasModifier || isSelectingText) return
    titleLinkRef.current?.click()
  }

  return (
    <tr
      onClick={handleRowClick}
      className="cursor-pointer border-b border-neutral-4 transition-colors last:border-b-0 hover:bg-primary-2"
    >
      <Cell>
        {isNewJob(job.publishedAt) && (
          <span className="absolute top-1 left-1 rounded-full bg-purple px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
            New
          </span>
        )}
        <div className="flex items-center gap-3">
          <Avatar src={job.company.logoUrl} name={job.company.name} size={AvatarSize.Sm} />
          <div className="max-w-[200px] min-w-0 2xl:max-w-[340px]">
            <JobLink
              ref={titleLinkRef}
              job={job}
              className="block truncate font-bold hover:underline"
            >
              {job.title}
            </JobLink>
            <span className="block truncate text-xs text-neutral-10">{job.company.name}</span>
          </div>
        </div>
      </Cell>
      <Cell>
        <MatchTeaser compact />
      </Cell>
      <Cell>{location && <span className="block max-w-[120px] truncate 2xl:max-w-[150px]">{location}</span>}</Cell>
      <Cell>
        {(employmentType || seniority || skills.length > 0) && (
          <span className="flex gap-1.5">
            {employmentType && <Tag>{employmentType}</Tag>}
            {seniority && <Tag>{seniority}</Tag>}
            {skills.slice(0, JOB_TABLE_MAX_SKILLS).map((skill) => (
              <SkillTag key={skill} skill={skill} derived={source === SkillsSource.Derived} />
            ))}
          </span>
        )}
      </Cell>
      <Cell>{formatSalary(job.salary)}</Cell>
      <Cell>{formatRelativeDate(job.publishedAt)}</Cell>
      <Cell>
        <JobLink job={job} className="inline-flex items-center gap-1 text-purple hover:underline">
          View job
          <span className="sr-only">: {job.title}</span>
          <ChevronRight aria-hidden className="size-4" />
        </JobLink>
      </Cell>
    </tr>
  )
}

export const JobTable = ({ jobs, pinnedSkills }: JobTableProps) => {
  return (
    <div className="overflow-clip rounded-xl border border-neutral-4 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {JOB_TABLE_COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="sticky top-45 z-30 border-r border-neutral-4 bg-neutral-2 px-2 py-2 font-medium 2xl:px-3 whitespace-nowrap shadow-[inset_0_-1px_0] shadow-neutral-4 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-6 before:bg-background first:pl-6 last:border-r-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobTableRow key={job.id} job={job} pinnedSkills={pinnedSkills} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
