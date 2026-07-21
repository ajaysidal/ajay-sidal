'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

const ConnectButton = dynamic(() => import('@/components/wallet/ConnectButton').then((mod) => ({ default: mod.ConnectButton })), {
  ssr: false,
  loading: () => <div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse" />,
})

export default function DeferredNavbarWallet() {
  const [enabled, setEnabled] = React.useState(false)

  if (enabled) {
    return <ConnectButton />
  }

  return (
    <button
      type="button"
      onClick={() => setEnabled(true)}
      className="px-4 py-1.5 text-sm bg-gradient-to-r from-[#00f2ff] to-cyan-600 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
    >
      Connect Wallet
    </button>
  )
}
