import type { CSSProperties, ReactNode, Ref, RefObject } from 'react'
import type { ApplyPlacement } from '../analytics'
import type { Job } from '../job'
import type { Country } from '../location'
import type { TechSkill } from '../skills'
import type { JobFilters, Option, SearchSource } from '../search'
import type { ButtonVariant, TagSize } from './ui'

export enum PopularSearchesPhase {
  Collapsed = 'collapsed',
  Expanded = 'expanded',
  Collapsing = 'collapsing',
}

export type ActiveFiltersProps = {
  q: string
  filters: JobFilters
  onClearSearch: () => void
  onChange: (filters: JobFilters) => void
  onClearAll: () => void
}

export type FilterTag = {
  label: string
  remove: () => void
}

export type ApplyButtonProps = {
  job: Job
  placement: ApplyPlacement
  ref?: Ref<HTMLAnchorElement>
  variant?: ButtonVariant.Primary | ButtonVariant.Glass
  fullWidth?: boolean
  inert?: boolean
  className?: string
}

export type FloatingApplyButtonProps = {
  job: Job
  heroButton: RefObject<HTMLElement | null>
  footerButton: RefObject<HTMLElement | null>
}

export type JobCardProps = {
  job: Job
  pinnedSkills?: readonly string[]
}

export type JobDescriptionProps = {
  markdown: string
}

export type JobFactCardsProps = {
  job: Job
  className?: string
}

export type JobFactsProps = {
  job: Job
  maxSkills?: number
  pinnedSkills?: readonly string[]
  className?: string
}

export type ChoiceListProps<T extends string> = {
  label: string
  options: readonly Option<T>[]
  value: T | null
  onChoose: (value: T) => void
}

export type SalaryFormProps = {
  min: number | null
  max: number | null
  onApply: (min: number | null, max: number | null) => void
}

export type JobFilterBarProps = {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

export type LocationFilterProps = {
  value: Country[]
  onChange: (countries: Country[]) => void
}

export type SkillsFilterProps = {
  value: TechSkill[]
  onChange: (skills: TechSkill[]) => void
}

export type JobHeroProps = {
  job: Job
  className?: string
}

export type JobLinkProps = {
  job: Job
  ref?: Ref<HTMLAnchorElement>
  className?: string
  children: ReactNode
}

export type JobListProps = {
  jobs: Job[]
  pinnedSkills?: readonly string[]
}

export type JobListSkeletonProps = {
  rows?: number
}

export type JobSummaryProps = {
  job: Job
  applyRef?: Ref<HTMLAnchorElement>
  className?: string
}

export type JobTableProps = {
  jobs: Job[]
  pinnedSkills?: readonly string[]
}

export type JobTableRowProps = {
  job: Job
  pinnedSkills?: readonly string[]
}

export type JobTableCellProps = {
  children: ReactNode
}

export type MatchTeaserProps = {
  href?: string
  compact?: boolean
  className?: string
}

export type PopularSearchesProps = {
  selected: string
  onSelect: (term: string) => void
  className?: string
}

export type PopularSearchMotion = {
  className?: string
  style?: CSSProperties
}

export type SaveJobButtonProps = {
  className?: string
}

export type ShareJobProps = {
  job: Job
  className?: string
}

export type JobAlertButtonProps = {
  job: Job
  className?: string
}

export type JobAlertDialogProps = {
  job: Job
  open: boolean
  savedEmail: string | null
  onClose: () => void
  onCreated: (email: string) => void
}

export type ShareJobDialogProps = {
  job: Job
  open: boolean
  onClose: () => void
}

export type SearchBarProps = {
  value: string
  // Returns the query actually applied, which can differ from what was typed
  onSearch: (value: string, source: SearchSource) => string
  examples?: readonly string[]
}

export type SimilarJobsProps = {
  job: Job
}

export type SkillTagProps = {
  skill: string
  derived: boolean
  size?: TagSize
}
