'use client';

import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Let's Build Something Extraordinary
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
      >
        Whether you need a cutting-edge 3D website, AI-driven workflow automation, or complex technical operations troubleshooting, I'm ready to elevate your business.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-center gap-6"
      >
        <a 
          href="mailto:asidal@outlook.com" 
          className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
        >
          Email Me: asidal@outlook.com
        </a>
        <a 
          href="tel:+64223260583" 
          className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Call: +64 22 326 0583
        </a>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-8 text-gray-500 font-mono text-sm"
      >
        Based in Auckland, NZ � Available for Global Remote Projects
      </motion.p>
    </div>
  );
}