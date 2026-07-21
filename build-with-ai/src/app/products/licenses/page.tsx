import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hosting Licenses | BuildWithAI Enterprise',
  description: 'Enterprise hosting licenses including Plesk and Virtuozzo for complete server management and control.',
  keywords: ['hosting licenses', 'Plesk', 'Virtuozzo', 'server management'],
  openGraph: {
    title: 'Hosting Licenses | BuildWithAI',
    description: 'Enterprise hosting licenses for complete server management.',
    url: '/products/licenses',
  },
};

export default function LicensesPage() {
  return (
    <div className="w-full bg-[color:var(--bg-primary)]">
      <div className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hosting Licenses
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Enterprise-grade hosting management solutions with full control and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plesk */}
          <Link
            href="/products/licenses/plesk"
            className="block bg-neutral-900/40 border border-neutral-800 px-8 py-12 rounded-2xl hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Plesk Hosting</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Industry-leading control panel for server and website management. Automate your infrastructure with ease.
            </p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Get Plesk →</span>
          </Link>

          {/* Virtuozzo */}
          <Link
            href="/products/licenses/virtuozzo"
            className="block bg-neutral-900/40 border border-neutral-800 px-8 py-12 rounded-2xl hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Virtuozzo</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Container and virtual machine management platform for next-generation infrastructure optimization.
            </p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Explore Virtuozzo →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
