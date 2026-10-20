import { Send } from 'lucide-react'
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, XIcon } from '../components/ui/BrandIcons'
import { type ShareChannelStyle, ShareChannel, type SocialShareChannel } from '../types/share'

export const COPY_FEEDBACK_MS = 2000

export const SOCIAL_SHARE_CHANNELS: Record<SocialShareChannel, ShareChannelStyle> = {
  [ShareChannel.WhatsApp]: { label: 'WhatsApp', icon: WhatsAppIcon, className: 'bg-whatsapp' },
  [ShareChannel.X]: { label: 'X', icon: XIcon, className: 'bg-black' },
  [ShareChannel.Facebook]: { label: 'Facebook', icon: FacebookIcon, className: 'bg-facebook' },
  [ShareChannel.LinkedIn]: { label: 'LinkedIn', icon: LinkedInIcon, className: 'bg-linkedin' },
  [ShareChannel.Telegram]: { label: 'Telegram', icon: Send, className: 'bg-telegram' },
}
