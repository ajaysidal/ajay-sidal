import type { Metadata } from 'next'
import DiligenceAccessClient from './DiligenceAccessClient'

export const metadata: Metadata = {
  title: 'Diligence Room Access | BuildWithAI.digital',
  description: 'Confidential diligence access for verified investors and strategic partners.',
}

export default function DiligenceRoomPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Restricted diligence room
        </div>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Confidential materials for verified investor conversations.
        </h1>
        <p className="mt-4 max-w-3xl text-pretty text-base text-zinc-300 sm:text-lg">
          This room is designed for aligned investors and strategic partners who want a deeper view into the business model, operating signals, and founder-led demo path.
        </p>
      </section>

      <DiligenceAccessClient />
    </main>
  )
}
