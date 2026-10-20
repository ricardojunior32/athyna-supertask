import { cn } from '../../lib/cn'
import type { SkeletonProps } from '../../types/components/ui'

export const Skeleton = ({ className }: SkeletonProps) => {
  return <span aria-hidden className={cn('block animate-pulse rounded-md bg-neutral-4', className)} />
}
