import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
  typography: (theme) => ({
    DEFAULT: {
      css: {
        '--tw-prose-body': theme('colors.neutral.700'),
        '--tw-prose-headings': theme('colors.white'),
        '--tw-prose-links': theme('colors.teal.400'),
        '--tw-prose-bold': theme('colors.white'),
        '--tw-prose-counters': theme('colors.neutral.500'),
        '--tw-prose-bullets': theme('colors.neutral.600'),
        '--tw-prose-hr': theme('colors.neutral.800'),
        '--tw-prose-quotes': theme('colors.neutral.300'),
        '--tw-prose-code': theme('colors.teal.300'),
        '--tw-prose-pre-code': theme('colors.neutral.300'),
        '--tw-prose-pre-bg': theme('colors.neutral.900'),
        lineHeight: '1.6',
        letterSpacing: '-0.01em',
        '> ul > li::marker': { color: 'var(--tw-prose-bullets)' },
        '> ol > li::marker': { color: 'var(--tw-prose-bullets)' },
      }
    }
  }),
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
    '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
  },

      colors: {
        obsidian: "#0a0a0a",
        sanctuary: {
          DEFAULT: "#14b8a6",
          dark: "#050505",
          glow: "#2dd4bf",
        }
      },
      letterSpacing: {
        'sanctuary': '0.2em',
      }
    },
  },
  plugins: [],
};
export default config;
