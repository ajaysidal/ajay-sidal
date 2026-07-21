"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import DeferredNavbarWallet from '@/components/layout/DeferredNavbarWallet';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import {
  BOOK_APPOINTMENT_LINK,
  MOBILE_NAV_LINKS,
  PRIMARY_NAV_LINKS,
  PRODUCT_LINKS,
  PROTOCOL_LINKS,
  SERVICE_LINKS,
} from '@/config/site-links';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="w-full bg-[color:var(--bg-primary)]/90 backdrop-blur-md border-b border-[color:var(--bg-tertiary)] sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LEFT: Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.svg" alt="Opsvantage Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl tracking-tight leading-tight">BUILD WITH AI</span>
            <span className="text-teal-500 text-[10px] tracking-tight font-semibold uppercase">Enterprise</span>
          </div>
        </Link>

        {/* CENTER: Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-neutral-300">
          {PRIMARY_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-400 transition-colors">{link.label}</Link>
          ))}
          
          {/* Products Dropdown */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Products <ChevronDown className="w-3 h-3" /></button>
            <div className="absolute top-20 left-0 w-56 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              {PRODUCT_LINKS.map((link, i) => (
                <Link key={link.href} href={link.href} className={`px-4 py-3 hover:text-teal-400 ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} hover:bg-neutral-900 ${i < PRODUCT_LINKS.length - 1 ? 'border-b border-neutral-800/50' : ''}`}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Services Dropdown */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Services <ChevronDown className="w-3 h-3" /></button>
            <div className="absolute top-20 left-0 w-56 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              {SERVICE_LINKS.map((link, i) => (
                <Link key={link.href} href={link.href} className={`px-4 py-3 hover:text-teal-400 ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} hover:bg-neutral-900 ${i < SERVICE_LINKS.length - 1 ? 'border-b border-neutral-800/50' : ''}`}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Protocol Dropdown */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Protocol <ChevronDown className="w-3 h-3" /></button>
            <div className="absolute top-20 left-0 w-56 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              {PROTOCOL_LINKS.map((link, i) => (
                <Link key={link.href} href={link.href} className={`px-4 py-3 hover:text-teal-400 ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} ${link.label === 'Current Promotions' ? 'font-bold text-cyan-400' : ''} hover:bg-neutral-900 ${i < PROTOCOL_LINKS.length - 1 ? 'border-b border-neutral-800/50' : ''}`}>{link.label}</Link>
              ))}
            </div>
          </div>

          <Link href="/academy" className="hover:text-teal-400 transition-colors">MARZ Academy</Link>
          <Link href="/leads" className="hover:text-teal-400 transition-colors">Contact Us</Link>
        </div>

        {/* RIGHT: Theme Toggle & Action Buttons */}
        <div className="hidden xl:flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors focus:outline-none" title="Toggle theme" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-neutral-300" /> : <Moon className="w-5 h-5 text-neutral-300" />}
          </button>
          <Link href="/leads" className="px-5 py-2 rounded-lg border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 transition-colors text-sm font-medium">Book Live Demo</Link>
          <Link href="/login" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">Login</Link>
          <Link href="/signup" className="px-5 py-2 rounded-lg bg-teal-500 text-black hover:bg-teal-400 transition-colors text-sm font-medium font-semibold">Sign Up</Link>
          <DeferredNavbarWallet />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="xl:hidden p-2 text-teal-400" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label="Toggle menu">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="xl:hidden bg-[color:var(--bg-primary)] border-t border-[color:var(--bg-tertiary)] p-4 space-y-4">
          {MOBILE_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="block text-neutral-300 hover:text-teal-400 transition-colors text-sm font-medium py-2">{link.label}</Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-neutral-800">
            <Link href="/leads" className="px-5 py-2 rounded-lg border border-teal-500/50 text-teal-400 text-center text-sm font-medium">Book Live Demo</Link>
            <Link href="/login" className="text-neutral-300 hover:text-white text-center text-sm font-medium">Login</Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg bg-teal-500 text-black text-center text-sm font-medium font-semibold">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
