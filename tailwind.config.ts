import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#060816',
        mist: '#f5efe7',
        ember: '#ff7a1a',
        violet: '#8b5cf6',
        cyan: '#38bdf8'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0, 0, 0, 0.3)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at 80% 10%, rgba(139,92,246,0.24), transparent 22%), linear-gradient(135deg, rgba(255,122,26,0.14), transparent 35%)'
      }
    }
  },
  plugins: []
} satisfies Config;
