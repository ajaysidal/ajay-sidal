import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
  description: 'Your BuildWithAI checkout was cancelled before payment completed.',
}

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-950/80 p-10 shadow-[0_0_40px_rgba(15,23,42,0.2)]">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Checkout cancelled</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">No payment was captured</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
          Your cart has not been charged. You can return to the product catalog, compare options, or book an appointment if you want help choosing the right package.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-400">
            Return to products
          </Link>
          <Link href="/leads" className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-6 py-3 text-sm font-bold text-zinc-100 transition hover:border-teal-500/40 hover:text-teal-300">
            Book an appointment
          </Link>
        </div>
      </div>
    </main>
  )
}