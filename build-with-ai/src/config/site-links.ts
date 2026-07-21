export type SiteLink = {
  label: string
  href: string
  emphasize?: boolean
}

export type FooterSection = {
  title: string
  links: SiteLink[]
}

export type HomeFeature = {
  title: string
  description: string
  href: string
  cta: string
  wide?: boolean
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital').replace(/\/$/, '')

export const PRIMARY_NAV_LINKS: SiteLink[] = [
  { label: 'Home', href: '/' },
]

export const PRODUCT_LINKS: SiteLink[] = [
  { label: 'Current Promotions', href: '/promotions', emphasize: true },
  { label: 'Domain Registration', href: '/products/domains/registration' },
  { label: 'SSL Certificates', href: '/products/ssl' },
  { label: 'Premium Email', href: '/products/email/templates' },
  { label: 'Plesk Hosting', href: '/products/licenses/plesk' },
  { label: 'Smart Wallets', href: '/identity' },
]

export const SERVICE_LINKS: SiteLink[] = [
  { label: 'DFY Websites', href: '/services/ai-design' },
  { label: 'Brand Protection', href: '/services/domain-management' },
  { label: 'Enterprise API', href: '/developers' },
]

export const PROTOCOL_LINKS: SiteLink[] = [
  { label: 'MARZ Utility', href: '/dashboard/marz' },
  { label: 'Gasless Bridge', href: '/dashboard/infrastructure' },
  { label: 'Whitepaper', href: '/about' },
  { label: 'Investor Brief', href: '/investors' },
]

export const MOBILE_NAV_LINKS: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Promotions', href: '/promotions', emphasize: true },
  { label: 'Services & DFY', href: '/services' },
  { label: 'Protocol', href: '/dashboard/marz' },
  { label: 'Investor Brief', href: '/investors' },
]

export const HOME_HERO_CTAS: SiteLink[] = [
  { label: 'Explore Products', href: '/products', emphasize: true },
  { label: 'Investor Brief', href: '/investors' },
]

export const HOME_FEATURES: HomeFeature[] = [
  {
    title: 'AI-Native Domains',
    description: 'Search, register, and protect digital identity with a cleaner path into wallet-ready infrastructure.',
    href: '/identity',
    cta: 'Explore Engine',
    wide: true,
  },
  {
    title: 'SSL Sanctuary',
    description: 'Production-grade encryption and protection for customer-facing websites and apps.',
    href: '/products/ssl',
    cta: 'Secure Now',
  },
  {
    title: 'Enterprise Hosting',
    description: 'Dedicated environments for teams that need speed, control, and reliable uptime.',
    href: '/products/dns/hosting',
    cta: 'Deploy Server',
  },
  {
    title: 'Launch Systems',
    description: 'Done-for-you website and infrastructure builds for founders who need faster execution.',
    href: '/services/ai-design',
    cta: 'View Portfolio',
    wide: true,
  },
  {
    title: 'MARZ Utility Layer',
    description: 'Access, rewards, and retention benefits designed to deepen customer value over time.',
    href: '/academy',
    cta: 'Enter Academy',
  },
]

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Products',
    links: [
      { label: 'Domains', href: '/products/domains/registration' },
      { label: 'SSL Sanctuary', href: '/products/ssl' },
      { label: 'Premium Email', href: '/products/email/templates' },
      { label: 'Plesk Hosting', href: '/products/licenses/plesk' },
      { label: 'Smart Wallets', href: '/identity' },
    ],
  },
  {
    title: 'Services',
    links: SERVICE_LINKS,
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'MARZ Utility', href: '/dashboard/marz' },
      { label: 'Gasless Bridge', href: '/dashboard/infrastructure' },
      { label: 'Investor Brief', href: '/investors' },
      { label: 'Whitepaper', href: '/about' },
      { label: 'Promotions', href: '/promotions', emphasize: true },
      { label: 'Dashboard Home', href: '/dashboard' },
      { label: 'MARZ Vault', href: '/dashboard/marz' },
      { label: 'Sovereign CRM', href: '/dashboard/leads' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Book Live Demo', href: '/leads' },
      { label: 'Sign In', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
]

export const BOOK_APPOINTMENT_LINK: SiteLink = { label: 'Book Live Demo', href: '/leads' }