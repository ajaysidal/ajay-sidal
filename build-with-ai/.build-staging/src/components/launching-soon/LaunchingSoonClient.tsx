'use client'
import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

const LAUNCH_DATE = new Date('2026-06-14T00:00:00Z')

export default function LaunchingSoonClient() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!mounted) return
    const timer = setInterval(() => {
      const diff = LAUNCH_DATE.getTime() - new Date().getTime()
      if (diff <= 0) { clearInterval(timer); return }
      setTimeLeft({
        days: Math.floor(diff/(1000*60*60*24)),
        hours: Math.floor((diff/(1000*60*60))%24),
        minutes: Math.floor((diff/(1000*60))%60),
        seconds: Math.floor((diff/1000)%60)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading')
    try {
      const res = await fetch('/api/launching-soon/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'launching-soon-v2' })
      })
      if (res.ok) { setStatus('success'); setEmail('') } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  if (!mounted) return <div className="min-h-screen bg-[#0A0F1A]" />

  return (
    <main className="relative min-h-screen bg-[#0A0F1A] text-white">
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" /> Launching June 14, 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Build With AI</span>
          <span className="block text-white/90 mt-2">Enterprise Dev OS</span>
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
          Sovereign, AI-native infrastructure for Web2/Web3 teams. Code faster. Deploy smarter. Own your stack.
        </p>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-12">
          {Object.entries(timeLeft).map(([unit, val]) => (
            <div key={unit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <span className="block text-2xl font-bold">{String(val).padStart(2,'0')}</span>
              <span className="text-xs uppercase text-neutral-500">{unit}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} 
            placeholder="enterprise@company.com" required
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" disabled={status==='loading'}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-colors">
            {status==='loading'?'Processing...':<><span>Get Early Access</span><ArrowRight className="w-4 h-4 inline"/></>}
          </button>
        </form>
        {status==='success' && <p className="text-cyan-400 text-sm mt-3"><CheckCircle className="w-4 h-4 inline"/> You're on the list.</p>}
        {status==='error' && <p className="text-red-400 text-sm mt-3">Something went wrong. Try again.</p>}
      </div>
    </main>
  )
}
