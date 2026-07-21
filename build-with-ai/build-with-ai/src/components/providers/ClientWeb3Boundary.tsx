'use client'

import * as React from 'react'
import { PrivyProvider } from '@/components/providers/PrivyProvider'
import { Web3Provider } from '@/components/providers/Web3Provider'

interface ClientWeb3BoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientWeb3Boundary({ children, fallback = null }: ClientWeb3BoundaryProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return (
    <PrivyProvider>
      <Web3Provider>{children}</Web3Provider>
    </PrivyProvider>
  )
}

export default ClientWeb3Boundary
