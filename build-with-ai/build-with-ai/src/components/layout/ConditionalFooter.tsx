'use client'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  // Hide footer on launching-soon route (handles both /launching-soon and nested paths)
  if (pathname?.includes('/launching-soon')) return null
  return <Footer />
}
