import { Code } from 'lucide-react'
import { SKILLS_HINT } from '../../constants/search'
import type { SkillsFilterProps } from '../../types/components/jobs'
import { TechSkill } from '../../types/skills'
import { CheckboxOption } from '../ui/CheckboxOption'
import { Popover } from '../ui/Popover'

export const SkillsFilter = ({ value, onChange }: SkillsFilterProps) => {
  const label =
    value.length === 0 ? 'Skills' : value.length === 1 ? value[0] : `${value.length} skills`

  const toggle = (skill: TechSkill) => {
    onChange(
      value.includes(skill)
        ? value.filter((selected) => selected !== skill)
        : Object.values(TechSkill).filter((option) => option === skill || value.includes(option)),
    )
  }

  return (
    <Popover
      label={
        <>
          <Code aria-hidden />
          {label}
        </>
      }
      active={value.length > 0}
      width={240}
    >
      {() => (
        <div className="flex flex-col">
          <div role="group" aria-label="Skills">
            {Object.values(TechSkill).map((skill) => (
              <CheckboxOption
                key={skill}
                label={skill}
                checked={value.includes(skill)}
                onToggle={() => toggle(skill)}
              />
            ))}
          </div>
        </div>
      )}
    </Popover>
  )
}
