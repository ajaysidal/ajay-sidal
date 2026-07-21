import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ajay Sidal | Creative Technologist & Web3 Builder",
  description: "A futuristic personal portfolio for Ajay Sidal, showcasing web development, AI automation, infrastructure, and operations leadership.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="antialiased font-sans bg-[#050816] text-slate-100 selection:bg-cyan-300/20 selection:text-cyan-100">
        {children}
      </body>
    </html>
  );
}