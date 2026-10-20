import { AuthCta } from '../types/analytics'
import { type FooterLink, FooterLinkLabel } from '../types/links'

export const AUTH_URLS: Record<AuthCta, string> = {
  [AuthCta.Login]: 'https://app.athyna.com/auth/login',
  [AuthCta.Signup]: 'https://app.athyna.com/auth/signup',
}

export const PRIVACY_URL = 'https://www.athyna.com/privacy'

export const HIRING_URL = 'https://www.athyna.com/for-talent'

export const FOOTER_LINKS: FooterLink[] = [
  { label: FooterLinkLabel.About, href: 'https://www.athyna.com/about' },
  { label: FooterLinkLabel.HireTalent, href: 'https://www.athyna.com/contact' },
  { label: FooterLinkLabel.Privacy, href: PRIVACY_URL },
]
