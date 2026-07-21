'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

const DomainSearch = dynamic(() => import('@/components/web3/DomainSearch'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-6 py-6 text-sm text-neutral-400">
      Loading live domain search…
    </div>
  ),
})

export default function HomeDomainSearchShell() {
  const [enabled, setEnabled] = React.useState(false)

  if (enabled) {
    return <DomainSearch />
  }

  return (
    <div className="rounded-2xl border border-teal-500/30 bg-[#0a0a0a]/80 p-4 shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left">
          <div className="text-sm font-semibold text-white">Live domain search is available on demand.</div>
          <div className="text-xs text-neutral-400">Open the tool when you want to check availability and pricing.</div>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(true)}
          className="bg-teal-500 text-neutral-950 font-bold px-6 py-3 rounded-xl hover:bg-teal-400 transition-all"
        >
          Open domain search
        </button>
      </div>
    </div>
  )
}
