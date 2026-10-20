import { useEffect, useState } from 'react'
import {
  TYPEWRITER_ERASE_MS,
  TYPEWRITER_GAP_MS,
  TYPEWRITER_HOLD_MS,
  TYPEWRITER_TYPE_MS,
} from '../constants/motion'
import type { TypewriterStep } from '../types/components/ui'

const advance = (
  step: TypewriterStep,
  phraseLength: number,
): { delay: number; next: TypewriterStep } => {
  if (!step.erasing) {
    return step.length < phraseLength
      ? { delay: TYPEWRITER_TYPE_MS, next: { ...step, length: step.length + 1 } }
      : { delay: TYPEWRITER_HOLD_MS, next: { ...step, erasing: true } }
  }
  return step.length > 0
    ? { delay: TYPEWRITER_ERASE_MS, next: { ...step, length: step.length - 1 } }
    : { delay: TYPEWRITER_GAP_MS, next: { phrase: step.phrase + 1, length: 0, erasing: false } }
}

export const useTypewriter = (phrases: readonly string[]): string => {
  const [step, setStep] = useState<TypewriterStep>({ phrase: 0, length: 0, erasing: false })
  const phrase = phrases[step.phrase % phrases.length] ?? ''

  useEffect(() => {
    const { delay, next } = advance(step, phrase.length)
    const timer = setTimeout(() => setStep(next), delay)
    return () => clearTimeout(timer)
  }, [step, phrase.length])

  return phrase.slice(0, step.length)
}
