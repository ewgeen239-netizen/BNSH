'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { CyberBackground } from './CyberBackground';
import { PixelGuardian } from './PixelGuardian';
import { Decrypt } from './Decrypt';
import { works } from '@/lib/content';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

const liveCount = works.filter((w) => w.live).length;

/**
 * The hero is the moment the visitor arrives in 3089: almost no boxes, one
 * enormous wordmark, a decrypting tagline and a strip of telemetry. Everything
 * that used to be decoration here is now either type or a hairline.
 */
export function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const rev = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0 } as const,
    transition: { duration: 0.8, ease, delay },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-28"
    >
      <CyberBackground />

      {/* The watcher. Full-bleed and faint on a phone, standing to the right
          on a desktop — one instance either way, so only one loop runs. */}
      <PixelGuardian className="absolute bottom-0 right-0 top-24 w-full opacity-[0.28] lg:left-auto lg:top-0 lg:w-[42vw] lg:max-w-[560px] lg:opacity-100" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-content px-5 sm:px-8"
      >
        {/* top telemetry line */}
        <motion.div {...rev(0)} className="flex items-center gap-4">
          <span className="hud flex shrink-0 items-center gap-2 text-neon/70">
            <span className="h-1 w-1 bg-neon animate-pulse-dot" />
            {t.hud.archive} {'//'} {t.hud.year}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-neon/30 via-white/10 to-transparent" />
          <span className="hud hidden shrink-0 sm:block">{t.hud.node}</span>
        </motion.div>

        {/* wordmark */}
        <div className="mt-8 sm:mt-10">
          <motion.h1 {...rev(0.06)} className="select-none">
            <span className="glitch-text block font-display text-display-xl font-bold leading-[0.85] text-platinum">
              BNSH
            </span>
            <span
              className="block font-display text-display-xl font-bold leading-[0.85] text-transparent"
              style={{ WebkitTextStroke: '1px rgba(166,182,194,0.42)' }}
            >
              STUDIO
            </span>
          </motion.h1>
        </div>

        {/* decrypting tagline */}
        <motion.div {...rev(0.14)} className="mt-8 max-w-2xl">
          <Decrypt
            as="p"
            text={`${t.hero.taglineA} — ${t.hero.taglineB}`}
            speed={22}
            delay={520}
            className="font-mono text-[0.95rem] uppercase leading-relaxed tracking-[0.1em] text-neon-soft/90 sm:text-base"
          />
        </motion.div>

        <motion.p {...rev(0.2)} className="mt-6 max-w-lg text-sm leading-relaxed text-muted sm:max-w-xl sm:text-base">
          {t.hero.description}
        </motion.p>

        {/* actions */}
        <motion.div {...rev(0.26)} className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToId('works')}
            className="group notch-sm relative inline-flex items-center gap-2.5 bg-neon px-6 py-3.5 font-mono text-[11px] uppercase tracking-hud text-ink-950 transition-colors duration-300 hover:bg-neon-soft focus-ring"
          >
            {t.hero.ctaWorks}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => scrollToId('contact')}
            className="notch-sm inline-flex items-center gap-2.5 border border-white/15 bg-white/[0.02] px-6 py-3.5 font-mono text-[11px] uppercase tracking-hud text-platinum transition-colors duration-300 hover:border-neon/50 hover:bg-neon/[0.06] hover:text-neon-soft focus-ring"
          >
            {t.hero.ctaDiscuss}
          </button>
          <span className="hud ml-1 hidden items-center gap-2 sm:inline-flex">
            <span className="tabular-nums text-neon-soft">{String(liveCount).padStart(2, '0')}</span>
            {t.archive.liveCount}
          </span>
        </motion.div>

        {/* quick jump — a row of channel selectors */}
        <motion.div {...rev(0.3)} className="mt-8 flex items-center gap-3">
          <span className="hud hidden shrink-0 sm:block">{t.hero.quickJump}</span>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {[
              { id: 'pricing', label: t.nav.pricing, primary: true },
              { id: 'works', label: t.nav.works },
              { id: 'process', label: t.nav.process },
              { id: 'contact', label: t.nav.contact },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToId(c.id)}
                className={cn(
                  'shrink-0 border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-hud transition-colors duration-300 focus-ring',
                  c.primary
                    ? 'border-neon/40 bg-neon/[0.07] text-neon-soft hover:bg-neon/[0.13]'
                    : 'border-white/10 bg-white/[0.015] text-muted hover:border-white/25 hover:text-platinum',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* telemetry strip */}
        <motion.div
          {...rev(0.36)}
          className="mt-14 grid grid-cols-1 border-t border-white/[0.07] sm:grid-cols-3"
        >
          {t.hero.trust.map(([value, note], i) => (
            <div
              key={value}
              className="flex items-baseline gap-3 border-b border-white/[0.07] py-4 sm:border-b-0 sm:border-r sm:border-white/[0.07] sm:py-5 sm:pr-5 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-5"
            >
              <span className="hud shrink-0 text-neon/50">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-platinum">{value}</span>
                <span className="mt-0.5 block text-xs text-faint">{note}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToId('works')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 focus-ring"
        aria-label={t.hero.ctaWorks}
      >
        <span className="flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-hud text-faint">
          {t.hud.scrollCue}
          <span className="block h-8 w-px bg-gradient-to-b from-neon/70 to-transparent" />
          <ArrowDown className="h-3.5 w-3.5 text-neon/60" strokeWidth={1.5} />
        </span>
      </motion.button>
    </section>
  );
}
