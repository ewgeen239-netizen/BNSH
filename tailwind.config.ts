import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep ink backgrounds
        ink: {
          950: '#050505',
          900: '#080808',
          850: '#0B0B0B',
          800: '#101010',
          700: '#161616',
          600: '#1C1C1C',
        },
        // Premium neutrals
        platinum: '#E7E7E9',
        silver: '#B9BAC0',
        muted: '#8A8B92',
        faint: '#5B5C63',
        // Very restrained accents
        gold: {
          DEFAULT: '#C6A15B',
          soft: '#D8BC86',
          deep: '#9B7B3F',
        },
        electric: {
          DEFAULT: '#5B8DEF',
          soft: '#8FB2F5',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 9vw, 7.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        overline: '0.28em',
      },
      maxWidth: {
        content: '1200px',
        prose: '68ch',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 60px -20px rgba(0,0,0,0.8)',
        'glass-hover': '0 1px 0 0 rgba(255,255,255,0.10) inset, 0 30px 80px -24px rgba(0,0,0,0.9)',
        gold: '0 0 0 1px rgba(198,161,91,0.25), 0 20px 60px -24px rgba(198,161,91,0.25)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'aurora-1': {
          '0%,100%': { transform: 'translate3d(-8%, -4%, 0) scale(1)' },
          '50%': { transform: 'translate3d(6%, 6%, 0) scale(1.15)' },
        },
        'aurora-2': {
          '0%,100%': { transform: 'translate3d(6%, 4%, 0) scale(1.1)' },
          '50%': { transform: 'translate3d(-6%, -6%, 0) scale(0.95)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'aurora-1': 'aurora-1 22s ease-in-out infinite',
        'aurora-2': 'aurora-2 28s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s var(--tw-ease, ease) both',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-reverse': 'spin-reverse 90s linear infinite',
        float: 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
