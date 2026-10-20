import { Search, X } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { SEARCH_DEBOUNCE_MS, SEARCH_PLACEHOLDER } from '../../constants/search'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import type { SearchBarProps } from '../../types/components/jobs'
import { SearchSource } from '../../types/search'
import { TypewriterText } from '../ui/TypewriterText'

export const SearchBar = ({ value, onSearch, examples = [] }: SearchBarProps) => {
  const [draft, setDraft] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const isAnimated = examples.length > 0 && !draft && !isFocused && !prefersReducedMotion

  const [appliedValue, setAppliedValue] = useState(value)
  if (value !== appliedValue) {
    setAppliedValue(value)
    if (value !== draft.trim()) setDraft(value)
  }

  const search = useCallback(
    (next: string, source: SearchSource) => {
      const applied = onSearch(next, source)
      if (applied !== next) setDraft(applied)
    },
    [onSearch],
  )

  useEffect(() => {
    const next = draft.trim()
    if (next === value) return
    const timer = setTimeout(() => search(next, SearchSource.Typing), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [draft, value, search])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    search(draft.trim(), SearchSource.Submit)
  }

  const handleClear = () => {
    setDraft('')
    onSearch('', SearchSource.Submit)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <label htmlFor="job-search" className="sr-only">
        Search jobs
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 hidden size-5 -translate-y-1/2 text-foreground/40 sm:block"
      />
      <input
        id="job-search"
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        placeholder={isAnimated ? undefined : SEARCH_PLACEHOLDER}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'w-full rounded-xl border-2 border-foreground bg-white py-4 pl-4 text-base leading-6 shadow-input sm:pl-12',
          'placeholder:text-[15px] placeholder:text-foreground/40 sm:placeholder:text-base',
          draft ? 'pr-12' : 'pr-4',
        )}
      />
      {isAnimated && (
        <TypewriterText
          phrases={[SEARCH_PLACEHOLDER, ...examples]}
          className="pointer-events-none absolute inset-y-0 right-4 left-[calc(1rem+2px)] flex items-center overflow-hidden text-left text-[15px] leading-6 whitespace-pre text-foreground/40 sm:left-[calc(3rem+2px)] sm:text-base"
        />
      )}
      {draft && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-foreground/60 hover:bg-neutral-3 hover:text-foreground"
        >
          <X aria-hidden className="size-5" />
        </button>
      )}
    </form>
  )
}
