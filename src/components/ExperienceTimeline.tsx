'use client';

import { motion } from 'framer-motion';

const experiences = [
  {
    title: "Founder & Creative Technologist",
    company: "Self-Employed (Opsvantage Digital)",
    period: "March 2025 � Present",
    description: "Engineering advanced AI-driven workflows, marketing automations, and high-performance web infrastructure (Nginx, DNS, Web3).",
    highlight: "AI & Web3"
  },
  {
    title: "Investment Ops Admin / Tech & Ops Team Lead",
    company: "ANZ / Te Whatu Ora / Ventia",
    period: "2022 � March 2025",
    description: "Managed complex KiwiSaver withdrawals, led IT hardware/software for tech ops teams, and oversaw Telco project compliance.",
    highlight: "Corporate Ops"
  },
  {
    title: "Operations & Logistics Manager",
    company: "IT Wise / Avant Ee / Positive Property Service",
    period: "2014 � 2019",
    description: "Directed e-commerce via Shopify, managed end-to-end logistics, GST, and full-scale accounts using Xero and CRM workflows.",
    highlight: "E-Commerce"
  },
  {
    title: "Various Roles -> Branch Management",
    company: "Westpac Banking Corporation",
    period: "May 2001 � Dec 2013",
    description: "12-year trajectory. Spearheaded the landmark Internet Payments Project (2008) pioneering e-merchant processing in Fiji. Won the 2009 Retail Recognition Award.",
    highlight: "The Foundation"
  }
];

export default function ExperienceTimeline() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
      >
        The 12-Year Journey
      </motion.h2>

      <div className="relative border-l-2 border-gray-700 pl-8 space-y-16">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            {/* The glowing dot on the timeline */}
            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
            
            {/* The Glassmorphic Card */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
              <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">{exp.period}</span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-2">{exp.title}</h3>
              <p className="text-gray-400 font-medium mb-3">{exp.company}</p>
              <p className="text-gray-300 leading-relaxed">{exp.description}</p>
              
              {/* Tech/Role Badge */}
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                {exp.highlight}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}