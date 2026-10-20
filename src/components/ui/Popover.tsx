import { useEffect, useId, useRef, useState } from 'react'
import { POPOVER_VIEWPORT_MARGIN } from '../../constants/ui'
import type { PopoverProps } from '../../types/components/ui'
import { FilterButton } from './FilterButton'

export const Popover = ({ label, active, width = 224, children }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!isOpen) return

    const closeIfOutside = (event: Event) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeIfOutside)
    document.addEventListener('focusin', closeIfOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside)
      document.removeEventListener('focusin', closeIfOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const toggle = () => {
    if (!isOpen && triggerRef.current) {
      const { left } = triggerRef.current.getBoundingClientRect()
      const furthestLeft = document.documentElement.clientWidth - POPOVER_VIEWPORT_MARGIN - width
      setOffset(Math.max(POPOVER_VIEWPORT_MARGIN, Math.min(left, furthestLeft)) - left)
    }
    setIsOpen((open) => !open)
  }

  return (
    <div ref={containerRef} className="relative">
      <FilterButton
        ref={triggerRef}
        active={active}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={toggle}
      >
        {label}
      </FilterButton>
      {isOpen && (
        <div
          id={panelId}
          style={{ left: offset, width }}
          className="absolute top-full z-35 mt-2 max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-4 bg-white p-1 text-left shadow-popover"
        >
          {children(() => setIsOpen(false))}
        </div>
      )}
    </div>
  )
}
