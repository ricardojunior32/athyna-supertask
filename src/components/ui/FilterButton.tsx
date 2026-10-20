import { cn } from '../../lib/cn'
import type { FilterButtonProps } from '../../types/components/ui'

const styles = {
  outline: 'h-9 border border-neutral-6 bg-white px-3 text-neutral-11 hover:bg-neutral-2',
  outlineActive:
    'h-9 border border-primary-8 bg-primary-3 px-3 text-primary-12 hover:bg-primary-4',
}

export const FilterButton = ({ active = false, ...props }: FilterButtonProps) => {
  const style = active ? styles.outlineActive : styles.outline

  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-lg text-sm whitespace-nowrap transition-colors [&>svg]:size-4 [&>svg]:shrink-0',
        style,
      )}
      {...props}
    />
  )
}
