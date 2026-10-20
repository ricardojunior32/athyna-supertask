import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import { type ButtonProps, ButtonSize, ButtonVariant } from '../../types/components/ui'

const variants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'bg-mint hover:brightness-110',
  [ButtonVariant.Outline]: 'border-2 border-mint bg-white hover:bg-mint/10',
  [ButtonVariant.Glass]:
    'border border-white/50 bg-mint/70 shadow-glass backdrop-blur-xl backdrop-saturate-150 hover:bg-mint/85',
}

const sizes: Record<ButtonSize, string> = {
  [ButtonSize.Md]: 'h-10 px-4 text-base',
  [ButtonSize.Lg]: 'h-14 px-6 text-lg font-medium',
}

export const Button = ({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Md,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const classes = cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full whitespace-nowrap text-foreground transition-[background-color,filter] duration-200',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )

  if ('to' in props) return <Link className={classes} {...props} />
  if ('href' in props) return <a className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
