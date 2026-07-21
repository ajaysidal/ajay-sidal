'use client'

import Link from 'next/link'
import { trackMarketingEvent } from '@/lib/marketing'

export default function InvestorActions() {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href="/leads?intent=investor"
        onClick={() => trackMarketingEvent({ event: 'investor_cta_click', source: 'investor_brief', metadata: { cta: 'book_founder_walkthrough' } })}
        className="rounded-lg bg-teal-500 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-teal-400"
      >
        Book founder walkthrough
      </Link>
      <Link
        href="/investors/diligence"
        onClick={() => trackMarketingEvent({ event: 'investor_cta_click', source: 'investor_brief', metadata: { cta: 'request_diligence_access' } })}
        className="rounded-lg border border-teal-500/40 px-5 py-3 text-sm font-bold text-teal-300 transition hover:bg-teal-500/10"
      >
        Request diligence access
      </Link>
      <Link
        href="/products"
        onClick={() => trackMarketingEvent({ event: 'investor_cta_click', source: 'investor_brief', metadata: { cta: 'explore_live_products' } })}
        className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-bold text-white transition hover:border-teal-500/50"
      >
        Explore live products
      </Link>
    </div>
  )
}
