import { describe, expect, it } from 'vitest'
import { ShareChannel } from '../../types/share'
import { buildShareUrl, jobShareText, jobShareUrl } from '../share'

const payload = { url: 'https://jobs.example.com/jobs/42', text: 'Senior Dev at Acme & Co' }

describe('jobShareUrl', () => {
  it('builds an absolute link to the job page', () => {
    expect(jobShareUrl('42', 'https://jobs.example.com')).toBe('https://jobs.example.com/jobs/42')
    expect(jobShareUrl('42', 'http://localhost:5173')).toBe('http://localhost:5173/jobs/42')
  })
})

describe('jobShareText', () => {
  it('names the role and the company', () => {
    expect(jobShareText(' Senior Dev ', 'Acme ')).toBe('Senior Dev at Acme')
  })
})

describe('buildShareUrl', () => {
  it('puts the link inside the message for WhatsApp, which has no url field', () => {
    const url = new URL(buildShareUrl(ShareChannel.WhatsApp, payload))
    expect(url.origin).toBe('https://wa.me')
    expect(url.searchParams.get('text')).toBe(`${payload.text} ${payload.url}`)
  })

  it('passes text and url separately where the network supports both', () => {
    for (const channel of [ShareChannel.X, ShareChannel.Telegram] as const) {
      const url = new URL(buildShareUrl(channel, payload))
      expect(url.searchParams.get('text')).toBe(payload.text)
      expect(url.searchParams.get('url')).toBe(payload.url)
    }
  })

  it('passes only the url where the network reads the rest from the page', () => {
    expect(new URL(buildShareUrl(ShareChannel.Facebook, payload)).searchParams.get('u')).toBe(
      payload.url,
    )
    expect(new URL(buildShareUrl(ShareChannel.LinkedIn, payload)).searchParams.get('url')).toBe(
      payload.url,
    )
  })

  it('encodes characters that would break the query string', () => {
    expect(buildShareUrl(ShareChannel.X, payload)).not.toContain('& Co')
  })
})
