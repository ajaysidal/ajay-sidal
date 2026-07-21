import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import DeferredGlobalWidgets from '@/components/performance/DeferredGlobalWidgets';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NotificationProvider } from '@/lib/notifications';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital').replace(/\/$/, '');

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '700', '900'],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Opsvantage Digital | AI-Native Domains, Security & Hosting',
  description: 'AI-native domains, security, hosting, and wallet-ready identity.',
  icons: {
    icon: [
      { url: '/logo.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '48x48', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '64x64', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: '/logo.svg',
    other: [{ rel: 'mask-icon', url: '/logo.svg' }],
  },
  openGraph: {
    title: 'Opsvantage Digital | AI-Native Domains, Security & Hosting',
    description: 'AI-native domains, security, hosting, and wallet-ready identity.',
    siteName: 'Opsvantage Digital',
    url: siteUrl,
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'Opsvantage Digital Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opsvantage Digital | AI-Native Domains, Security & Hosting',
    description: 'AI-native domains, security, hosting, and wallet-ready identity.',
    images: ['/logo.svg'],
  },
  alternates: {
    canonical: '/',
  },
};


const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Opsvantage Digital',
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      sameAs: [siteUrl],
    },
    {
      '@type': 'WebSite',
      name: 'Opsvantage Digital',
      url: siteUrl,
    },
    {
      '@type': 'Product',
      name: 'Opsvantage Platform',
      description: 'AI-native domain, hosting, and security services for modern businesses.',
      url: siteUrl,
      brand: {
        '@type': 'Brand',
        name: 'Opsvantage Digital',
      },
      image: `${siteUrl}/logo.svg`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <head>
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{
        __html: `(function() {
          try {
            const t = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            document.documentElement.classList.toggle("dark", t === "dark");
            document.documentElement.setAttribute("data-theme", t);
          } catch(e) {}
        })();`
      }}
    />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className} flex flex-col min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] relative`} suppressHydrationWarning>
        <ThemeProvider>
          <NotificationProvider>
            <Navbar />
            <main id="main-content" className="flex-grow">{children}</main>
             <ConditionalFooter />
            <DeferredGlobalWidgets />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
