import { cn } from '../../lib/cn'
import type { CheckboxOptionProps } from '../../types/components/ui'

export const CheckboxOption = ({
  label,
  checked,
  indeterminate = false,
  onToggle,
  className,
}: CheckboxOptionProps) => {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-neutral-2',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        ref={(input) => {
          if (input) input.indeterminate = indeterminate
        }}
        onChange={onToggle}
        className="size-4 shrink-0 cursor-pointer accent-purple"
      />
      {label}
    </label>
  )
}
