import Link from 'next/link';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      {children}
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <p>Ajay Sidal • Creative technologist • Auckland</p>
        <Link href="#top" className="w-fit text-slate-400 transition hover:text-white">
          Back to top
        </Link>
      </footer>
    </div>
  );
}
