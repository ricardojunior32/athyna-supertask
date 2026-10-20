import type { SkillTagProps } from '../../types/components/jobs'
import { TagVariant } from '../../types/components/ui'
import { Tag } from '../ui/Tag'

export const SkillTag = ({ skill, derived, size }: SkillTagProps) => {
  return (
    <span className="max-w-full" title={derived ? 'Mentioned in the job description' : undefined}>
      <Tag size={size} variant={TagVariant.Primary}>
        {derived && <span className="sr-only">Mentioned in the description: </span>}
        {skill}
      </Tag>
    </span>
  )
}
