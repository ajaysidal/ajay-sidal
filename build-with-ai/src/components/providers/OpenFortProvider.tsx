'use client'
import { createContext, useContext, ReactNode } from 'react'

// Minimal OpenFortProvider shim - replace with real Alchemy+Openfort integration
interface OpenFortContextType {
  authenticated: boolean
  user: any
  login: () => Promise<void>
  logout: () => Promise<void>
  ready: boolean
}

const OpenFortContext = createContext<OpenFortContextType>({
  authenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  ready: true,
})

export function OpenFortProvider({ children }: { children: ReactNode }) {
  return <OpenFortContext.Provider value={{ authenticated: false, user: null, login: async()=>{}, logout: async()=>{}, ready: true }}>{children}</OpenFortContext.Provider>
}

export const useOpenFort = () => useContext(OpenFortContext)
export default OpenFortProvider
