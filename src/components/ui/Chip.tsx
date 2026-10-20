import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ChipProps } from '../../types/components/ui'

export const Chip = ({ selected, className, children, ...props }: ChipProps) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-4 text-base transition-colors duration-200',
        selected
          ? 'border-foreground bg-foreground text-white'
          : 'border-neutral-9 bg-white/10 text-neutral-11 hover:bg-white/70',
        className,
      )}
      {...props}
    >
      {children}
      {selected && <X aria-hidden className="size-4" />}
    </button>
  )
}
