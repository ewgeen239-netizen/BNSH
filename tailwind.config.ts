import type { Config } from 'tailwindcss';

/**
 * BNSH // 3089 — minimal cyberpunk design system.
 *
 * The palette is deliberately almost monochrome: a blue-black void, cold
 * chrome neutrals and exactly one live colour (neon cyan) with a second,
 * rarely used alarm colour (flux magenta). Minimalism here means restraint in
 * hue, not in detail — the "future" reads through hairlines, mono telemetry
 * and scan artefacts rather than through gradients everywhere.
 */
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
        // The void — blue-shifted blacks, as before the hero restyle
        ink: {
          950: '#04060A',
          900: '#070A10',
          850: '#0A0E15',
          800: '#0E131C',
          700: '#141A24',
          600: '#1C2430',
        },
        // Warm-neutral text ramp
        platinum: '#EDEDF2',
        silver: '#AFAFBA',
        muted: '#7E7E8C',
        faint: '#55555F',
        // The accent: the same lavender the bust's head is made of.
        // (Named `neon` throughout the UI — the hue changed, the role did not.)
        neon: {
          DEFAULT: '#C9A4FF',
          soft: '#E4D2FF',
          deep: '#8B5CF6',
        },
        // Secondary signal — the amber of the bust's shoulders
        flux: {
          DEFAULT: '#F0A92E',
          soft: '#F8C96B',
        },
        electric: {
          DEFAULT: '#5B8DEF',
          soft: '#8FB2F5',
        },
        // Hero palette — the particle bust and the island header's CTA
        acid: '#E2F952',
        lavender: {
          DEFAULT: '#C9A4FF',
          soft: '#E4D2FF',
        },
        amber: {
          DEFAULT: '#F0A92E',
          soft: '#F8C96B',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        pixel: ['var(--font-pixel)', 'var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 9vw, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.9rem, 4.5vw, 3.1rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        overline: '0.3em',
        hud: '0.22em',
      },
      maxWidth: {
        content: '1280px',
        prose: '68ch',
      },
      borderRadius: {
        // Soft, premium hardware: the island header sets the tone
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 80px -30px rgba(0,0,0,0.95)',
        neon: '0 0 0 1px rgba(201,164,255,0.35), 0 0 40px -10px rgba(201,164,255,0.45)',
        'neon-soft': '0 0 24px -8px rgba(201,164,255,0.4)',
        flux: '0 0 0 1px rgba(240,169,46,0.35), 0 0 40px -12px rgba(240,169,46,0.4)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(166,182,194,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,182,194,0.055) 1px, transparent 1px)',
        'grid-neon':
          'linear-gradient(to right, rgba(40,224,240,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(40,224,240,0.10) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(60% 60% at 50% 0%, rgba(40,224,240,0.08) 0%, transparent 70%)',
        scanlines:
          'repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 3px)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'scan-beam': {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '10%,90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(110vh)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '94%': { opacity: '0.72' },
          '96%': { opacity: '1' },
          '97%': { opacity: '0.85' },
        },
        'glitch-x': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '20%': { transform: 'translate3d(-2px,1px,0)' },
          '40%': { transform: 'translate3d(2px,-1px,0)' },
          '60%': { transform: 'translate3d(-1px,-1px,0)' },
          '80%': { transform: 'translate3d(1px,1px,0)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.82)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(-4%,-2%,0) scale(1)' },
          '50%': { transform: 'translate3d(4%,3%,0) scale(1.08)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'grid-pan': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '0 64px' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'scan-beam': 'scan-beam 7s linear infinite',
        'fade-in': 'fade-in 0.8s var(--tw-ease, ease) both',
        flicker: 'flicker 6s steps(1, end) infinite',
        'glitch-x': 'glitch-x 0.4s steps(2, end) infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-reverse': 'spin-reverse 90s linear infinite',
        drift: 'drift 26s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'grid-pan': 'grid-pan 8s linear infinite',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
