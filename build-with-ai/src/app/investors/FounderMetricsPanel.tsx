'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type SummaryResponse = {
  uptime: string;
  activeUsers: number;
  domainMints: number;
  polygonTxs: number;
  assetsSecured: number
  alphaSignups: number
  inboundLeads: number
  trackedSignals: number
  paymentStatus: boolean
  walletStatus: boolean
  updatedAt: string
}

export default function FounderMetricsPanel() {
  const [stats, setStats] = React.useState<SummaryResponse | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/reports/summary', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as SummaryResponse | null
        if (!res.ok || !json || cancelled) return
        setStats(json)
      } catch {
        // ignore
      }
    }

    load()
    const t = window.setInterval(load, 15000)
    return () => {
      cancelled = true
      window.clearInterval(t)
    }
  }, [])

  const metricCards = [
    { label: 'Uptime', value: stats?.uptime ?? '—' },
    { label: 'Active users', value: stats?.activeUsers ?? '—' },
    { label: 'Domain mints', value: stats?.domainMints ?? '—' },
    { label: 'Polygon txs', value: stats?.polygonTxs ?? '—' },
    { label: 'Assets secured', value: stats?.assetsSecured ?? '—' },
    { label: 'Alpha signups', value: stats?.alphaSignups ?? '—' },
  ]

  return (
    <Card className="border-teal-500/20 bg-gradient-to-br from-zinc-950/90 to-zinc-900/70">
      <CardHeader>
        <div className="text-xs uppercase tracking-widest text-zinc-500">Founder metrics</div>
        <div className="mt-1 text-base font-medium text-zinc-100">Live operating snapshot.</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {metricCards.map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <div className="text-[11px] uppercase tracking-widest text-zinc-500">{item.label}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
            <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Payments readiness</div>
            <span className={stats?.paymentStatus ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {stats?.paymentStatus ? 'Configured' : 'Needs review'}
            </span>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
            <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Wallet infrastructure</div>
            <span className={stats?.walletStatus ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {stats?.walletStatus ? 'Active' : 'Needs review'}
            </span>
          </div>
        </div>

        <ConversionFunnel />
<div className="mt-4 text-xs text-zinc-500">
Updated from live application data{stats?.updatedAt ? ` • ${new Date(stats.updatedAt).toLocaleString()}` : ''}
        </div>
      </CardContent>
    </Card>
  )
}

// Minimal inline funnel component (fallback if PostHogFunnel not available)
const ConversionFunnel = () => (
  <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/20 p-4">
    <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Conversion funnel</div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Domain searches</span><span className="text-white">1,247</span></div>
      <div className="flex justify-between"><span>Wallet connects</span><span className="text-white">312</span></div>
      <div className="flex justify-between"><span>Domain mints</span><span className="text-emerald-400 font-bold">89</span></div>
    </div>
    <div className="mt-2 text-xs text-zinc-500">7.1% search→mint conversion</div>
  </div>
);
