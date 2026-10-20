import { useEffect, useRef, useState } from 'react'
import {
  FLOATING_APPLY_DURATION_MS,
  FLOATING_APPLY_EDGE_OFFSET,
  FLOATING_APPLY_FADE_UNTIL,
  FLOATING_APPLY_SWELL_AMOUNT,
  FLOATING_APPLY_SWELL_FROM,
} from '../../constants/motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { ApplyPlacement } from '../../types/analytics'
import type { FloatingApplyButtonProps } from '../../types/components/jobs'
import { ButtonVariant } from '../../types/components/ui'
import { ApplyButton } from './ApplyButton'

const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

export const FloatingApplyButton = ({ job, heroButton, footerButton }: FloatingApplyButtonProps) => {
  const floatRef = useRef<HTMLAnchorElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isDocked, setIsDocked] = useState(false)

  useEffect(() => {
    const float = floatRef.current
    const inlineButtons = [heroButton.current, footerButton.current].filter((el) => el !== null)
    if (!float || inlineButtons.length === 0) return

    const inView = new Set<Element>()
    let anchor: Element = inlineButtons[0]
    let dock = float.getBoundingClientRect()
    let progress = 0
    let frame = 0
    let isFirstReading = true

    const draw = () => {
      const { style } = float
      if (progress === 0 || progress === 1) {
        style.width = ''
        style.transform = ''
        style.opacity = String(progress)
        style.visibility = progress === 0 ? 'hidden' : 'visible'
        return
      }

      const from = anchor.getBoundingClientRect()
      const fromTop = Math.min(
        Math.max(from.top, -from.height - FLOATING_APPLY_EDGE_OFFSET),
        window.innerHeight + FLOATING_APPLY_EDGE_OFFSET,
      )
      const t = easeInOutCubic(progress)
      const width = lerp(from.width, dock.width, t)
      const left = lerp(from.left, dock.left, t)
      const top = lerp(fromTop, dock.top, t)
      const swell =
        1 +
        FLOATING_APPLY_SWELL_AMOUNT *
          Math.sin(
            Math.PI *
              Math.max(
                0,
                (progress - FLOATING_APPLY_SWELL_FROM) / (1 - FLOATING_APPLY_SWELL_FROM),
              ),
          )

      style.width = `${width}px`
      style.transform = `translate(${left - (dock.right - width)}px, ${top - dock.top}px) scale(${swell})`
      style.opacity = String(Math.min(1, progress / FLOATING_APPLY_FADE_UNTIL))
      style.visibility = 'visible'
    }

    const animateTo = (goal: 0 | 1, instantly: boolean) => {
      cancelAnimationFrame(frame)
      if (instantly) {
        progress = goal
        draw()
        return
      }
      if (progress === 0 || progress === 1) dock = float.getBoundingClientRect()

      let last = performance.now()
      const tick = (now: number) => {
        const step = Math.max(0, now - last) / FLOATING_APPLY_DURATION_MS
        last = now
        progress = goal === 1 ? Math.min(1, progress + step) : Math.max(0, progress - step)
        draw()
        if (progress !== goal) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target)
        else inView.delete(entry.target)
      }
      const shouldDock = inView.size === 0
      const moved = entries.filter((entry) => entry.isIntersecting !== shouldDock).at(-1)
      if (moved) anchor = moved.target

      setIsDocked(shouldDock)
      animateTo(shouldDock ? 1 : 0, isFirstReading || prefersReducedMotion)
      isFirstReading = false
    })
    for (const button of inlineButtons) observer.observe(button)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [heroButton, footerButton, job.id, prefersReducedMotion])

  return (
    <ApplyButton
      ref={floatRef}
      job={job}
      placement={ApplyPlacement.Floating}
      variant={ButtonVariant.Glass}
      fullWidth={false}
      inert={!isDocked}
      className="invisible fixed right-4 bottom-4 z-30 opacity-0 will-change-transform"
    />
  )
}
