import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex flex-col">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
            Ajay Sidal
          </p>
          <p className="text-xs text-slate-400">
            Creative Technologist
          </p>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#about" className="text-sm text-slate-300 transition hover:text-cyan-300">About</Link>
          <Link href="#experience" className="text-sm text-slate-300 transition hover:text-cyan-300">Experience</Link>
          <Link href="#education" className="text-sm text-slate-300 transition hover:text-cyan-300">Education</Link>
          <Link href="#contact" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/90 transition hover:border-cyan-300/40 hover:bg-cyan-300/10">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}