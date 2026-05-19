import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: '#CC0000',
          dark: '#990000',
          light: '#FF1A1A',
        },
        black: {
          900: '#0A0A0A',
          800: '#111111',
          700: '#1C1C1C',
          600: '#242424',
          500: '#2E2E2E',
        },
        gray: {
          accent: '#9CA3AF',
          muted: '#6B7280',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'Barlow Condensed', 'sans-serif'],
        body: ['var(--font-barlow)', 'Barlow', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.9' }],
        'hero-sm': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.95' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
