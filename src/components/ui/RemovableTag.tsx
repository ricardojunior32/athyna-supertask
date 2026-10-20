import { X } from 'lucide-react'
import type { RemovableTagProps } from '../../types/components/ui'

export const RemovableTag = ({ onRemove, children }: RemovableTagProps) => {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-neutral-6 bg-white px-2 py-1 text-xs hover:bg-neutral-2"
    >
      <span className="sr-only">Remove </span>
      {children}
      <X aria-hidden className="size-3" />
    </button>
  )
}
