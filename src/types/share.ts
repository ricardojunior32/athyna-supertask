import type { ComponentType, SVGProps } from 'react'

export enum ShareChannel {
  CopyLink = 'copy_link',
  WhatsApp = 'whatsapp',
  X = 'x',
  Facebook = 'facebook',
  LinkedIn = 'linkedin',
  Telegram = 'telegram',
}

export type SocialShareChannel = Exclude<ShareChannel, ShareChannel.CopyLink>

export enum CopyStatus {
  Idle = 'idle',
  Copied = 'copied',
  Failed = 'failed',
}

export type SharePayload = {
  url: string
  text: string
}

export type ShareChannelStyle = {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  className: string
}
