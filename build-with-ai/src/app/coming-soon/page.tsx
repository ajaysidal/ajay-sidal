export default function ComingSoon() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]">
      
      {/* Futuristic Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-40 bg-[var(--accent-purple)]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-40 bg-[var(--accent-cyan)]"></div>
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full blur-[160px] opacity-30 bg-[var(--accent-blue)]"></div>
      </div>

      {/* Main Card */}
      <div className="card-glass p-16 text-center max-w-3xl mx-auto border border-white/10">
        
        {/* Title */}
        <h1 className="text-6xl md:text-7xl text-gradient text-sovereign-header tracking-tight mb-6">
          BUILD WITH AI
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-secondary font-semibold uppercase tracking-wide mb-10">
          A New Era of Intelligent Automation
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent mb-10"></div>

        {/* Coming Soon */}
        <h2 className="text-4xl md:text-5xl text-gradient text-sovereign-title mb-4">
          COMING SOON
        </h2>

        <p className="text-lg md:text-xl text-tertiary">
          Watch This Space — The Future of Web2 × Web3 AI Infrastructure Is About to Launch
        </p>

        {/* Launch Teaser */}
        <div className="mt-12 text-sm text-tertiary uppercase tracking-wide">
          Powered by Sovereign AI • Web3 Smart Wallets • Enterprise Automation • Next‑Gen Agents
        </div>
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(180deg,#fff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>
  );
}
