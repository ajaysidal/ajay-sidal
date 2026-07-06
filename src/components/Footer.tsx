export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816] py-10">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
          Ajay Sidal
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Creative Technologist � Web3 Builder � Operations Leader
        </p>
        <p className="mt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Ajay Sidal. Crafted with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}