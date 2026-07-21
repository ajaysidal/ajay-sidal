'use client'

/**
 * Sovereign Identity Provider
 * Replaces all Openfort/Privy logic with Safe + local signer.
 */

import { createContext, useContext } from 'react'
import { useSmartAccount } from '@/hooks/useSmartAccount'

type PrivyContextType = ReturnType<typeof useSmartAccount>

const PrivyContext = createContext<PrivyContextType | null>(null)

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const state = useSmartAccount()
  return <PrivyContext.Provider value={state}>{children}</PrivyContext.Provider>
}

export default PrivyProvider

// Old API compatibility
export const usePrivy = () => {
  const ctx = useContext(PrivyContext)
  if (!ctx) throw new Error('usePrivy must be used inside PrivyProvider')

  return {
    authenticated: ctx.authenticated,
    user: ctx.user,
    login: ctx.login,
    logout: ctx.logout,
    ready: ctx.ready,
    linkWallet: async () => {},
  }
}

export const useLogin = () => {
  const ctx = useContext(PrivyContext)
  if (!ctx) throw new Error('useLogin must be used inside PrivyProvider')
  return { login: ctx.login }
}
