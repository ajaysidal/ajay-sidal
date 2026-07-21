import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import InvestorActions from './InvestorActions'
import FounderMetricsPanel from './FounderMetricsPanel'

export const metadata: Metadata = {
  title: 'Investor Brief | BuildWithAI.digital',
  description: 'A concise overview of the AI-native registrar and infrastructure platform for modern businesses.',
}

const platformPillars = [
  {
    title: 'Problem',
    description:
      'Modern businesses still piece together registrars, SSL vendors, hosting panels, support workflows, and identity tools across too many fragmented systems.',
  },
  {
    title: 'Product',
    description:
      'Build With AI brings domains, security, hosting, and wallet-ready identity into one AI-native platform experience.',
  },
  {
    title: 'Customer',
    description:
      'The strongest early fit is founders, agencies, and service-led businesses that need speed, trust, and operational clarity.',
  },
  {
    title: 'Why now',
    description:
      'Legacy registrars have barely evolved, while AI automation and wallet-based identity create a fresh opening for a better category leader.',
  },
]

const businessModel = [
  'Recurring revenue from domains, SSL, hosting, and premium infrastructure services',
  'Productized launch and migration services for founder-led teams',
  'Higher lifetime value through ecosystem access, support, and retention benefits',
]

const readiness = [
  'Public product surface is live and commercially packaged',
  'Secure payment flow and operational APIs are already implemented',
  'Wallet-native identity and Polygon infrastructure are integrated into the experience',
  'Deployment safeguards, health monitoring, and testing are part of the stack',
  'Pilot onboarding and live walkthroughs can be opened immediately',
]

const marzUtility = [
  'Ecosystem access for engaged customers and partners',
  'Service rewards and loyalty-style retention mechanics',
  'Discount pathways and premium support incentives',
  'Governance-lite participation around product direction',
  'Utility-first positioning over speculation-first messaging',
]

const roadmap = [
  'Sharpen homepage and conversion path for investor and customer clarity',
  'Expand founder demos, pilot onboarding, and feedback loops',
  'Package repeatable infrastructure offers for a narrower ideal customer profile',
  'Strengthen analytics, investor materials, and partner integrations',
]

const tractionSnapshot = [
  'Public product catalog, investor brief, diligence room, and founder walkthrough path are all live',
  'Founder CRM now handles live lead capture, replies, reminders, approvals, and calendar coordination',
  'Outbound investor workflow is operating with verified DNS mail auth and a live sendmail transport fallback',
  'The platform already combines recurring infrastructure revenue with higher-touch launch and migration services',
]

const caseStudySignals = [
  {
    title: 'Founder-led investor workflow',
    body: 'The site now turns investor interest into a tracked pipeline with booking, diligence access, and follow-up automation instead of a dead-end contact form.',
  },
  {
    title: 'Service-led infrastructure buyers',
    body: 'The clearest early customer fit remains founders, agencies, and modern service businesses that want domains, trust, and launch infrastructure in one flow.',
  },
  {
    title: 'Identity as a conversion wedge',
    body: 'Sovereign identity is framed as a bridge from traditional web infrastructure into wallet-ready ownership, not as a detached token pitch.',
  },
]

const sharperMetrics = [
  'Recurring infrastructure revenue: domains, SSL, hosting, and premium account services',
  'Retention logic: MARZ reinforces access, rewards, and loyalty rather than replacing the core business model',
  'Sales motion: founder walkthrough, diligence room, reminder cadence, and approval-based next steps are now operational',
  'Next proof targets: 2 to 5 pilots, 2 testimonials or LOIs, and weekly traction reporting for investors',
]

const whyNowNarrative = [
  'Incumbent registrars remain fragmented and operationally stale',
  'AI-native workflows reduce launch friction and support cost at the exact moment small teams need leverage',
  'Wallet-ready identity is maturing into a practical ownership layer rather than a speculative novelty',
  'This creates a timing window for a cleaner infrastructure business with a defensible Web3 retention moat',
]

export default function InvestorsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-16">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Investor Brief • April 2026
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              The AI-native registrar and infrastructure platform for modern businesses.
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-base text-zinc-300 sm:text-lg">
              BuildWithAI.digital is designed to simplify how businesses launch and manage their digital presence by combining domains, security, hosting, operational workflows, and wallet-ready identity in one product system.
            </p>
            <p className="mt-3 max-w-3xl text-pretty text-sm text-zinc-400">
              MARZ is positioned as the ecosystem utility and retention layer — practical, customer-facing, and designed to reinforce usage rather than distract from the core SaaS business.
            </p>
            <p className="mt-3 max-w-3xl text-pretty text-sm font-semibold text-teal-300">
              Investor thesis: Build With AI is building a recurring-revenue infrastructure business first, with MARZ strengthening retention, access, and ecosystem depth rather than functioning as a speculation-first token wrapper.
            </p>

            <InvestorActions />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-teal-400">Core thesis</div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              The winning wedge is not crypto theater. It is a stronger infrastructure business with clearer workflows, faster setup, better trust, and a wallet-native moat layered on top.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {platformPillars.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <div className="text-xs uppercase tracking-widest text-zinc-500">{item.title}</div>
              </CardHeader>
              <CardContent className="pt-1 text-sm text-zinc-300">{item.description}</CardContent>
            </Card>
          ))}
        </div>
        <FounderMetricsPanel />
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="text-xs uppercase tracking-widest text-zinc-500">Public traction snapshot</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Stronger proof for early investor conversations.</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5 text-sm text-zinc-300">
            <div className="mb-3 text-[11px] uppercase tracking-widest text-teal-400">Traction proof</div>
            <ul className="space-y-2">
              {tractionSnapshot.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5 text-sm text-zinc-300">
            <div className="mb-3 text-[11px] uppercase tracking-widest text-teal-400">Sharpened metrics</div>
            <ul className="space-y-2">
              {sharperMetrics.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5 text-sm text-zinc-300">
            <div className="mb-3 text-[11px] uppercase tracking-widest text-teal-400">Case-study signals</div>
            <div className="space-y-3">
              {caseStudySignals.map((item) => (
                <div key={item.title}>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="mt-1">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5 text-sm text-zinc-300">
            <div className="mb-3 text-[11px] uppercase tracking-widest text-teal-400">Why now</div>
            <ul className="space-y-2">
              {whyNowNarrative.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Business model</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Built around recurring revenue.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            <ul className="space-y-2">
              {businessModel.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Readiness snapshot</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Grounded in live capability.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            <ul className="space-y-2">
              {readiness.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Founder profile</div>
            <div className="mt-1 text-base font-medium text-zinc-100">Execution-first and design-aware.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            <p>
              The operating posture is founder-led, fast-shipping, and cross-functional across product, engineering, design, and go-to-market.
            </p>
            <Link href="/about" className="mt-4 inline-block font-bold text-teal-400 hover:text-teal-300">
              Read the mission →
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="text-xs uppercase tracking-widest text-zinc-500">MARZ utility</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Kept practical and investor-safe.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {marzUtility.map((item) => (
            <div key={item} className="rounded-2xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Roadmap snapshot</div>
            <div className="mt-1 text-base font-medium text-zinc-100">What happens next.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            <ul className="space-y-2">
              {roadmap.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Live demo path</div>
            <div className="mt-1 text-base font-medium text-zinc-100">A simple way to experience the product.</div>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-zinc-300">
            <p className="leading-relaxed">
              For investor calls, the recommended walkthrough is: homepage overview, domain and product catalog, identity flow, then dashboard and infrastructure views. The goal is to show a credible platform, not just a concept.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white transition hover:border-teal-500/50">Homepage</Link>
              <Link href="/identity" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white transition hover:border-teal-500/50">Identity flow</Link>
              <Link href="/dashboard" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white transition hover:border-teal-500/50">Dashboard</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
