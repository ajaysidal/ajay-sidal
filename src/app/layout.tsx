import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ajay Sidal | Creative Technologist & Operations Leader',
  description:
    'Ajay Sidal builds secure, polished digital systems at the intersection of web development, Web3, AI automation, and operations leadership.',
  openGraph: {
    title: 'Ajay Sidal | Creative Technologist & Operations Leader',
    description:
      'Ajay Sidal builds secure, polished digital systems at the intersection of web development, Web3, AI automation, and operations leadership.',
    type: 'website',
    url: 'https://ajaysidal.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajay Sidal | Creative Technologist & Operations Leader',
    description:
      'Ajay Sidal builds secure, polished digital systems at the intersection of web development, Web3, AI automation, and operations leadership.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
