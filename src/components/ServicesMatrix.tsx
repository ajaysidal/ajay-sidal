'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: "High-Performance Web Development",
    description: "Building cutting-edge, 3D interactive websites and high-performance web infrastructure. From Next.js architectures to Nginx/DNS configurations, I ensure maximum uptime, security, and visual impact.",
    icon: "??",
    tags: ["Next.js", "React Three Fiber", "Nginx", "DNS"]
  },
  {
    title: "AI-Driven Business Operations",
    description: "Engineering advanced AI workflows and marketing automations to streamline digital operations. I collaborate with AI agents to build living documentation and optimize content delivery for maximum organizational efficiency.",
    icon: "??",
    tags: ["AI Agents", "Workflow Automation", "Marketing Ops"]
  },
  {
    title: "Technical Architecture & Ops",
    description: "Over 12 years of cross-industry experience in system infrastructure, tech operations, and compliance. I troubleshoot complex technical architectures and lead high-performing teams to maximize efficiency.",
    icon: "??",
    tags: ["System Infrastructure", "Tech Ops", "Compliance"]
  }
];

export default function ServicesMatrix() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
      >
        How I Can Help Your Business
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
            <p className="text-gray-300 leading-relaxed mb-6 flex-grow">{service.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}