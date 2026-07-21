'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackMarketingEvent } from '@/lib/marketing'

type AccessState = {
  authenticated: boolean
  accessGranted: boolean
  email: string | null
  name?: string | null
}

export default function DiligenceAccessClient() {
  const [state, setState] = React.useState<AccessState | null>(null)
  const [form, setForm] = React.useState({ name: '', organization: '', role: '', website: '', purpose: '', ndaAccepted: false })
  const [submitting, setSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      const res = await fetch('/api/investors/diligence/request', { cache: 'no-store' })
      const json = (await res.json().catch(() => null)) as AccessState | null
      if (json) {
        setState(json)
        setForm((current) => ({ ...current, name: current.name || json.name || '', }))
      }
    }

    load()
  }, [])

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/investors/diligence/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error || 'Request failed')

      setState((current) => ({ ...(current || { authenticated: true, email: null }), accessGranted: true }))
      setMessage('Access granted. The diligence room is now unlocked for your account.')
      trackMarketingEvent({ event: 'diligence_room_unlocked', source: 'nda_gate' })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!state) {
    return <div className="text-sm text-zinc-400">Loading diligence access…</div>
  }

  if (!state.authenticated) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Step 1</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Create an account or sign in</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            Access to the private diligence room is limited to signed-in investors and strategic partners.
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/signup?next=/investors/diligence" className="rounded-lg bg-teal-500 px-4 py-2 font-black text-zinc-950">Create account</Link>
              <Link href="/login?next=/investors/diligence" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white">Sign in</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Why this room is gated</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Confidential diligence only.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            We keep the public investor page open, but reserve deeper diligence material for verified accounts that acknowledge confidentiality.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.accessGranted) {
    return (
      <div className="space-y-6">
        <Card className="border-teal-500/30 bg-zinc-950/70">
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-teal-400">Access status</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Diligence room unlocked</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            {message || 'Your account can now review the confidential investor summary and proceed to a founder-led walkthrough.'}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card><CardHeader><div className="text-xs uppercase tracking-widest text-zinc-500">Confidential focus</div></CardHeader><CardContent className="pt-1 text-sm text-zinc-300">Recurring revenue model and platform wedge.</CardContent></Card>
          <Card><CardHeader><div className="text-xs uppercase tracking-widest text-zinc-500">Readiness</div></CardHeader><CardContent className="pt-1 text-sm text-zinc-300">Live product, payments, wallet infra, and monitored ops.</CardContent></Card>
          <Card><CardHeader><div className="text-xs uppercase tracking-widest text-zinc-500">Next step</div></CardHeader><CardContent className="pt-1 text-sm text-zinc-300">Book a founder walkthrough to review deeper materials.</CardContent></Card>
          <Card><CardHeader><div className="text-xs uppercase tracking-widest text-zinc-500">MARZ posture</div></CardHeader><CardContent className="pt-1 text-sm text-zinc-300">Utility, access, rewards, and retention rather than speculation-first framing.</CardContent></Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/leads?intent=investor" className="rounded-lg bg-teal-500 px-4 py-2 font-black text-zinc-950">Book founder walkthrough</Link>
          <Link href="/investors" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white">Back to investor brief</Link>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-xs uppercase tracking-widest text-zinc-500">Step 2</div>
        <div className="mt-1 text-base font-medium text-zinc-100">Acknowledge confidentiality and unlock access</div>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={submitRequest} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            <Input placeholder="Role / title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <textarea
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            rows={4}
            placeholder="What would you like to review during diligence?"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-teal-500/60 focus:outline-none transition resize-none"
          />
          <label className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
            <input type="checkbox" checked={form.ndaAccepted} onChange={(e) => setForm({ ...form, ndaAccepted: e.target.checked })} className="mt-1" />
            <span>I acknowledge that the diligence materials are confidential and I will not redistribute them without permission.</span>
          </label>
          {message ? <div className="text-sm text-zinc-300">{message}</div> : null}
          <Button type="submit" disabled={submitting || !form.ndaAccepted} className="h-12">
            {submitting ? 'Unlocking…' : 'Unlock diligence room'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
