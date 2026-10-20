import { ArrowUpDown, Banknote, Check, Clock, Globe, TrendingUp } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { EMPLOYMENT_TYPE_OPTIONS, SENIORITY_OPTIONS, SORT_OPTIONS } from '../../constants/search'
import { cn } from '../../lib/cn'
import { parseAmount } from '../../lib/jobSearch'
import type {
  ChoiceListProps,
  JobFilterBarProps,
  SalaryFormProps,
} from '../../types/components/jobs'
import { type JobFilters, SortOption } from '../../types/search'
import { Button } from '../ui/Button'
import { FilterButton } from '../ui/FilterButton'
import { Popover } from '../ui/Popover'
import { LocationFilter } from './LocationFilter'
import { SkillsFilter } from './SkillsFilter'

const ChoiceList = <T extends string>({ label, options, value, onChoose }: ChoiceListProps<T>) => {
  return (
    <ul aria-label={label}>
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <li key={option.value}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChoose(option.value)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm',
                isSelected ? 'bg-primary-4 text-primary-12' : 'hover:bg-neutral-2',
              )}
            >
              {option.label}
              {isSelected && <Check aria-hidden className="size-4" />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const SalaryForm = ({ min, max, onApply }: SalaryFormProps) => {
  const [minDraft, setMinDraft] = useState(min?.toString() ?? '')
  const [maxDraft, setMaxDraft] = useState(max?.toString() ?? '')
  const nextMin = parseAmount(minDraft)
  const nextMax = parseAmount(maxDraft)
  const isInverted = nextMin !== null && nextMax !== null && nextMin > nextMax

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isInverted) onApply(nextMin, nextMax)
  }

  const fields = [
    { label: 'Minimum', value: minDraft, onChange: setMinDraft },
    { label: 'Maximum', value: maxDraft, onChange: setMaxDraft },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
      {fields.map((field) => (
        <label key={field.label} className="flex flex-col gap-1 text-sm font-medium">
          {field.label}
          <span className="flex items-center gap-2 rounded-lg border border-neutral-6 px-3 font-normal focus-within:border-purple">
            <span className="text-neutral-10">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              placeholder="per year"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              className="w-full min-w-0 bg-transparent py-2 outline-none"
            />
          </span>
        </label>
      ))}
      {isInverted && (
        <p role="alert" className="text-xs text-error-11">
          Minimum can't be higher than maximum.
        </p>
      )}
      <Button type="submit" disabled={isInverted}>
        Apply
      </Button>
    </form>
  )
}

export const JobFilterBar = ({ filters, onChange }: JobFilterBarProps) => {
  const update = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch })
  const sortLabel = SORT_OPTIONS.find((option) => option.value === filters.sort)?.label

  return (
    <div role="group" aria-label="Filters" className="flex flex-wrap items-center gap-2">
      <FilterButton
        active={filters.remote}
        aria-pressed={filters.remote}
        onClick={() => update({ remote: !filters.remote })}
      >
        <Globe aria-hidden />
        Remote only
      </FilterButton>

      <LocationFilter value={filters.locations} onChange={(locations) => update({ locations })} />

      <SkillsFilter value={filters.skills} onChange={(skills) => update({ skills })} />

      <Popover
        label={
          <>
            <Clock aria-hidden />
            Type
          </>
        }
        active={filters.employmentType !== null}
      >
        {(close) => (
          <ChoiceList
            label="Employment type"
            options={EMPLOYMENT_TYPE_OPTIONS}
            value={filters.employmentType}
            onChoose={(type) => {
              update({ employmentType: type === filters.employmentType ? null : type })
              close()
            }}
          />
        )}
      </Popover>

      <Popover
        label={
          <>
            <TrendingUp aria-hidden />
            Level
          </>
        }
        active={filters.seniority !== null}
      >
        {(close) => (
          <ChoiceList
            label="Level"
            options={SENIORITY_OPTIONS}
            value={filters.seniority}
            onChoose={(level) => {
              update({ seniority: level === filters.seniority ? null : level })
              close()
            }}
          />
        )}
      </Popover>

      <Popover
        label={
          <>
            <Banknote aria-hidden />
            Salary
          </>
        }
        active={filters.minSalary !== null || filters.maxSalary !== null}
        width={256}
      >
        {(close) => (
          <SalaryForm
            min={filters.minSalary}
            max={filters.maxSalary}
            onApply={(minSalary, maxSalary) => {
              update({ minSalary, maxSalary })
              close()
            }}
          />
        )}
      </Popover>

      <Popover
        label={
          <>
            <ArrowUpDown aria-hidden />
            {sortLabel}
          </>
        }
        active={filters.sort !== SortOption.Newest}
        width={192}
      >
        {(close) => (
          <ChoiceList
            label="Sort by"
            options={SORT_OPTIONS}
            value={filters.sort}
            onChoose={(sort) => {
              update({ sort })
              close()
            }}
          />
        )}
      </Popover>
    </div>
  )
}
