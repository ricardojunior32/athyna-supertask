import type {
  AnalyticsClient,
  AnalyticsEvent,
  AnalyticsEventProperties,
} from '../types/analytics'

const key = import.meta.env.VITE_POSTHOG_KEY?.trim()
let client: AnalyticsClient | undefined
let pending: Array<(client: AnalyticsClient) => void> = []

export const initAnalytics = () => {
  if (!key) {
    if (import.meta.env.DEV) {
      console.info('[analytics] VITE_POSTHOG_KEY is not set: events are logged here, not sent.')
    }
    return
  }

  import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
        defaults: '2026-08-30',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: true,
        capture_heatmaps: true,
        disable_session_recording: true,
        person_profiles: 'identified_only',
      })
      client = posthog
      for (const send of pending) send(posthog)
      pending = []
    })
    .catch(() => {
      pending = []
    })
}

export const track = <Event extends AnalyticsEvent>(
  event: Event,
  properties: AnalyticsEventProperties[Event],
) => {
  if (!key) {
    if (import.meta.env.DEV) console.debug('[analytics]', event, properties)
    return
  }
  if (client) client.capture(event, properties)
  else pending.push((ready) => ready.capture(event, properties))
}
