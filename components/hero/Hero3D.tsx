'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ParticleBust, HERO_SCROLL_VH } from './ParticleBust';
import { CyberBackground } from '../CyberBackground';
import { works } from '@/lib/content';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

/**
 * The hero: a scroll-driven stage rather than a screen.
 *
 * The section is HERO_SCROLL_VH viewports tall and everything inside it is
 * sticky, so scrolling does not move the composition — it advances it:
 *
 *   0.00 – 0.26  the bust is centred, the headline sits bottom-left
 *   0.26 – 0.38  the headline and the giant pixel title clear out upward
 *   0.34 – 1.00  the bust turns to three-quarter profile and slides right,
 *                while the capability cards come in on the left third
 *
 * The 3D itself (camera, rotation, scale) is driven inside ParticleBust from
 * the same scroll position; only the DOM layers are driven from here.
 */

const liveCount = works.filter((w) => w.live).length;

export function Hero3D() {
  const t = useT();
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const read = () => {
      raf.current = null;
      // The sticky stage only travels for (height - one viewport).
      const span = window.innerHeight * (HERO_SCROLL_VH - 1);
      setP(Math.min(1.2, Math.max(0, window.scrollY / span)));
    };
    const onScroll = () => {
      if (raf.current === null) raf.current = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  /** headline + pixel title: present until 0.26, gone by 0.38 */
  const out = clamp01((p - 0.26) / 0.12);
  /** cards: start arriving before the headline has fully cleared */
  const inCards = clamp01((p - 0.34) / 0.16);

  return (
    <section id="hero" className="relative" style={{ height: `${HERO_SCROLL_VH * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* --- the giant pixel title, behind the particles --- */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 flex items-center justify-center"
          style={{
            opacity: 1 - out,
            transform: `translateY(${-out * 14}vh) scale(${1 + out * 0.35})`,
            transition: 'opacity 120ms linear',
          }}
        >
          <span className="font-pixel whitespace-nowrap text-[11vw] uppercase leading-none tracking-[0.12em] text-white/[0.07] sm:text-[9vw]">
            Hello, I&apos;m Ewgeen
          </span>
        </div>

        {/* --- the bust --- */}
        <ParticleBust className="absolute inset-0 z-10" />

        {/* --- first beat: the headline, bottom-left --- */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 px-5 pb-16 sm:px-8 sm:pb-20"
          style={{
            opacity: 1 - out,
            transform: `translateY(${-out * 40}px)`,
            pointerEvents: out > 0.6 ? 'none' : 'auto',
          }}
        >
          <div className="mx-auto max-w-content">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 text-[11px] text-silver/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-lavender" />
              {t.hero3d.badgeA}
              <span aria-hidden="true" className="h-3 w-px bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-hud text-faint">
                {t.hero3d.badgeB}
              </span>
            </span>

            <h1 className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.08] tracking-tightest text-platinum">
              {t.hero3d.headline[0]}
              <br />
              {t.hero3d.headline[1]}
              <br />
              <span className="text-silver/55">{t.hero3d.headline[2]}</span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToId('works')}
                className="group inline-flex items-center gap-2 rounded-full bg-acid px-5 py-3 text-[12px] font-bold text-ink-950 transition hover:brightness-110 focus-ring"
              >
                {t.hero.ctaWorks}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => scrollToId('contact')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-[12px] font-medium text-platinum backdrop-blur-md transition hover:border-white/30 focus-ring"
              >
                {t.hero.ctaDiscuss}
              </button>
              <span className="hud ml-1 hidden items-center gap-2 sm:inline-flex">
                <span className="tabular-nums text-lavender">{String(liveCount).padStart(2, '0')}</span>
                {t.archive.liveCount}
              </span>
            </div>
          </div>
        </div>

        {/* --- second beat: the capability cards on the left third --- */}
        <div
          className="absolute inset-y-0 left-0 z-20 hidden w-full max-w-md items-center px-5 sm:px-8 md:flex"
          style={{
            opacity: inCards,
            transform: `translateY(${(1 - inCards) * 40}px)`,
            pointerEvents: inCards > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="w-full">
            <span className="hud block text-lavender/70">{t.hero3d.cardsOverline}</span>
            <div className="mt-5 space-y-2.5">
              {t.hero.trust.map(([value, note], i) => (
                <article
                  key={value}
                  className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-ink-900/60 p-4 backdrop-blur-md transition-colors duration-500 hover:border-white/20"
                  style={{
                    transform: `translateY(${(1 - inCards) * (i + 1) * 18}px)`,
                    transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 500ms',
                  }}
                >
                  <span className="hud shrink-0 pt-1 tabular-nums text-amber/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-platinum">{value}</span>
                    <span className="mt-1 block text-xs text-silver/60">{note}</span>
                  </span>
                </article>
              ))}
            </div>

            <button
              onClick={() => scrollToId('works')}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-hud text-platinum transition-colors hover:border-acid/60 hover:text-acid focus-ring"
            >
              {t.hero.ctaWorks}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* --- scroll cue, only while the first beat is up --- */}
        <div
          aria-hidden="true"
          className={cn('absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500')}
          style={{ opacity: 1 - clamp01(p / 0.15) }}
        >
          <span className="flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-hud text-faint">
            {t.hero3d.scroll}
            <ArrowDown className="h-3.5 w-3.5 text-lavender/70" strokeWidth={1.5} />
          </span>
        </div>

        {/* the site's own background, so the hero is not a separate world */}
        <CyberBackground />
      </div>
    </section>
  );
}
