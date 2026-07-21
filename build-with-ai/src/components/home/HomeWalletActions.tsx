'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

const ConnectWalletButton = dynamic(
  () => import('@/components/web3/ConnectWalletButton').then((mod) => ({ default: mod.ConnectWalletButton })),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="bg-neutral-900 border border-neutral-800 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
        Loading...
      </button>
    ),
  },
)

const CreateWalletButton = dynamic(
  () => import('@/components/web3/CreateWalletButton').then((mod) => ({ default: mod.CreateWalletButton })),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="bg-gradient-to-r from-[#00f2ff]/20 to-[#00f2ff]/10 border border-[#00f2ff]/50 text-[#00f2ff] px-8 py-3 rounded-lg font-black text-sm transition-all flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
        Loading...
      </button>
    ),
  },
)

export default function HomeWalletActions() {
  const [showConnect, setShowConnect] = React.useState(false)
  const [showCreate, setShowCreate] = React.useState(false)

  return (
    <>
      {showConnect ? (
        <ConnectWalletButton />
      ) : (
        <button
          type="button"
          onClick={() => setShowConnect(true)}
          className="bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-xl"
        >
          Connect wallet
        </button>
      )}

      {showCreate ? (
        <CreateWalletButton />
      ) : (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-[#00f2ff]/20 to-[#00f2ff]/10 border border-[#00f2ff]/50 text-[#00f2ff] px-8 py-3 rounded-lg font-black text-sm transition-all"
        >
          Create wallet
        </button>
      )}
    </>
  )
}
