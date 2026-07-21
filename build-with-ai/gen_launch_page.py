#!/usr/bin/env python3
"""Generate enterprise-grade LaunchingSoonClient.tsx for buildwithai.digital"""
import os, sys

TARGET = "src/components/launching-soon/LaunchingSoonClient.tsx"
os.makedirs(os.path.dirname(TARGET), exist_ok=True)

content = '''\'use client\'
import { useState, useEffect } from \'react\'
import { Sparkles, Shield, Zap, Terminal, ArrowRight, CheckCircle } from \'lucide-react\'

const LAUNCH_DATE = new Date(\'2026-06-14T00:00:00Z\')

export default function LaunchingSoonClient() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState(\'\')
  const [status, setStatus] = useState<\'idle\' | \'loading\' | \'success\' | \'error\'>(\'idle\')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const timer = setInterval(() => {
      const diff = LAUNCH_DATE.getTime() - new Date().getTime()
      if (diff <= 0) { clearInterval(timer); return }
      setTimeLeft({
        days: Math.floor(diff / (1000*60*60*24)),
        hours: Math.floor((diff/(1000*60*60))%24),
        minutes: Math.floor((diff/(1000*60))%60),
        seconds: Math.floor((diff/1000)%60),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus(\'loading\')
    try {
      const res = await fetch(\'/api/launching-soon/subscribe\', {
        method: \'POST\', headers: { \'Content-Type\': \'application/json\' },
        body: JSON.stringify({ email, source: \'launching-soon-v2\' })
      })
      if (res.ok) { setStatus(\'success\'); setEmail(\'\') } else { setStatus(\'error\') }
    } catch { setStatus(\'error\') }
  }

  if (!mounted) return <div className="min-h-screen bg-[#0A0F1A]" />

  return (
    <main className="relative min-h-screen bg-[#0A0F1A] text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-purple-600/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <section className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Launching June 14, 2026
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Build With AI</span>
            <span className="block text-white/90 mt-2">Enterprise Dev OS</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            The sovereign, AI-native development environment for Web2/Web3 teams. Code faster. Deploy smarter. Own your infrastructure.
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-12">
            {Object.entries(timeLeft).map(([unit, val]) => (
              <div key={unit} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur-sm">
                <span className="block text-3xl md:text-4xl font-bold text-white">{String(val).padStart(2,\'0\')}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-500">{unit}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="enterprise@company.com" required
              className="flex-1 bg-neutral-900/80 border border-neutral-700 rounded-xl px-5 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
            <button type="submit" disabled={status===\'loading\'}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {status===\'loading\'?\'Processing...\':<><span>Get Early Access</span><ArrowRight className="w-4 h-4"/></>}
            </button>
          </form>
          {status===\'success\' && <p className="text-cyan-400 text-sm mt-3 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/>You\'re on the list.</p>}
          {status===\'error\' && <p className="text-red-400 text-sm mt-3">Something went wrong. Please try again.</p>}
        </section>
        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {[
            { icon: Terminal, title: \'AI-Native Dev OS\', desc: \'Context-aware coding, autonomous refactors, and real-time architecture guidance.\' },
            { icon: Shield, title: \'Web2/Web3 Hybrid\', desc: \'Deploy to any cloud or chain. Unified identity, payments, and infrastructure management.\' },
            { icon: Zap, title: \'Zero-Dependency Sovereignty\', desc: \'No vendor lock-in. Your code, your keys, your rules.\' }
          ].map((item, i) => (
            <div key={i} className="group p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl hover:border-cyan-500/50 transition-all">
              <item.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
              <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-neutral-500">buildwithai.dev • preview</span>
            </div>
            <div className="p-6 font-mono text-sm text-neutral-300 space-y-2">
              <p><span className="text-cyan-400">$</span> bwai init --sovereign</p>
              <p className="text-neutral-500">✓ Creating sovereign project structure...</p>
              <p><span className="text-cyan-400">$</span> bwai deploy --target=polygon</p>
              <p className="text-neutral-500">✓ Deploying to Polygon PoS (mainnet)...</p>
              <p className="text-green-400">✓ Live at https://app.buildwithai.digital</p>
              <p className="mt-4 text-neutral-500 italic">* Interface preview — full access June 14</p>
            </div>
          </div>
        </section>
        <section className="text-center py-8 border-t border-neutral-800/50">
          <p className="text-neutral-500 text-sm mb-4">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[\'Polygon\', \'Alchemy\', \'Privy\', \'OpenProvider\', \'Next.js\'].map((b) => (
              <span key={b} className="text-neutral-400 font-medium text-sm">{b}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
'''

try:
    with open(TARGET, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Generated: {TARGET}")
    print(f"📏 Lines: {len(content.splitlines())} | Size: {len(content.encode()):,} bytes")
    print("🔄 Next: Run 'npx next build && pm2 restart build-with-ai-web --update-env'")
except Exception as e:
    print(f"❌ Error: {e}", file=sys.stderr)
    sys.exit(1)
