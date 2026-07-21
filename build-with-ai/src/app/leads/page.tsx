"use client"

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { trackMarketingEvent } from '@/lib/marketing'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const SERVICES = [
  { value: 'domains', label: 'Domain Registration' },
  { value: 'ssl', label: 'SSL Certificates' },
  { value: 'hosting', label: 'Enterprise Hosting' },
  { value: 'ai-design', label: 'DFY Website / AI Design' },
  { value: 'smart-wallet', label: 'Smart Wallet / Web3' },
  { value: 'investor-demo', label: 'Investor / Founder Demo' },
  { value: 'partnership', label: 'Strategic Partnership' },
  { value: 'other', label: 'General Inquiry' },
]

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [service, setService] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [state, setState] = React.useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = React.useState('')

  React.useEffect(() => {
    const intent = searchParams.get('intent')

    if (intent === 'investor') {
      setService('investor-demo')
      setMessage((current) => current || 'I would like a founder-led investor walkthrough and a concise overview of the business model, traction, and roadmap.')
      trackMarketingEvent({ event: 'lead_page_view', source: 'investor_intent' })
    } else if (intent === 'demo') {
      setService('ai-design')
      setMessage((current) => current || 'I would like to book a live product demo and discuss the best starting package for my business.')
      trackMarketingEvent({ event: 'lead_page_view', source: 'demo_intent' })
    } else if (intent === 'identity-bridge') {
      setService('smart-wallet')
      setMessage((current) => current || 'I would like to initiate a sovereign identity bridge for my domain and review the wallet-ready migration path, setup steps, and founder-led onboarding flow.')
      trackMarketingEvent({ event: 'lead_page_view', source: 'identity_bridge_intent' })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          service: service || 'other',
          message: message.trim(),
          tier: 'starter',
        }),
      })

      if (res.ok) {
        setState('success')
        trackMarketingEvent({ event: 'lead_form_submit', source: 'contact_page', metadata: { service: service || 'other' } })
      } else {
        const data = await res.json().catch(() => ({}))
        // Inquiry endpoint requires auth cookie; fall back to storing locally
        if (res.status === 401) {
          // Save to the general leads queue instead (no auth required)
          const r2 = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              company: company.trim() || email.trim().split('@')[1] || 'unknown',
              domain: email.trim().split('@')[1] || undefined,
              service: service || 'other',
              message: message.trim(),
            }),
          })
          if (r2.ok || r2.status === 200) {
            setState('success')
            trackMarketingEvent({ event: 'lead_form_submit', source: 'contact_page_fallback', metadata: { service: service || 'other' } })
          } else {
            throw new Error(data?.error || 'Submission failed')
          }
        } else {
          throw new Error(data?.error || 'Submission failed')
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-full rounded-3xl border border-teal-500/30 bg-zinc-950/80 p-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Message received</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">We'll be in touch.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-400">
            Thank you for reaching out. A member of the BUILD WITH AI team will respond to <span className="text-white font-medium">{email}</span> shortly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-400">
              Back to Home
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-6 py-3 text-sm font-bold text-zinc-100 transition hover:border-teal-500/40">
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-16">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Always Together. Never Alone.</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Book a live demo, investor call, or growth conversation</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Whether you need product guidance, a founder walkthrough, a partnership discussion, or a custom build — send us a message and we will respond within one business day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name *</label>
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Ajay Morrison"
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-teal-500/60 focus:outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-teal-500/60 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Company / Domain</label>
              <input
                id="company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="acme.com"
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-teal-500/60 focus:outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="service" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Service of Interest</label>
              <select
                id="service"
                value={service}
                onChange={e => setService(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-teal-500/60 focus:outline-none transition appearance-none"
              >
                <option value="">Select a service…</option>
                {SERVICES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Message *</label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Tell us what you need…"
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-teal-500/60 focus:outline-none transition resize-none"
            />
          </div>

          {state === 'error' && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === 'submitting'}
            className="w-full rounded-xl bg-teal-500 px-6 py-4 text-sm font-black text-zinc-950 transition hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {state === 'submitting' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending…
              </>
            ) : 'Send Message & Request Call'}
          </button>
        </form>

        {/* Side info */}
        <aside className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">Response Time</h3>
            <p className="mt-2 text-sm text-zinc-400">We respond to all inquiries within <span className="text-white font-medium">1 business day</span>.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">Direct Email</h3>
            <a href="mailto:hello@buildwithai.digital" className="mt-2 block text-sm text-teal-400 hover:text-teal-300 transition">
              hello@buildwithai.digital
            </a>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">Demo Format</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />15-minute founder walkthrough</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />Product thesis, revenue model, and roadmap</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />Best for investors, partners, and early pilot customers</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
