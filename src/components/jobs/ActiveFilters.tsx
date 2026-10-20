import { SORT_OPTIONS } from '../../constants/search'
import { formatSalary, formatSeniority } from '../../lib/format'
import { groupLocations, withoutCountries } from '../../lib/location'
import type { ActiveFiltersProps, FilterTag } from '../../types/components/jobs'
import { type JobFilters, SortOption } from '../../types/search'
import { RemovableTag } from '../ui/RemovableTag'

export const ActiveFilters = ({
  q,
  filters,
  onClearSearch,
  onChange,
  onClearAll,
}: ActiveFiltersProps) => {
  const update = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch })
  const salary = formatSalary({
    min: filters.minSalary,
    max: filters.maxSalary,
    currency: 'USD',
    period: 'yearly',
  })

  const tags: FilterTag[] = []
  if (q) tags.push({ label: `Search: ${q}`, remove: onClearSearch })
  if (filters.remote) tags.push({ label: 'Remote only', remove: () => update({ remote: false }) })
  for (const group of groupLocations(filters.locations)) {
    tags.push({
      label: `Location: ${group.label}`,
      remove: () => update({ locations: withoutCountries(filters.locations, group.countries) }),
    })
  }
  for (const skill of filters.skills) {
    tags.push({
      label: `Skill: ${skill}`,
      remove: () => update({ skills: filters.skills.filter((selected) => selected !== skill) }),
    })
  }
  if (filters.employmentType) {
    tags.push({
      label: `Type: ${filters.employmentType}`,
      remove: () => update({ employmentType: null }),
    })
  }
  if (filters.seniority) {
    tags.push({
      label: `Level: ${formatSeniority(filters.seniority)}`,
      remove: () => update({ seniority: null }),
    })
  }
  if (salary) {
    tags.push({
      label: `Salary: ${salary}`,
      remove: () => update({ minSalary: null, maxSalary: null }),
    })
  }
  if (filters.sort !== SortOption.Newest) {
    const sort = SORT_OPTIONS.find((option) => option.value === filters.sort)
    tags.push({ label: `Sort: ${sort?.label}`, remove: () => update({ sort: SortOption.Newest }) })
  }

  if (tags.length === 0) return null

  return (
    <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <li key={tag.label}>
          <RemovableTag onRemove={tag.remove}>{tag.label}</RemovableTag>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClearAll}
          className="cursor-pointer rounded-md bg-primary-3 px-2 py-1 text-xs text-primary-11 hover:bg-primary-4"
        >
          Clear all
        </button>
      </li>
    </ul>
  )
}
