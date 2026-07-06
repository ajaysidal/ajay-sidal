"use client";

import React, { useState } from 'react';

export default function ComprehensiveCommandPortfolio() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: '', email: '', message: '' });
  };

  // 12 Years, 5 Industries Metrics mapping directly from your foundational records
  const operationalMetrics = [
    { value: "12+", label: "Years Depth", detail: "Cross-Industry Progression", glow: "from-cyan-400 to-blue-500" },
    { value: "5", label: "Core Industries", detail: "Banking, Health, Auto, Tech, Telco", glow: "from-purple-500 to-indigo-500" },
    { value: "2009", label: "Retail Award", detail: "Westpac Excellence Recognition", glow: "from-amber-400 to-orange-500" },
    { value: "2023", label: "Applied Mgmt", detail: "Bachelor's Degree Concluded", glow: "from-emerald-400 to-teal-500" }
  ];

  const coreStrengths = [
    { title: "Web Development", desc: "High-performance web infrastructure, from Nginx and DNS configuration to frontend build systems and deployment." },
    { title: "AI Automation", desc: "Engineered advanced AI-driven workflows and marketing automations that streamline digital operations." },
    { title: "Operations Leadership", desc: "Proven leadership across banking, healthcare, logistics, and automotive — translating complexity into execution." },
    { title: "Infrastructure & Uptime", desc: "Proactive troubleshooting of Nginx, Certbot, and DNS configurations to maintain maximum uptime and security." },
    { title: "Systems Thinking", desc: "Building elegant, connected systems from the ground up — operations, technology, and brand as a unified whole." },
    { title: "Brand Storytelling", desc: "Aligning visual brand messaging and technical storytelling across investor-facing materials and digital channels." },
    { title: "Technical Documentation", desc: "Collaborating with AI agents to build living documentation of technical breakthroughs and process architecture." },
    { title: "Workflow Optimization", desc: "Optimising business workflows for speed, compliance, and scalability — from payroll systems to SLA processing." }
  ];

  const fullExperienceLedger = [
    {
      role: "FOUNDER & CREATIVE TECHNOLOGIST",
      company: "Self-Employed",
      period: "March 2025 — CURRENT",
      bullets: [
        "Engineered advanced AI-driven workflows and marketing automations to streamline digital operations, optimize content delivery, and maximize organizational efficiency.",
        "Developed, launched, and continuously maintained high-performance web infrastructure, proactively troubleshooting Nginx, Certbot, and DNS configurations to guarantee maximum uptime and security.",
        "Collaborated with AI agents to build living documentation of technical breakthroughs, while simultaneously aligning visual brand messaging and technical storytelling across investor-facing materials."
      ],
      tag: "TECH"
    },
    {
      role: "INVESTMENT OPERATIONS ADMINISTRATOR",
      company: "ANZ",
      period: "June 2024 — March 2025",
      bullets: [
        "Processing and validating KiwiSaver and Investment withdrawal payments.",
        "Ensuring compliance with regulatory standards.",
        "Processing payments promptly, meeting SLAs.",
        "Conducting daily payment peer reviews before releasing payments.",
        "Managing complex cases and collaborating with internal teams for resolution."
      ],
      tag: "COMPLIANCE"
    },
    {
      role: "SUBCONTRACTOR COMPLIANCE COORDINATOR",
      company: "VENTIA",
      period: "NOVEMBER 2023 — FEBRUARY 2024",
      bullets: [
        "Manage onboarding for subcontractors and employees, ensuring Ventia Telco project compliance.",
        "Maintain SharePoint documentation and ID card submissions.",
        "Overseeing the Access Card process for Ventia Telco, liaising with Chorus and Spark.",
        "Support the SCC team with administrative tasks and ensure timely project delivery."
      ],
      tag: "COMPLIANCE"
    },
    {
      role: "COORDINATOR TECHNOLOGY & OPERATIONS TEAM LEAD",
      company: "TE WHATU ORA",
      period: "JUNE 2022 — NOVEMBER 2023",
      bullets: [
        "Provide efficient administrative support to the business and teams, including workforce planning, documentation, correspondence, record keeping, and logistics management.",
        "IT hardware and software management for the technology and operations team.",
        "Coordinate and manage meeting arrangements, including agendas, minutes, travel bookings, and catering."
      ],
      tag: "OPERATIONS"
    },
    {
      role: "COMMUNICATIONS COORDINATOR",
      company: "BUPA NZ",
      period: "MARCH 2022 — JUNE 2022",
      bullets: [
        "Manage incoming email messages and family questions empathetically, providing information and reassurance.",
        "Proactively initiate connections with families to update them on their family/whanau member's condition and activities, excluding clinical updates.",
        "Assist residents in utilising technology such as Skype or similar platforms to maintain connections with their family/whanau."
      ],
      tag: "OPERATIONS"
    },
    {
      role: "COVID VACCINATION ADVISOR",
      company: "WHAKARONGORAU AOTEAROA",
      period: "JUNE 2021 — DECEMBER 2021",
      bullets: [
        "Answered inbound calls and made outbound calls to assist the New Zealand population in registering for the COVID-19 Vaccine, managing vaccine bookings, and providing non-clinical information related to the vaccine.",
        "Accurately record confidential information according to established processes and procedures.",
        "Contribute to team culture by actively participating and demonstrating the values and behaviours of Whakarongorau Aotearoa."
      ],
      tag: "OPERATIONS"
    },
    {
      role: "BOOKING COORDINATOR",
      company: "ARMSTRONG MOTOR GROUP",
      period: "JANUARY 2020 — FEBRUARY 2021",
      bullets: [
        "Managed multiple automotive brands for the Lower Hutt dealership, including Porsche, Volvo, Land Rover, Jaguar, and Audi for Armstrong Prestige, Peugeot, Citroen, Subaru, and Nissan.",
        "Ensure high customer service support to enhance customer satisfaction, including booking appointments and completing follow-up phone calls with customers.",
        "Analyse and report service data results and manage the daily profit margin."
      ],
      tag: "OPERATIONS"
    },
    {
      role: "OPERATIONS & ADMINISTRATION MANAGER",
      company: "AVANTEE LIMITED",
      period: "NOVEMBER 2017 — FEBRUARY 2019",
      bullets: [
        "Maintaining - Maintain the company website via the Shopify platform.",
        "Manage product sourcing and handling, marketing and advertising, and accounts receivable and payable using Xero."
      ],
      tag: "MANAGEMENT"
    },
    {
      role: "LOGISTICS MANAGER",
      company: "IT WISE",
      period: "MARCH 2017 — OCTOBER 2017",
      bullets: [
        "Manage project logistics, GST management, procurement, job costing using CRM Fergus, and staff supervision assistance."
      ],
      tag: "MANAGEMENT"
    },
    {
      role: "OPERATIONS & ADMINISTRATIONS MANAGER",
      company: "THE POSITIVE PROPERTY SERVICE",
      period: "JUNE 2016 — MARCH 2017",
      bullets: [
        "Manage payroll, data entry, end-of-month reconciliation and reporting, accounts receivable and payable using Xero, job costing using CRM - Workflow Max, staff supervision, customer service, and maintenance of job costs."
      ],
      tag: "MANAGEMENT"
    },
    {
      role: "TRANS TASMAN COLLECTOR",
      company: "DUN & BRADSTREET",
      period: "JAN 2016 — APRIL 2016",
      bullets: [
        "Collect overdue accounts for New Zealand and Australian-based clients with exceptional customer service skills and knowledge of Australian and New Zealand legislation concerning privacy and consumer laws."
      ],
      tag: "COMPLIANCE"
    },
    {
      role: "OPERATIONS MANAGER",
      company: "ITWISE LTD",
      period: "JANUARY 2014 — JANUARY 2016",
      bullets: [
        "Maintaining - Maintain the company website via the Shopify platform.",
        "Manage product sourcing and handling, marketing and advertising, and accounts receivable and payable using Xero."
      ],
      tag: "MANAGEMENT"
    },
    {
      role: "VARIOUS ROLES INCL. BRANCH MANAGEMENT",
      company: "WESTPAC BANKING CORPORATION",
      period: "MAY 2001 — DECEMBER 2013",
      bullets: [
        "Advanced through a 12-year career at Westpac Banking Corporation, progressing into branch management roles overseeing call center operations, lending portfolios, and merchant IT support.",
        "Spearheaded the successful turnaround of a low-performing branch, resolving high volumes of customer complaints and restoring the location to corporate standards of excellence.",
        "Initiated and led Westpac's landmark Internet Payments Project (2008), pioneering e-merchant credit card processing infrastructure in Fiji and earned the 2009 Retail Recognition Award for exceptional leadership."
      ],
      tag: "TECH"
    }
  ];

  const highlights = [
    { title: "Full-Scale Web Maintenance", type: "Web Infrastructure", desc: "End-to-end web infrastructure management — Nginx, Certbot, DNS configuration — with a focus on maximum uptime and security." },
    { title: "AI Workflow Automation", type: "AI Systems", desc: "Engineered marketing automations and AI-driven operational workflows that streamline content delivery and maximize efficiency." },
    { title: "Cross-Industry Operations", type: "5+ Industries", desc: "Leadership and delivery across banking, healthcare, logistics, automotive, and technology — compounding institutional knowledge." },
    { title: "KiwiSaver & Investment Compliance", type: "ANZ", desc: "Processing and validating KiwiSaver and investment withdrawal payments, conducting peer reviews, and maintaining strict SLA compliance." },
    { title: "E-Commerce Pioneer", type: "Westpac · 2008", desc: "Led Westpac's Internet Payments Project, establishing e-merchant credit card processing infrastructure in Fiji — a first for the region." },
    { title: "Retail Recognition Award", type: "2009 Award", desc: "Awarded Westpac's 2009 Retail Recognition Award for exceptional leadership, branch management, and customer excellence." },
    { title: "Compliance Coordination", type: "Ventia Telco", desc: "Managed subcontractor onboarding, SharePoint documentation, and the Access Card process across the Ventia Telco project." },
    { title: "Branch Turnaround Leadership", type: "Westpac", desc: "Spearheaded the turnaround of a low-performing branch, resolving high complaint volumes and restoring it to corporate standards of excellence." }
  ];

  const skillsStack = [
    { cat: "Product / Design", items: ["Shopify", "Funnel Design", "Brand Storytelling", "UX", "Web Development"] },
    { cat: "Web Infrastructure", items: ["Nginx", "Certbot", "DNS Management", "Server Management", "Uptime Optimisation", "SSL Deployments"] },
    { cat: "AI / Automation", items: ["AI Workflow Engineering", "Marketing Automation", "Living Documentation"] },
    { cat: "Operations / Compliance", items: ["KiwiSaver Processing", "SLA Management", "SharePoint", "Xero", "CRM Fergus", "Workflow Max", "Payroll Systems", "Procurement", "Regulatory Compliance"] },
    { cat: "Communication / Leadership", items: ["Team Lead", "Stakeholder Management", "Technical Storytelling", "Investor Communications"] }
  ];

  const cognitiveActivities = [
    { icon: "🎵", label: "Music", desc: "Sound as a thinking companion — music fuels creative flow and mental clarity." },
    { icon: "🎾", label: "Tennis", desc: "Strategy, precision, and adaptability on the court. Every rally is a decision tree." },
    { icon: "🧘", label: "Yoga", desc: "Stillness as a system reset — bringing calm and focus to complex problem-solving." },
    { icon: "📚", label: "Reading", desc: "Deep reading across strategy, technology, and human behaviour. Knowledge compounds." },
    { icon: "🌌", label: "Sci-Fi Mysteries", desc: "Drawn to narratives that explore technology, the unknown, and the edges of possibility." },
    { icon: "🎨", label: "Website Design", desc: "Building digital systems that convert — the intersection of craft, performance, and brand." }
  ];

  const filteredExperience = activeTab === 'ALL'
    ? fullExperienceLedger
    : fullExperienceLedger.filter(item => item.tag === activeTab);

  return (
    <div className="min-h-screen bg-[#04060a] text-neutral-100 font-sans selection:bg-cyan-400 selection:text-black relative overflow-x-hidden antialiased [perspective:1000px]">
      
      {/* 3D LIGHT SOURCE GRADIENT ORBS */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute top-[35%] right-[-15%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* MATRIX CYBERNETIC GRID PATTERN BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* FIXED GLASSMORPHISM HEADER */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#04060a]/70 border-b border-neutral-900 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] rotate-6 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-neutral-950 font-black text-xs font-mono">AS</span>
            </div>
            <span className="text-sm font-black tracking-[0.2em] uppercase bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              AJAY SIDAL
            </span>
          </div>
          <div className="hidden lg:flex gap-8 text-[10px] font-mono tracking-widest text-neutral-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">// OVERVIEW</a>
            <a href="#strengths" className="hover:text-cyan-400 transition-colors">// STRENGTHS</a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">// TIMELINE</a>
            <a href="#highlights" className="hover:text-cyan-400 transition-colors">// HIGHLIGHTS</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">// INFRASTRUCTURE</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">// CONNECT</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:asidal@outlook.com" className="px-4 py-2 border border-cyan-500/30 rounded text-[11px] font-mono text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
              RESUME ↗
            </a>
          </div>
        </div>
      </nav>

      {/* HERO LAYER WITH ANGLE VIEWDEPTH */}
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase tracking-[0.15em] text-cyan-400 font-bold mb-8 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-ping" />
          Auckland, New Zealand · Creative Technologist · Operations Leader
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
          Building secure, polished <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            digital systems & brand.
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mb-10 font-light leading-relaxed">
          Dynamic Technology & Operations Leader with over 12 years of cross-industry experience spanning banking, healthcare, logistics, and automotive sectors. Expert in web development, system infrastructure maintenance, and orchestrating full-scale operations and marketing automation via modern AI integration.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#contact" className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-neutral-950 font-bold tracking-wider text-xs uppercase rounded hover:opacity-95 transition-all duration-300 shadow-xl shadow-cyan-950/20 transform hover:-translate-y-0.5">
            Initiate Contact Console
          </a>
          <a href="#experience" className="px-7 py-3.5 bg-neutral-900/60 border border-neutral-800 text-neutral-300 font-bold tracking-wider text-xs uppercase rounded hover:bg-neutral-800 transition-all duration-300 transform hover:-translate-y-0.5">
            Audit Complete History ↓
          </a>
        </div>
      </header>

      {/* LEDGER SNAPSHOT STATS */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalMetrics.map((m, i) => (
            <div key={i} className="p-6 bg-neutral-900/20 border border-neutral-900/80 rounded-lg relative overflow-hidden shadow-xl">
              <div className={`absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b ${m.glow}`} />
              <div className="text-3xl font-black text-neutral-100 tracking-tight mb-0.5">{m.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">{m.label}</div>
              <div className="text-xs text-neutral-500 font-light">{m.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE IDENTITY EXECUTIVE DESCRIPTION */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="grid lg:grid-cols-3 gap-12">
          <div>
            <div className="text-xs font-mono tracking-widest text-cyan-400 mb-2">// SYSTEM INTERSECTION</div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-100">Operations, Technology & Brand — as one system.</h2>
          </div>
          <div className="lg:col-span-2 space-y-6 text-neutral-400 font-light text-base leading-relaxed">
            <p>
              Ajay Sidal is a Creative Technologist and Operations Leader with over 12 years of cross-industry experience spanning banking, healthcare, logistics, and automotive sectors — now channelling that depth into modern AI-driven digital systems and web infrastructure .
            </p>
            <p>
              Beginning at Westpac Banking Corporation — where he led branch operations, managed lending portfolios, and pioneered e-merchant credit card processing in Fiji — Ajay built a reputation as someone who turns operational complexity into clean, scalable systems .
            </p>
            <p>
              From healthcare coordination at Te Whatu Ora and compliance operations at ANZ, to leading logistics at IT Wise and managing prestige automotive brands at Armstrong Motor Group, he brings the rare combination of technical fluency and leadership instinct that most operators never develop .
            </p>
            <p>
              Today, as a self-employed Founder & Creative Technologist, Ajay engineers AI-driven workflows, maintains high-performance web infrastructure, and builds digital identities that convert — for himself and the people he works with .
            </p>
          </div>
        </div>
      </section>

      {/* CAPABILITY GRID MATRIX */}
      <section id="strengths" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest text-indigo-400 mb-2">// CAPABILITY MATRIX</div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-100">Signature Strengths</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreStrengths.map((str, i) => (
            <div key={i} className="p-6 bg-neutral-900/30 border border-neutral-900 rounded-lg shadow-md hover:border-cyan-500/20 transition-all group">
              <h3 className="text-sm font-bold text-neutral-200 mb-3 group-hover:text-cyan-400 transition-colors">{str.title}</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">{str.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE LEDGER SYSTEM (WITH STATE CATEGORY FILTER) */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-emerald-400 mb-2">// HISTORICAL ROUTING</div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-100">12 Years of Compounding Impact.</h2>
          </div>
          <div className="flex flex-wrap gap-1 bg-neutral-950 p-1 border border-neutral-900 rounded text-[10px] font-mono">
            {['ALL', 'TECH', 'COMPLIANCE', 'OPERATIONS', 'MANAGEMENT'].map((t) => (
              <button 
                key={t} onClick={() => { setActiveTab(t); setExpandedIndex(0); }}
                className={`px-3 py-1.5 rounded uppercase font-bold transition-all ${activeTab === t ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-400 hover:text-neutral-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl divide-y divide-neutral-900/60 overflow-hidden shadow-2xl">
          {filteredExperience.map((exp, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={i} className={`transition-colors duration-300 ${isExpanded ? 'bg-neutral-900/20' : 'hover:bg-neutral-900/5'}`}>
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-left gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-neutral-200 flex flex-wrap items-center gap-2">
                      {exp.role}
                      <span className="text-xs font-mono font-medium text-cyan-400">@ {exp.company}</span>
                    </h3>
                    <div className="text-xs font-mono text-neutral-500">{exp.period}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-widest">
                      {exp.tag}
                    </span>
                    <span className={`text-xs text-cyan-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[800px] p-6 border-t border-neutral-900/40 bg-[#06080d]/40' : 'max-h-0'}`}>
                  <ul className="space-y-3 text-xs text-neutral-400 font-light leading-relaxed">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-cyan-500 font-mono mt-0.5">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* METRICS & HIGHLIGHTS TILES */}
      <section id="highlights" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest text-cyan-400 mb-2">// DATA PARSING</div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-100">Selected Highlights</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <div key={i} className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-lg flex flex-col justify-between hover:border-neutral-800 transition-all shadow-md">
              <div>
                <span className="text-[9px] font-mono tracking-widest bg-neutral-950 border border-neutral-900 text-cyan-400 px-2 py-0.5 rounded uppercase">
                  {h.type}
                </span>
                <h4 className="text-sm font-bold text-neutral-200 mt-4 mb-2">{h.title}</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{h.desc}</p>
              </div>
              <div className="text-[9px] font-mono text-neutral-600 tracking-widest mt-6 text-right">
                NODE_H{i+1} // ACCESSIBLE
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ECOSYSTEM PACKAGES STRUCTURE */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest text-purple-400 mb-2">// TECHNICAL SPECS</div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-100">The Full Technical Toolkit</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {skillsStack.map((stack, i) => (
            <div key={i} className="p-5 bg-neutral-950/60 border border-neutral-900 rounded-lg shadow-sm">
              <h4 className="text-[11px] font-mono font-bold tracking-wider text-neutral-300 uppercase border-b border-neutral-900 pb-3 mb-4">// {stack.cat}</h4>
              <div className="flex flex-col gap-2">
                {stack.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-400 font-light">
                    <div className="w-1 h-1 bg-cyan-400/80 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATIONAL LEDGER PROFILE */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest text-amber-400 mb-2">// FOUNDATIONAL VERIFICATION</div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-100">Education Built on Solid Foundations</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-neutral-900/20 border border-neutral-900 rounded-lg">
            <div className="text-xs font-mono text-cyan-400 mb-2">2023 // COMPLETED</div>
            <h4 className="text-sm font-bold text-neutral-200 mb-1">Bachelor's Degree in Applied Management</h4>
            <p className="text-xs text-neutral-500">Otago Polytechnic | Te Pūkenga</p>
          </div>
          <div className="p-6 bg-neutral-900/20 border border-neutral-900 rounded-lg">
            <div className="text-xs font-mono text-cyan-400 mb-2">2020 // COMPLETED</div>
            <h4 className="text-sm font-bold text-neutral-200 mb-1">Master Certificate in Business Management</h4>
            <p className="text-xs text-neutral-500">Masterclass Management — Skills & Leadership Course</p>
          </div>
          <div className="p-6 bg-neutral-900/20 border border-neutral-900 rounded-lg">
            <div className="text-xs font-mono text-cyan-400 mb-2">2013 // EARNED CREDITS</div>
            <h4 className="text-sm font-bold text-neutral-200 mb-1">Business Management Units</h4>
            <p className="text-xs text-neutral-500">Cornell Institute of Business & Technology</p>
          </div>
        </div>
      </section>

      {/* ACTIVITIES BLOCK */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-900/40 bg-[#060a12]/20 rounded-xl border border-neutral-900/40 my-12 shadow-inner">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono tracking-widest text-cyan-400 mb-2">// COGNITIVE BALANCE</div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-100">Beyond the Work</h2>
          <p className="text-neutral-400 text-sm font-light mt-2">Great work comes from well-rounded people. Here's what Ajay brings to life when the screen goes dark .</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitiveActivities.map((act, i) => (
            <div key={i} className="p-5 bg-neutral-950/60 border border-neutral-900 rounded-lg flex gap-4 items-start">
              <span className="text-xl p-2 bg-neutral-900 rounded border border-neutral-800">{act.icon}</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-1">{act.label}</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECURE GATEWAY HUB DISPATCH CONSOLE */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/40">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="text-xs font-mono tracking-widest text-cyan-400 mb-2">// TRANSMISSION HUB</div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-100">Let's Build Something Exceptional.</h2>
            </div>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Open to collaboration, advisory work, web projects, brand strategy, and AI automation consulting. Let's connect .
            </p>
            <div className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-lg space-y-3 font-mono text-xs text-neutral-400 shadow-inner">
              <div><span className="text-neutral-600">NET_ID   //</span> asidal@outlook.com</div>
              <div><span className="text-neutral-600">TELECOM  //</span> +64 22 326 0583</div>
              <div><span className="text-neutral-600">LOCATION //</span> Auckland, New Zealand</div>
            </div>
          </div>

          <div className="lg:col-span-3 p-8 bg-neutral-900/10 border border-neutral-900 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">Identification Code</label>
                  <input 
                    type="text" required value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="ENTER NAME"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">Return Address Matrix</label>
                  <input 
                    type="email" required value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="ENTER EMAIL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">Data Payload Stream</label>
                <textarea 
                  rows={4} required value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="COMPOSE MESSAGING PACKET..."
                />
              </div>
              <button type="submit" className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 text-xs font-bold font-mono tracking-widest uppercase rounded transition-colors shadow-lg">
                EXECUTE PACKET DISPATCH
              </button>

              {submitted && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono text-center rounded animate-pulse">
                  &gt;&gt; CONNECTION TERMINAL SECURED: TRANSMISSION CONCLUDED.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* BOTTOM CONTROL LAYER FOOTER */}
      <footer className="border-t border-neutral-900/60 bg-[#020305] text-[10px] font-mono text-neutral-500 py-12 tracking-wider">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 AJAY SIDAL. SYSTEMS INTERFACE RUNNING.</p>
          <p className="text-neutral-600">SYS_V14.2 // COMPILED SECURELY</p>
        </div>
      </footer>
    </div>
  );
}