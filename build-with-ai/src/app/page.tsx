import type { Metadata, Viewport } from 'next'
import HomeContent from '@/components/home/HomeContent'
import DomainSearch from '@/components/web3/DomainSearch'
import FAQ from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'AI-Native Domains, Security & Hosting | BUILD WITH AI',
  description: 'The AI-native registrar and infrastructure platform for modern businesses.',
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital').replace(/\/$/, '') + '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

// Force dynamic rendering to avoid Wagmi provider issues during build
export const dynamic = 'force-dynamic'

export default function Home() {
  return <HomeContent />;
}
