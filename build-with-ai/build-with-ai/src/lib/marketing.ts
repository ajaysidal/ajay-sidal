'use client'

export type MarketingEventPayload = {
  event: string
  source?: string
  metadata?: Record<string, string | number | boolean | null | undefined>
}

function hasAnalyticsConsent() {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((cookie) => cookie.trim() === 'cookie-analytics=true')
}

export async function trackMarketingEvent(payload: MarketingEventPayload) {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return

  const body = JSON.stringify({
    ...payload,
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/marketing/track', blob)
      return
    }

    await fetch('/api/marketing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Swallow tracking failures; never block UX.
  }
}
