import { useState } from 'react'
import { cn } from '../../lib/cn'
import { type AvatarProps, AvatarSize } from '../../types/components/ui'

const sizes: Record<AvatarSize, string> = {
  [AvatarSize.Sm]: 'size-8 rounded-md text-sm',
  [AvatarSize.Md]: 'size-10 rounded-md text-base',
  [AvatarSize.Lg]: 'size-16 rounded-xl text-2xl md:size-20',
}

export const Avatar = ({ src, name, size = AvatarSize.Md }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const showImage = src !== null && src !== failedSrc
  const isLoading = showImage && src !== loadedSrc

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-primary-3 font-medium text-primary-11 select-none',
        sizes[size],
        isLoading && 'animate-pulse',
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className={cn('size-full object-cover', isLoading && 'opacity-0')}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        name.trim().charAt(0).toUpperCase()
      )}
    </span>
  )
}
