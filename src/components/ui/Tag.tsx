import { cn } from '../../lib/cn'
import { type TagProps, TagSize, TagVariant } from '../../types/components/ui'

const variants: Record<TagVariant, string> = {
  [TagVariant.Neutral]: 'bg-neutral-3 text-neutral-11',
  [TagVariant.Primary]: 'bg-primary-3 text-primary-11',
  [TagVariant.Mint]: 'bg-mint/25 text-foreground',
}

const sizes: Record<TagSize, string> = {
  [TagSize.Sm]: 'gap-1 rounded-[6px] px-1.5 py-0.5 text-xs [&>svg]:size-3',
  [TagSize.Md]: 'gap-1.5 rounded-lg px-2.5 py-1 text-sm [&>svg]:size-4',
}

export const Tag = ({
  variant = TagVariant.Neutral,
  size = TagSize.Sm,
  icon,
  className,
  children,
}: TagProps) => {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center font-medium whitespace-nowrap [&>svg]:shrink-0',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </span>
  )
}
