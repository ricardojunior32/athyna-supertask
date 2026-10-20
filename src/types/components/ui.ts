import type { ComponentProps, ReactNode } from 'react'
import type { LinkProps } from 'react-router'

export enum ButtonVariant {
  Primary = 'primary',
  Outline = 'outline',
  Glass = 'glass',
}

export enum ButtonSize {
  Md = 'md',
  Lg = 'lg',
}

export enum TagVariant {
  Neutral = 'neutral',
  Primary = 'primary',
  Mint = 'mint',
}

export enum TagSize {
  Sm = 'sm',
  Md = 'md',
}

export enum AvatarSize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
}

export enum StateRole {
  Alert = 'alert',
  Status = 'status',
}

export type AvatarProps = {
  src: string | null
  name: string
  size?: AvatarSize
}

export type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export type ButtonProps = ButtonStyleProps &
  (
    | ({ to: LinkProps['to'] } & Omit<LinkProps, 'to'>)
    | ({ href: string } & Omit<ComponentProps<'a'>, 'href'>)
    | ComponentProps<'button'>
  )

export type ChipProps = ComponentProps<'button'> & {
  selected?: boolean
}

export type FilterButtonProps = Omit<ComponentProps<'button'>, 'className'> & {
  active?: boolean
}

export type CheckboxOptionProps = {
  label: string
  checked: boolean
  indeterminate?: boolean
  onToggle: () => void
  className?: string
}

export type PopoverProps = {
  label: ReactNode
  active?: boolean
  width?: number
  children: (close: () => void) => ReactNode
}

export type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export type RemovableTagProps = {
  onRemove: () => void
  children: ReactNode
}

export type SkeletonProps = {
  className?: string
}

export type StateMessageProps = {
  title: string
  description?: string
  action?: ReactNode
  role?: StateRole
}

export type TagProps = {
  variant?: TagVariant
  size?: TagSize
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export type TypewriterTextProps = {
  phrases: readonly string[]
  className?: string
}

export type TypewriterStep = {
  phrase: number
  length: number
  erasing: boolean
}
