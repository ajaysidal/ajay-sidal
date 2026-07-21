import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import dynamic from 'next/dynamic';

const SpatialCanvas = dynamic(() => import('@/components/SpatialCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[1.5rem]" />
});

const skills = [
  "React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", 
  "Three.js", "React Three Fiber", "Web3", "AI Automation", "Azure", "GitHub", "UI/UX"
];

const highlights = [
  "12+ years across banking, healthcare, logistics, automotive, telecom, and public-sector operations",
  "Founder / Creative Technologist since 2025",
  "Web development, system infrastructure, DNS, Nginx, Certbot, and uptime-focused delivery",
  "AI-driven workflows, marketing automation, and investor-facing storytelling",
];

const experience = [
  {
    role: "Founder / Creative Technologist", org: "Self-Employed", period: "Mar 2025 � Present",
    points: ["Engineered AI-driven workflows and marketing automations.", "Built and maintained high-performance web infrastructure.", "Troubleshot Nginx, Certbot, and DNS configurations for uptime and security."],
  },
  {
    role: "Investment Operations Administrator", org: "ANZ", period: "Jun 2024 � Mar 2025",
    points: ["Processed and validated KiwiSaver and investment withdrawal payments.", "Ensured compliance, SLA performance, and peer review quality control."],
  },
  {
    role: "Coordinator / Technology Operations Team Lead", org: "Te Whatu Ora", period: "Jun 2022 � Nov 2023",
    points: ["Provided administrative, logistics, and documentation support.", "Managed IT hardware and software for the technology and operations team."],
  },
  {
    role: "Various Leadership Roles", org: "Westpac Banking Corporation", period: "May 2001 � Dec 2013",
    points: ["Progressed into branch management roles overseeing operations, lending, and merchant IT support.", "Led the Internet Payments Project in 2008 and earned the 2009 Retail Recognition Award."],
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <BackToTop />
      
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-40 -z-10" />
          <div className="w-full px-6 md:px-12 lg:px-24 py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-5xl">
                <p className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200 font-mono">
                  Futuristic Portfolio 2026
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                  I build premium digital experiences with{" "}
                  <span className="text-cyan-300">depth</span>,{" "}
                  <span className="text-indigo-300">motion</span>, and{" "}
                  <span className="text-fuchsia-300">technical credibility</span>.
                </h1>
                <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">
                  Ajay Sidal is a New Zealand-based creative technologist and operations leader with 12+ years of cross-industry experience, now focused on modern web development, AI automation, and production-ready digital delivery.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="#experience" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#050816] hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                    View experience
                  </Link>
                  <Link href="#contact" className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md hover:border-cyan-300/40 hover:bg-cyan-300/10">
                    Start a project
                  </Link>
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-md hover:border-cyan-300/20 transition-colors">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-indigo-400/10 to-fuchsia-400/20 blur-3xl" />
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-mono">Status</p>
                      <p className="mt-1 text-sm text-cyan-200">Available for premium project work</p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(8,15,35,1))]">
                    <div className="absolute inset-0 grid-overlay opacity-30" />
                    <div className="absolute inset-x-8 top-10 rounded-3xl border border-cyan-300/20 bg-white/5 p-6 backdrop-blur-md">
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200 font-mono">3D Signal</p>
                      <p className="mt-3 text-2xl font-bold">Spatial interface</p>
                      <p className="mt-3 text-sm text-slate-300 leading-relaxed">Glass layers, glow accents, and motion depth designed for a modern portfolio presence.</p>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-3">
                      {skills.slice(0, 6).map((skill) => (
                        <div key={skill} className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-center text-xs text-slate-200 backdrop-blur-md font-mono">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT & STACK SECTION */}
        <section id="about" className="scroll-mt-24 py-24 md:py-32">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md lg:col-span-2 hover:border-white/20 transition-colors">
                <h2 className="text-3xl font-bold mb-6">About</h2>
                <p className="text-lg leading-8 text-slate-300">
                  I design and build polished web experiences that combine strong UX, technical reliability, and a premium visual language. My background blends operations leadership with hands-on delivery across infrastructure, automation, and modern frontend systems.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md hover:border-white/20 transition-colors">
                <h2 className="text-3xl font-bold mb-6">Core stack</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 font-mono hover:border-cyan-300/30 hover:text-cyan-200 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24 py-24 md:py-32">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="mb-16 max-w-4xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80 font-mono mb-3">Experience</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Career progression with <span className="text-cyan-300">technical depth</span>
              </h2>
            </div>
            <div className="grid gap-6">
              {experience.map((item) => (
                <article key={item.role + item.org} className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md hover:border-cyan-300/30 hover:bg-white/[0.07] transition-all duration-300">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-cyan-200 transition-colors">{item.role}</h3>
                      <p className="text-base text-cyan-300/80 font-medium mt-1">{item.org}</p>
                    </div>
                    <p className="text-sm text-slate-400 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit">{item.period}</p>
                  </div>
                  <ul className="space-y-3 text-slate-300">
                    {item.points.map((point, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        <span className="text-lg leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION & CONTACT SECTION */}
        <section id="education" className="scroll-mt-24 py-24 md:py-32">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="grid gap-8 lg:grid-cols-2">
              <div id="education-card" className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md hover:border-white/20 transition-colors">
                <h2 className="text-3xl font-bold mb-8">Education</h2>
                <div className="space-y-6">
                  <div className="border-l-2 border-cyan-300/30 pl-6">
                    <p className="text-white font-semibold text-lg">Bachelor�s Degree in Applied Management</p>
                    <p className="text-slate-400 mt-1">Otago Polytechnic Te Pukenga � 2023</p>
                  </div>
                  <div className="border-l-2 border-indigo-300/30 pl-6">
                    <p className="text-white font-semibold text-lg">Master Certificate in Business Management</p>
                    <p className="text-slate-400 mt-1">Masterclass Management � 2020</p>
                  </div>
                  <div className="border-l-2 border-fuchsia-300/30 pl-6">
                    <p className="text-white font-semibold text-lg">Business Management Units</p>
                    <p className="text-slate-400 mt-1">Cornell Institute of Business & Technology � 2013</p>
                  </div>
                </div>
              </div>

              <div id="contact" className="scroll-mt-24 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-indigo-400/5 p-8 backdrop-blur-md relative overflow-hidden group hover:border-cyan-300/40 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -z-10 group-hover:bg-cyan-400/20 transition-colors" />
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/80 font-mono mb-3">Contact</p>
                <h2 className="text-4xl font-bold mb-6">Let&apos;s build something premium.</h2>
                <p className="text-lg text-slate-200 leading-relaxed mb-8">
                  Available for project work, portfolio builds, frontend systems, and modern Web3 / AI-powered digital experiences.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:asidal@outlook.com" className="rounded-full bg-white px-8 py-3 font-semibold text-[#050816] hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                    Email me
                  </a>
                  <a href="tel:+64223260583" className="rounded-full border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-md hover:border-cyan-300/40 hover:bg-cyan-300/10">
                    Call me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}