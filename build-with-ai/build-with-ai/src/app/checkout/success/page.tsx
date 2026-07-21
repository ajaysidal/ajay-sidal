import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Checkout Complete',
  description: 'Your BuildWithAI order has been received successfully.',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id?.trim()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full rounded-3xl border border-teal-500/30 bg-zinc-950/80 p-10 shadow-[0_0_40px_rgba(45,212,191,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Payment received</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Checkout complete</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
          Your order is now in the BuildWithAI fulfillment queue. You can continue exploring products, or head to your dashboard while the provisioning pipeline completes.
        </p>
        {sessionId ? (
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Session ID: {sessionId}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard/infrastructure" className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-400">
            Open Infrastructure Dashboard
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-6 py-3 text-sm font-bold text-zinc-100 transition hover:border-teal-500/40 hover:text-teal-300">
            Continue browsing products
          </Link>
        </div>
      </div>
    </main>
  )
}