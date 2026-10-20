import { useTypewriter } from '../../hooks/useTypewriter'
import type { TypewriterTextProps } from '../../types/components/ui'

export const TypewriterText = ({ phrases, className }: TypewriterTextProps) => {
  const text = useTypewriter(phrases)

  return (
    <span aria-hidden className={className}>
      {text}
      <span className="ml-px inline-block h-5 w-px animate-caret bg-current align-text-bottom" />
    </span>
  )
}
