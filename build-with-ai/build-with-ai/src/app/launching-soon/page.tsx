'use client'

import { useEffect, useState } from 'react'

const LAUNCH_DATE = new Date('2026-06-14T00:00:00Z')

export default function LaunchingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = LAUNCH_DATE.getTime() - Date.now()
      if (diff <= 0) return

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/launching-soon/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companySize,
          source: 'launching-soon-v3'
        })
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setCompanySize('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <html>
      <head>
        <title>Build With AI — Launching Soon</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet" />
      </head>

      <body>
        <style>{`
          :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #111118;
            --bg-tertiary: #1a1a25;
            --text-primary: #ffffff;
            --text-secondary: #e5e5e5;
            --accent-cyan: #00d4ff;
            --accent-blue: #3b82f6;
            --accent-purple: #8b5cf6;
          }
          * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
          body {
            margin: 0;
            background: radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%);
            color: var(--text-primary);
            -webkit-font-smoothing: antialiased;
          }
          .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;
          }
          .container {
            max-width: 960px;
            width: 100%;
            text-align: center;
          }
          .logo-wrap {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
          }
          .logo-frame {
            width: 88px;
            height: 88px;
            border-radius: 999px;
            padding: 2px;
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue), var(--accent-purple));
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.35);
          }
          .logo-inner {
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: rgba(15, 23, 42, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(148, 163, 184, 0.35);
          }
          .logo-caption {
            font-size: 0.8rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #9ca3af;
          }
          h1 {
            font-size: clamp(2.1rem, 4vw, 2.8rem);
            margin: 0 0 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
          }
          .headline-strong {
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .subheadline {
            max-width: 640px;
            margin: 0 auto 24px;
            color: #d1d5db;
            font-size: 1rem;
            line-height: 1.7;
          }
          .pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.4);
            color: #e5e7eb;
            font-size: 0.8rem;
            margin-bottom: 18px;
          }
          .pill-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: var(--accent-cyan);
            box-shadow: 0 0 12px rgba(0, 212, 255, 0.8);
          }
          .grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 28px;
            margin-top: 28px;
          }
          .card {
            background: rgba(15, 23, 42, 0.9);
            border-radius: 18px;
            border: 1px solid rgba(148, 163, 184, 0.35);
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.7);
            padding: 20px 20px 22px;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 16px;
          }
          .feature {
            background: rgba(15, 23, 42, 0.9);
            border-radius: 12px;
            border: 1px solid rgba(148, 163, 184, 0.25);
            padding: 10px 12px;
            text-align: left;
          }
          .feature h4 {
            margin: 0 0 4px;
            font-size: 0.85rem;
            font-weight: 700;
          }
          .feature p {
            margin: 0;
            font-size: 0.8rem;
            color: #9ca3af;
          }
          .countdown {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 16px;
          }
          .count-box {
            background: rgba(15, 23, 42, 0.9);
            border-radius: 12px;
            border: 1px solid rgba(148, 163, 184, 0.25);
            padding: 10px 8px;
          }
          .count-value {
            font-size: 1.4rem;
            font-weight: 800;
          }
          .count-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            color: #9ca3af;
            letter-spacing: 0.12em;
          }
          .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .form input,
          .form select {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid rgba(148, 163, 184, 0.4);
            background: rgba(15, 23, 42, 0.9);
            color: #e5e7eb;
            font-size: 0.9rem;
          }
          .form button {
            padding: 11px 14px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
            color: #020617;
            font-weight: 700;
            cursor: pointer;
          }
          .form button:disabled {
            opacity: 0.7;
            cursor: default;
          }
          .note {
            margin-top: 8px;
            font-size: 0.8rem;
            color: #9ca3af;
          }
          .footer {
            margin-top: 26px;
            font-size: 0.8rem;
            color: #6b7280;
          }
          @media (max-width: 800px) {
            .grid { grid-template-columns: 1fr; }
            .features { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="page">
          <div className="container">

            {/* Logo */}
            <div className="logo-wrap">
              <div className="logo-frame">
                <div className="logo-inner">

                  {/* CYAN NEON SHIELD + GLOBE SVG */}
                  <svg width="42" height="42" viewBox="0 0 64 64" fill="none">
                    <defs>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <path
                      d="M32 4L54 14V30C54 44 44 56 32 60C20 56 10 44 10 30V14L32 4Z"
                      stroke="#00d4ff"
                      strokeWidth="2.5"
                      fill="rgba(0,212,255,0.08)"
                      filter="url(#glow)"
                    />

                    <circle
                      cx="32"
                      cy="30"
                      r="10"
                      stroke="#00d4ff"
                      strokeWidth="2"
                      fill="rgba(0,212,255,0.12)"
                      filter="url(#glow)"
                    />

                    <path
                      d="M22 30H42M32 20V40"
                      stroke="#00d4ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                  </svg>

                </div>
              </div>
              <div className="logo-caption">BUILD WITH AI</div>
            </div>

            {/* Pill */}
            <div className="pill">
              <span className="pill-dot"></span>
              Launching June 14, 2026 — Private Early Access
            </div>

            {/* Headline */}
            <h1>
              <span className="headline-strong">Build Your Digital Presence.</span><br/>
              Automate Your Business. Unlock Web3 — All in One Platform.
            </h1>

            <p className="subheadline">
              The first platform that blends Web2 simplicity with Web3 identity and AI‑powered automation —
              built for teams, creators, and everyday people.
            </p>

            <div className="grid">

              {/* Left card */}
              <div className="card">
                <h3 style={{margin:'0 0 10px',fontSize:'0.9rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'#9ca3af'}}>
                  What You Can Do With Build With AI
                </h3>

                <div className="features">
                  <div className="feature">
                    <h4>Launch Your Online Presence</h4>
                    <p>Beautiful, fast, and secure sites with zero dev ops overhead.</p>
                  </div>
                  <div className="feature">
                    <h4>Automate Your Operations</h4>
                    <p>AI‑powered workflows that handle the busywork while you focus on growth.</p>
                  </div>
                  <div className="feature">
                    <h4>Step Into Web3 Safely</h4>
                    <p>Smart wallet, identity, and rewards — without the complexity.</p>
                  </div>
                </div>

                <p style={{marginTop:'14px',fontSize:'0.8rem',color:'#9ca3af'}}>
                  Private beta opens first to our early waitlist. No spam. Just launch‑ready updates and access.
                </p>
              </div>

              {/* Right card */}
              <div className="card">
                <h3 style={{margin:'0 0 10px',fontSize:'0.9rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'#9ca3af'}}>
                  Early Access Countdown
                </h3>

                <div className="countdown">
                  <div className="count-box">
                    <div className="count-value">{String(timeLeft.days).padStart(2,'0')}</div>
                    <div className="count-label">Days</div>
                  </div>
                  <div className="count-box">
                    <div className="count-value">{String(timeLeft.hours).padStart(2,'0')}</div>
                    <div className="count-label">Hours</div>
                  </div>
                  <div className="count-box">
                    <div className="count-value">{String(timeLeft.minutes).padStart(2,'0')}</div>
                    <div className="count-label">Minutes</div>
                  </div>
                  <div className="count-box">
                    <div className="count-value">{String(timeLeft.seconds).padStart(2,'0')}</div>
                    <div className="count-label">Seconds</div>
                  </div>
                </div>

                <div className="form">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  >
                    <option value="">Company size (optional)</option>
                    <option>Solo / Creator</option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–250</option>
                    <option>250+</option>
                  </select>

                  <button
                    type="button"
                    disabled={status === 'loading'}
                    onClick={handleSubmit}
                  >
                    {status === 'loading' ? 'Processing...' : 'Join the Early Access List'}
                  </button>
                </div>

                {status === 'success' && (
                  <div className="note" style={{ color: '#00d4ff' }}>
                    You're on the list — welcome aboard.
                  </div>
                )}

                {status === 'error' && (
                  <div className="note" style={{ color: '#f87171' }}>
                    Something went wrong. Please try again.
                  </div>
                )}

              </div>
            </div>

            <div className="footer">
              © {new Date().getFullYear()} Build With AI — All Rights Reserved
            </div>

          </div>
        </div>
      </body>
    </html>
  )
}

