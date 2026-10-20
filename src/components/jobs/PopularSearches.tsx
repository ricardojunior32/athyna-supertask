import { ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { POPULAR_SEARCHES_EXIT_MS, POPULAR_SEARCHES_STAGGER_MS } from '../../constants/motion'
import {
  POPULAR_SEARCHES,
  POPULAR_SEARCHES_EXTRA_COUNT,
  POPULAR_SEARCHES_VISIBLE_COUNT,
} from '../../constants/search'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import {
  type PopularSearchesProps,
  PopularSearchesPhase,
  type PopularSearchMotion,
} from '../../types/components/jobs'
import { Chip } from '../ui/Chip'

export const PopularSearches = ({ selected, onSelect, className }: PopularSearchesProps) => {
  const [phase, setPhase] = useState(PopularSearchesPhase.Collapsed)
  const [hasToggled, setHasToggled] = useState(false)
  const [shownBeforeExpanding, setShownBeforeExpanding] = useState<string | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const firstExtraRef = useRef<HTMLButtonElement>(null)
  const selectedTerm = selected.trim().toLowerCase()
  const isSelected = (term: string) => term.toLowerCase() === selectedTerm

  useEffect(() => {
    if (phase !== PopularSearchesPhase.Collapsing) return
    const timer = setTimeout(
      () => setPhase(PopularSearchesPhase.Collapsed),
      POPULAR_SEARCHES_EXIT_MS,
    )
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (hasToggled && phase === PopularSearchesPhase.Expanded) firstExtraRef.current?.focus()
  }, [hasToggled, phase])

  const expand = () => {
    setShownBeforeExpanding(POPULAR_SEARCHES.slice(POPULAR_SEARCHES_VISIBLE_COUNT).find(isSelected) ?? null)
    setPhase(PopularSearchesPhase.Expanded)
    setHasToggled(true)
  }

  const collapse = () => {
    setPhase(
      prefersReducedMotion ? PopularSearchesPhase.Collapsed : PopularSearchesPhase.Collapsing,
    )
  }

  const extraMotion = (term: string, position: number): PopularSearchMotion => {
    if (phase === PopularSearchesPhase.Expanded && term !== shownBeforeExpanding) {
      return {
        className: 'animate-pop-in motion-reduce:animate-none',
        style: { animationDelay: `${position * POPULAR_SEARCHES_STAGGER_MS}ms` },
      }
    }
    if (phase === PopularSearchesPhase.Collapsing && !isSelected(term)) {
      return {
        className: 'animate-pop-out',
        style: { animationDelay: `${(POPULAR_SEARCHES_EXTRA_COUNT - 1 - position) * POPULAR_SEARCHES_STAGGER_MS}ms` },
      }
    }
    return {}
  }

  return (
    <div
      role="group"
      aria-labelledby="popular-searches-label"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <span
        id="popular-searches-label"
        className="w-full text-center font-medium text-neutral-11 uppercase lg:w-auto"
      >
        Popular searches:
      </span>
      {POPULAR_SEARCHES.map((term, index) => {
        const position = index - POPULAR_SEARCHES_VISIBLE_COUNT
        const isExtra = position >= 0
        if (isExtra && phase === PopularSearchesPhase.Collapsed && !isSelected(term)) return null

        return (
          <Chip
            key={term}
            ref={position === 0 ? firstExtraRef : undefined}
            selected={isSelected(term)}
            onClick={() => onSelect(isSelected(term) ? '' : term)}
            {...(isExtra && extraMotion(term, position))}
          >
            {term}
          </Chip>
        )
      })}
      {phase === PopularSearchesPhase.Collapsed ? (
        <Chip
          aria-expanded={false}
          aria-label={`Show ${POPULAR_SEARCHES_EXTRA_COUNT} more popular searches`}
          autoFocus={hasToggled}
          onClick={expand}
          className={cn(hasToggled && 'animate-pop-in motion-reduce:animate-none')}
        >
          …
        </Chip>
      ) : (
        <button
          type="button"
          aria-expanded
          inert={phase === PopularSearchesPhase.Collapsing}
          onClick={collapse}
          style={{
            animationDelay:
              phase === PopularSearchesPhase.Expanded
                ? `${POPULAR_SEARCHES_EXTRA_COUNT * POPULAR_SEARCHES_STAGGER_MS}ms`
                : '0ms',
          }}
          className={cn(
            'inline-flex h-10 cursor-pointer items-center gap-1 px-2 text-sm font-medium text-purple underline-offset-4 hover:underline',
            phase === PopularSearchesPhase.Expanded
              ? 'animate-pop-in motion-reduce:animate-none'
              : 'animate-pop-out',
          )}
        >
          Show less
          <ChevronUp aria-hidden className="size-4" />
        </button>
      )}
    </div>
  )
}
