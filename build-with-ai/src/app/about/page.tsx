import type { Metadata } from 'next'
import Link from 'next/link'
import AboutHeroClient from './AboutHeroClient'
import ImpactTracker from './ImpactTracker'
import LaunchMagnet from '../../components/LaunchMagnet'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import ExternalLink from '../../components/ExternalLink'

export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Our Vision | The Mission Behind BuildWithAI.digital',
  description:
    "Learn why we built the world's first AI-native infrastructure hub and how every purchase fuels the MARZ Project.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <LaunchMagnet defaultOpen={false} />

      <AboutHeroClient />

      <ImpactTracker />

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Problem</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Digital infrastructure is still fragmented.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          Businesses still juggle separate tools for domains, SSL, hosting, support, and identity. The result is slower launches, weaker trust, and too much operational drag.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Solution</div>
          <div className="mt-1 text-base font-medium text-zinc-100">One operating system for digital presence.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          BuildWithAI.digital brings registrar services, hosting, security, and AI-assisted workflows into a more unified product. The goal is simple: make infrastructure feel faster, clearer, and more dependable.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Mission</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Practical utility over hype.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          MARZ is designed as an ecosystem layer for access, rewards, and retention across the platform. We are building long-term product value first, then reinforcing it with thoughtful utility.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">Founder's Desk</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Transparency over hype.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-sm text-zinc-200">— Ajay Sidal</div>
            <div className="mt-1 text-xs text-zinc-500">Founder, BuildWithAI.digital</div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <Link className="text-zinc-200 underline underline-offset-4" href="/investors">Investor Brief</Link>
              <ExternalLink className="text-zinc-200 underline underline-offset-4" href="mailto:ajay@buildwithai.digital">Founder Inbox</ExternalLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
