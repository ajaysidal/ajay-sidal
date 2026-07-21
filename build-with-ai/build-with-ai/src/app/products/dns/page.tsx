import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DNS Management | BuildWithAI Enterprise',
  description: 'Complete DNS management solutions for enterprise domains. DNS hosting, nameservers, templates, and advanced configuration.',
  keywords: ['DNS', 'nameservers', 'DNS hosting', 'domain management'],
  openGraph: {
    title: 'DNS Management | BuildWithAI',
    description: 'Complete DNS management solutions for enterprise domains.',
    url: '/products/dns',
  },
};

export default function DNSPage() {
  return (
    <div className="w-full bg-[color:var(--bg-primary)]">
      <div className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            DNS Management Suite
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Enterprise-grade DNS solutions with reliability, performance, and complete control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* DNS Hosting */}
          <Link
            href="/products/dns/hosting"
            className="block bg-neutral-900/40 border border-neutral-800 px-8 py-12 rounded-2xl hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2" />
              </svg>
              <h3 className="text-xl font-bold text-white">DNS Hosting</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Global anycast DNS network with 99.99% uptime, DNSSEC support, and instant propagation.
            </p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Explore →</span>
          </Link>

          {/* Nameservers */}
          <Link
            href="/products/dns/nameservers"
            className="block bg-neutral-900/40 border border-neutral-800 px-8 py-12 rounded-2xl hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-white">Nameservers</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Manage and configure advanced nameserver settings for complete DNS authority.
            </p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Configure →</span>
          </Link>

          {/* DNS Templates */}
          <Link
            href="/products/dns/templates"
            className="block bg-neutral-900/40 border border-neutral-800 px-8 py-12 rounded-2xl hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-white">DNS Templates</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Pre-configured DNS templates for common services and integrations.
            </p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Browse →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
