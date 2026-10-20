import { type SharePayload, ShareChannel, type SocialShareChannel } from '../types/share'
import { jobPath } from './navigation'

export const jobShareUrl = (id: string, origin: string): string => {
  return new URL(jobPath(id), origin).toString()
}

export const jobShareText = (title: string, company: string): string => {
  return `${title.trim()} at ${company.trim()}`
}

const withParams = (base: string, params: Record<string, string>): string => {
  return `${base}?${new URLSearchParams(params).toString()}`
}

export const buildShareUrl = (channel: SocialShareChannel, { url, text }: SharePayload): string => {
  switch (channel) {
    case ShareChannel.WhatsApp:
      return withParams('https://wa.me/', { text: `${text} ${url}` })
    case ShareChannel.X:
      return withParams('https://x.com/intent/post', { text, url })
    case ShareChannel.Facebook:
      return withParams('https://www.facebook.com/sharer/sharer.php', { u: url })
    case ShareChannel.LinkedIn:
      return withParams('https://www.linkedin.com/sharing/share-offsite/', { url })
    case ShareChannel.Telegram:
      return withParams('https://t.me/share/url', { url, text })
  }
}
