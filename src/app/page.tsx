import dynamic from 'next/dynamic';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ServicesMatrix from '@/components/ServicesMatrix';
import ContactSection from '@/components/ContactSection';

const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-black text-white">
      
      {/* 1. The Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCanvas />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 -z-10" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 drop-shadow-lg">
            Ajay Sidal
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 font-light max-w-2xl drop-shadow-md">
            Creative Technologist & Operations Leader
          </p>
          <p className="mt-2 text-md text-gray-400 max-w-xl font-mono">
            Orchestrating AI, Web3, and Digital Infrastructure.
          </p>
          <div className="mt-10 pointer-events-auto">
            <button className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
              View My Journey
            </button>
          </div>
        </div>
      </section>

      {/* 2. The Experience Timeline Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <ExperienceTimeline />
      </section>

      {/* 3. The Services Matrix Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <ServicesMatrix />
      </section>

      {/* 4. The Contact Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <ContactSection />
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center text-gray-500 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Ajay Sidal. Built with Next.js, React Three Fiber & Framer Motion.</p>
      </footer>

    </main>
  );
}