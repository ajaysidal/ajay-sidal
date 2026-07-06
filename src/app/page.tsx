import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Ajay Sidal | Creative Technologist & Web3 Builder",
  description:
    "A futuristic personal portfolio for Ajay Sidal, showcasing web development, AI automation, infrastructure, and operations leadership.",
};

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Framer Motion",
  "Three.js",
  "React Three Fiber",
  "Web3",
  "AI Automation",
  "Azure",
  "GitHub",
  "UI/UX",
];

const highlights = [
  "12+ years across banking, healthcare, logistics, automotive, telecom, and public-sector operations",
  "Founder / Creative Technologist since 2025",
  "Web development, system infrastructure, DNS, Nginx, Certbot, and uptime-focused delivery",
  "AI-driven workflows, marketing automation, and investor-facing storytelling",
];

const experience = [
  {
    role: "Founder / Creative Technologist",
    org: "Self-Employed",
    period: "Mar 2025 � Present",
    points: [
      "Engineered AI-driven workflows and marketing automations.",
      "Built and maintained high-performance web infrastructure.",
      "Troubleshot Nginx, Certbot, and DNS configurations for uptime and security.",
    ],
  },
  {
    role: "Investment Operations Administrator",
    org: "ANZ",
    period: "Jun 2024 � Mar 2025",
    points: [
      "Processed and validated KiwiSaver and investment withdrawal payments.",
      "Ensured compliance, SLA performance, and peer review quality control.",
    ],
  },
  {
    role: "Coordinator / Technology Operations Team Lead",
    org: "Te Whatu Ora",
    period: "Jun 2022 � Nov 2023",
    points: [
      "Provided administrative, logistics, and documentation support.",
      "Managed IT hardware and software for the technology and operations team.",
    ],
  },
  {
    role: "Various Leadership Roles",
    org: "Westpac Banking Corporation",
    period: "May 2001 � Dec 2013",
    points: [
      "Progressed into branch management roles overseeing operations, lending, and merchant IT support.",
      "Led the Internet Payments Project in 2008 and earned the 2009 Retail Recognition Award.",
    ],
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <BackToTop />
      <main className="min-h-screen bg-[#050816] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,178,0.18),_transparent_30%),radial-gradient(circle_at_right,_rgba(99,102,241,0.18),_transparent_28%),linear-gradient(to_bottom,_rgba(5,8,22,0.98),_rgba(5,8,22,1))]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-20 px-6 py-10 lg:px-10">
            
            {/* Hero Section */}
            <div className="grid items-center gap-12 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-3xl">
                <p className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Futuristic Portfolio 2026
                </p>
                <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                  I build premium digital experiences with{" "}
                  <span className="text-cyan-300">depth</span>,{" "}
                  <span className="text-indigo-300">motion</span>, and{" "}
                  <span className="text-fuchsia-300">technical credibility</span>.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Ajay Sidal is a New Zealand-based creative technologist and
                  operations leader with 12+ years of cross-industry experience,
                  now focused on modern web development, AI automation, and
                  production-ready digital delivery.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#experience"
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#050816] transition hover:scale-[1.02]"
                  >
                    View experience
                  </Link>
                  <Link
                    href="#contact"
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  >
                    Start a project
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-indigo-400/10 to-fuchsia-400/20 blur-2xl" />
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-1 text-sm text-cyan-200">
                        Available for premium project work
                      </p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(8,15,35,1))]">
                    <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />
                    <div className="absolute inset-x-8 top-10 rounded-3xl border border-cyan-300/20 bg-white/5 p-5 backdrop-blur-md">
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                        3D Signal
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        Spatial interface
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Glass layers, glow accents, and motion depth designed for
                        a modern portfolio presence.
                      </p>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-3">
                      {skills.slice(0, 6).map((skill) => (
                        <div
                          key={skill}
                          className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-center text-xs text-slate-200 backdrop-blur-md"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <section id="about" className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-2">
                <h2 className="text-2xl font-semibold">About</h2>
                <p className="mt-4 max-w-3xl text-slate-300">
                  I design and build polished web experiences that combine strong
                  UX, technical reliability, and a premium visual language.
                  My background blends operations leadership with hands-on
                  delivery across infrastructure, automation, and modern frontend
                  systems.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h2 className="text-2xl font-semibold">Core stack</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">
                    Experience
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Career progression with technical depth
                  </h2>
                </div>
              </div>

              <div className="grid gap-4">
                {experience.map((item) => (
                  <article
                    key={item.role + item.org}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{item.role}</h3>
                        <p className="text-sm text-cyan-200">{item.org}</p>
                      </div>
                      <p className="text-sm text-slate-400">{item.period}</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-slate-300">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h2 className="text-2xl font-semibold">Education</h2>
                <div className="mt-4 space-y-4 text-slate-300">
                  <p>
                    <span className="text-white">Bachelor�s Degree in Applied Management</span> � Otago Polytechnic Te Pukenga
                  </p>
                  <p>
                    <span className="text-white">Master Certificate in Business Management</span> � Masterclass Management
                  </p>
                  <p>
                    <span className="text-white">Business Management Units</span> � Cornell Institute of Business Technology
                  </p>
                </div>
              </div>

              <div id="contact" className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/80">
                  Contact
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Let&apos;s build something premium.
                </h2>
                <p className="mt-4 text-slate-200">
                  Available for project work, portfolio builds, frontend systems,
                  and modern Web3 / AI-powered digital experiences.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <a
                    href="mailto:asidal@outlook.com"
                    className="rounded-full bg-white px-5 py-3 font-medium text-[#050816]"
                  >
                    Email me
                  </a>
                  <a
                    href="tel:+64223260583"
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-medium text-white"
                  >
                    Call me
                  </a>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}