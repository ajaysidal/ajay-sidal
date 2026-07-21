import Link from 'next/link';
import { BOOK_APPOINTMENT_LINK, FOOTER_SECTIONS } from '@/config/site-links';

export default function Footer() {
  return (
    <footer className="w-full bg-[color:var(--bg-primary)] border-t border-[color:var(--bg-tertiary)] pt-16 pb-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4">
        {/* 7-Column Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8 mb-16">
          
          {/* Columns 1 & 2: Sanctuary Lore & Button */}
          <div className="lg:col-span-2 pr-8 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400">
                <img src="/logo.svg" alt="Opsvantage Logo" className="w-12 h-12" />
              </div>
              <h3 className="text-white font-bold text-xl tracking-tight">BUILD WITH AI</h3>
            </div>
            {/* Forced break before "architects" */}
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              "We are the sum of the hands we hold. Built not for the <br className="hidden lg:block" /> architects of the storm, but for those who survived it."
            </p>
            {/* Relocated Button */}
            <Link href={BOOK_APPOINTMENT_LINK.href} className="border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all shadow-[0_0_10px_rgba(45,212,191,0.1)] hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]">
              ALWAYS TOGETHER. NEVER ALONE.
            </Link>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase mb-6">{section.title}</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}`}>
                    <Link href={link.href} className={link.emphasize ? 'text-teal-400 font-bold hover:text-teal-300 transition-colors flex items-center gap-1.5' : 'hover:text-teal-400 transition-colors'}>
                      {link.emphasize ? <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> : null}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 7: The Legacy (Button removed) */}
          <div className="lg:col-span-1 flex flex-col items-start lg:items-end text-left lg:text-right">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase mb-6">The Legacy</h4>
            <div className="text-neutral-400 text-sm space-y-1 mb-6">
              <p>Opsvantage Digital</p>
              <p className="text-teal-500">MARZ • Silas</p>
              <p className="text-teal-500">Legacy of 1968</p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[color:var(--bg-tertiary)] pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold tracking-tight text-neutral-400 uppercase">
          <p>© 2026 BUILD WITH AI — A SANCTUARY FOR ALL.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Soulful Gratitude</span>
            <span>Nourished By The Collective</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
