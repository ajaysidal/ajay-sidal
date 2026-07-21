import Link from "next/link";
import FAQ from '@/components/ui/FAQ'
import { HOME_FEATURES, HOME_HERO_CTAS } from '@/config/site-links';
import HomeWalletActions from '@/components/home/HomeWalletActions'
import HomeDomainSearchShell from '@/components/home/HomeDomainSearchShell'

const proofPoints = [
  {
    title: 'Products live',
    detail: 'Domains, SSL, hosting, and launch services are publicly available.',
  },
  {
    title: 'Payments active',
    detail: 'Secure checkout infrastructure is enabled for commercial flows.',
  },
  {
    title: 'Wallet-ready identity',
    detail: 'Polygon and smart-wallet UX are already integrated into the platform.',
  },
  {
    title: 'Operationally monitored',
    detail: 'Health checks, deployment controls, and production safeguards are in place.',
  },
  {
    title: 'Pilot onboarding open',
    detail: 'Founders and modern service businesses can book a live walkthrough today.',
  },
];

const operatingSteps = [
  {
    step: '01',
    title: 'Choose and secure your digital identity',
    description: 'Search, register, or migrate domains and layer in protection from day one.',
  },
  {
    step: '02',
    title: 'Manage infrastructure with AI assistance',
    description: 'Handle hosting, security, and operational workflows from one platform experience.',
  },
  {
    step: '03',
    title: 'Unlock ecosystem benefits through MARZ',
    description: 'Use MARZ for access, rewards, and retention perks that strengthen long-term usage.',
  },
];

export default function HomeContent() {
  return (
    <div className="w-full">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pb-12 pt-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-bold tracking-tight uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            Built for founders, agencies, and modern service businesses
          </div>
          <h1 className="text-sovereign-header normal-case text-4xl md:text-6xl text-white mb-6 max-w-5xl">
            AI-native domains, security, hosting, and <span className="text-teal-400">wallet-ready identity</span>.
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl max-w-4xl mx-auto mb-6 opacity-90 font-medium leading-relaxed">
            Build With AI brings registrar services, operational tooling, and modern infrastructure into one system so businesses can launch, secure, and grow faster.
          </p>
          <p className="text-neutral-400 text-sm md:text-base max-w-3xl mx-auto mb-10 leading-relaxed">
            MARZ sits underneath as the ecosystem utility and retention layer — designed for access, rewards, and customer loyalty rather than speculation-first storytelling.
          </p>
          <div className="w-full max-w-3xl mb-10"><HomeDomainSearchShell /></div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={HOME_HERO_CTAS[0].href}
              className="bg-teal-500 hover:bg-teal-400 text-neutral-950 px-8 py-3 rounded-lg font-black text-sm transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse" />{HOME_HERO_CTAS[0].label}
            </Link>
            <Link
              href={HOME_HERO_CTAS[1].href}
              className="bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-xl"
            >
              {HOME_HERO_CTAS[1].label}
            </Link>
            <HomeWalletActions />
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-neutral-900 bg-[#050505]/80 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            {proofPoints.map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-800 bg-black/20 px-4 py-4">
                <div className="text-teal-400 text-[11px] font-black tracking-wider uppercase mb-2">{item.title}</div>
                <p className="text-neutral-300 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-neutral-900 bg-[#050505]/50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-bold tracking-normal text-neutral-400 uppercase mb-8">Platform Backbone and Deployment Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-[#8247E5]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l10.4 6v12L12 24l-10.4-6V6L12 0zm0 2.3L3.5 7.2v9.6L12 21.7l8.5-4.9V7.2L12 2.3z"/></svg>
              <span className="text-lg font-bold">polygon</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-lg font-bold">Alchemy</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9"></path></svg>
              <span className="text-lg font-bold">Global Registry</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
              <span className="text-lg font-bold">NEXT.js</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2"></path></svg>
              <span className="text-lg font-bold">Plesk</span>
            </div>
          </div>
        </div>
      </section>

      <section id="services-grid" className="py-24 relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-sovereign-header text-4xl md:text-5xl text-white mb-4">One platform, multiple <span className="text-teal-500">revenue engines</span></h2>
          <p className="text-neutral-400 text-lg max-w-3xl mx-auto font-medium">Everything here is designed to make the business model more legible: recurring infrastructure revenue, productized services, and a wallet-native ecosystem layer.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {HOME_FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href} className={`${feature.wide ? 'md:col-span-2 ' : ''}block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all`}>
              <h3 className={`text-sovereign-title ${feature.wide ? 'text-2xl' : 'text-xl'} text-white mb-5`}>{feature.title}</h3>
              <p className={`text-neutral-400 ${feature.wide ? 'leading-relaxed' : 'text-sm leading-relaxed'} mb-8`}>{feature.description}</p>
              <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">{feature.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#050505] border-y border-neutral-900 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-bold tracking-tight uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            How it works
          </div>
          <h2 className="text-sovereign-header text-3xl md:text-5xl text-white mb-12">A cleaner path from setup to <span className="text-teal-500">retention</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {operatingSteps.map((item) => (
              <div key={item.step} className="rounded-3xl border border-neutral-800 bg-black/20 p-6">
                <div className="text-teal-400 font-black text-lg mb-3">{item.step}</div>
                <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a] relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <h2 className="text-sovereign-header text-3xl md:text-5xl text-white mb-4">Founder-led and <span className="text-teal-500">investor-ready</span></h2>
            <p className="text-neutral-400 text-lg">We are tightening the story around a practical thesis: modern businesses need a faster, smarter, and more unified way to own and operate their digital infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-teal-400 mb-3">Founder profile</div>
              <h3 className="text-white text-2xl font-bold mb-3">Ajay Sidal</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">Builder focused on shipping a category-defining infrastructure platform that blends AI workflows, security, and wallet-native identity into one commercial system.</p>
              <Link href="/about" className="text-teal-400 text-sm font-bold hover:text-teal-300">Read the mission →</Link>
            </div>
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-teal-400 mb-3">Roadmap snapshot</div>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li>• Clarify the core registrar and infrastructure story</li>
                <li>• Expand pilot onboarding for founders and agencies</li>
                <li>• Deepen MARZ utility around access, rewards, and retention</li>
                <li>• Package product metrics for investor and partner conversations</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-teal-400 mb-3">Live walkthrough</div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-5">Book a founder-led demo, review the investor brief, and explore the product flow before your first call.</p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/leads?intent=demo"
                  className="bg-teal-500 hover:bg-teal-400 text-neutral-950 px-4 py-3 rounded-lg font-black text-sm text-center"
                >
                  Book live demo
                </Link>
                <Link
                  href="/investors"
                  className="border border-neutral-700 hover:border-teal-500/50 text-white px-4 py-3 rounded-lg font-bold text-sm text-center"
                >
                  View investor brief
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
