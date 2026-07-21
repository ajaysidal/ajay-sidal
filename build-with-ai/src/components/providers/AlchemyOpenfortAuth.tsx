'use client'
import { createContext, useContext, ReactNode } from 'react'

// TEMP STUB: Replace with real Alchemy Account Kit + Openfort integration
interface AuthContextType {
  authenticated: boolean
  user: any
  login: () => Promise<void>
  logout: () => Promise<void>
  ready: boolean
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  ready: true,
})

export function AlchemyOpenfortAuthProvider({ children }: { children: ReactNode }) {
  // TODO: Initialize Alchemy Account Kit (@alchemy/aa-core)
  // TODO: Initialize Openfort session orchestration (@openfort/openfort-js)
  return <AuthContext.Provider value={{ authenticated: false, user: null, login: async()=>{}, logout: async()=>{}, ready: true }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
