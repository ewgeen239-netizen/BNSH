'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Premium brand emblem — a crafted recreation of the BNSH mark:
 * gold serif wordmark inside concentric rings, with slow rotation,
 * a soft gold glow and a gentle float. Pure SVG — sharp at any size.
 */
export function BrandEmblem({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      className={`relative aspect-square w-full ${className}`}
    >
      {/* ambient gold glow */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.22),transparent_62%)] blur-2xl animate-pulse-glow" />

      <div className={reduce ? '' : 'animate-float'}>
        <svg
          viewBox="0 0 600 600"
          className="relative h-full w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          role="img"
          aria-label="BNSH — Personal Brand. Digital, Growth, Identity."
        >
          <defs>
            <linearGradient id="bnsh-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0DFB0" />
              <stop offset="45%" stopColor="#D8BC86" />
              <stop offset="72%" stopColor="#C6A15B" />
              <stop offset="100%" stopColor="#9B7B3F" />
            </linearGradient>
            <linearGradient id="bnsh-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#C6A15B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#C6A15B" stopOpacity="0.5" />
            </linearGradient>
            <radialGradient id="bnsh-vignette" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#0B0B0B" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
          </defs>

          {/* base disc */}
          <circle cx="300" cy="300" r="292" fill="url(#bnsh-vignette)" />

          {/* rotating dashed ring */}
          <g className={reduce ? '' : 'animate-spin-slow'} style={{ transformOrigin: '300px 300px' }}>
            <circle
              cx="300"
              cy="300"
              r="250"
              fill="none"
              stroke="url(#bnsh-ring)"
              strokeWidth="1"
              strokeDasharray="2 10"
            />
          </g>

          {/* counter-rotating thin ring */}
          <g className={reduce ? '' : 'animate-spin-reverse'} style={{ transformOrigin: '300px 300px' }}>
            <circle cx="300" cy="300" r="228" fill="none" stroke="#C6A15B" strokeOpacity="0.18" strokeWidth="1" />
          </g>

          {/* static inner ring */}
          <circle cx="300" cy="300" r="205" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />

          {/* wordmark */}
          <text
            x="300"
            y="286"
            textAnchor="middle"
            fill="url(#bnsh-gold)"
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '118px',
              letterSpacing: '10px',
              fontWeight: 400,
            }}
          >
            BNSH
          </text>

          {/* divider dots */}
          <circle cx="252" cy="330" r="1.6" fill="#C6A15B" fillOpacity="0.7" />
          <circle cx="300" cy="330" r="1.6" fill="#C6A15B" fillOpacity="0.7" />
          <circle cx="348" cy="330" r="1.6" fill="#C6A15B" fillOpacity="0.7" />

          {/* subtitle */}
          <text
            x="300"
            y="372"
            textAnchor="middle"
            fill="#D6D6DA"
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: '19px',
              letterSpacing: '11px',
              fontWeight: 500,
            }}
          >
            PERSONAL BRAND
          </text>

          {/* motto */}
          <text
            x="300"
            y="400"
            textAnchor="middle"
            fill="#B79A5E"
            fillOpacity="0.85"
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: '11px',
              letterSpacing: '6px',
              fontWeight: 400,
            }}
          >
            DIGITAL • GROWTH • IDENTITY
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
