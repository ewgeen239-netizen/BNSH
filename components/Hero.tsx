'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown, BadgeCheck } from 'lucide-react';
import { AuroraBackground } from './AuroraBackground';
import { BrandEmblem } from './BrandEmblem';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Gentle parallax: content drifts up + fades as you scroll past the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Per-element reveal — robust to the locale-provider re-render on mount
  // (parent→child variant propagation can be cancelled by that re-render).
  const rev = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0 } as const,
    transition: { duration: 0.8, ease, delay },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24"
    >
      <AuroraBackground />

      <motion.div
        style={{ y, opacity }}
        className="mx-auto w-full max-w-content px-5 sm:px-8"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Left — copy */}
          <div className="max-w-2xl">
            {/* Made-by-myself note */}
            <motion.div {...rev(0)} className="mb-4 flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[11px] font-medium text-gold-soft/90">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
                {t.madeBy}
              </span>
            </motion.div>

            <motion.div {...rev(0.06)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-silver/90 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              {...rev(0.12)}
              className="mt-6 text-display-xl font-semibold tracking-tightest text-platinum"
            >
              BNSH <span className="text-gradient-platinum">Studio</span>
            </motion.h1>

            <motion.p
              {...rev(0.18)}
              className="mt-6 max-w-xl font-display text-[1.65rem] leading-[1.2] text-silver sm:text-[2.1rem]"
            >
              <span className="italic">{t.hero.taglineA}</span>
              <span className="text-silver/40"> — </span>
              <span className="text-gradient-gold italic">{t.hero.taglineB}</span>
            </motion.p>

            <motion.p
              {...rev(0.24)}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted"
            >
              {t.hero.description}
            </motion.p>

            <motion.div {...rev(0.3)} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToId('works')}
                className="group inline-flex items-center gap-2 rounded-full bg-platinum px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-white focus-ring"
              >
                {t.hero.ctaWorks}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollToId('contact')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-platinum backdrop-blur transition hover:border-gold/40 hover:bg-white/[0.06] focus-ring"
              >
                {t.hero.ctaDiscuss}
              </button>
            </motion.div>

            {/* quick-jump ribbon — one-click down to any section */}
            <motion.div {...rev(0.33)} className="mt-5 flex items-center gap-3">
              <span className="hidden shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-overline text-faint sm:inline-flex">
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t.hero.quickJump}
              </span>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
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
                      'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus-ring',
                      c.primary
                        ? 'border-gold/40 bg-gold/[0.08] text-gold-soft hover:bg-gold/[0.14]'
                        : 'border-white/10 bg-white/[0.03] text-silver/80 hover:border-white/20 hover:text-platinum',
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* trust strip */}
            <motion.div
              {...rev(0.36)}
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-faint sm:gap-x-8"
            >
              {t.hero.trust.map(([value, note], i) => (
                <div key={value} className="flex items-center gap-x-6 sm:gap-x-8">
                  {i > 0 && <span className="hidden h-4 w-px bg-white/10 sm:block" />}
                  <Stat value={value} note={note} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — brand emblem */}
          <motion.div {...rev(0.2)} className="flex justify-center lg:justify-end">
            <BrandEmblem className="mx-auto w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[460px]" />
          </motion.div>
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.button
        onClick={() => scrollToId('works')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 focus-ring rounded-full"
        aria-label={t.hero.ctaWorks}
      >
        <span className="flex flex-col items-center gap-2 text-[11px] uppercase tracking-overline text-faint">
          {t.hero.scroll}
          <ArrowDown className="h-4 w-4 animate-bounce text-muted" strokeWidth={1.5} />
        </span>
      </motion.button>
    </section>
  );
}

function Stat({ value, note }: { value: string; note: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-medium text-silver">{value}</span>
      <span className="text-faint">{note}</span>
    </span>
  );
}
