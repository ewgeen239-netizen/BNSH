'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import type { Work } from '@/lib/content';
import { useT } from '@/lib/i18n';
import { cn, scrollToId } from '@/lib/utils';

/**
 * The archive stage.
 *
 * Instead of a grid the visitor scrolls past, one project is always on screen
 * at full size and the rest are a numbered index beside it. Hovering a row
 * swaps the stage; it also advances on its own, so the section is already
 * moving when you arrive at it. The glitch between projects is a 240ms RGB
 * split over the outgoing frame — enough to read as a channel change without
 * turning into a transition you have to wait out.
 *
 * Both layers of imagery stay mounted (the previous and the current), which
 * is why a fast run down the index does not flash black.
 */

const DWELL = 5200; // ms a project holds the stage on auto-advance
const GLITCH = 240;

export function WorkStage({ items }: { items: Work[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0); // 0..1 dwell progress of the active row

  const hoverRef = useRef(false);
  const tickRef = useRef(0);
  const reduceRef = useRef(false);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const count = items.length;
  const work = items[Math.min(active, count - 1)];
  const previous = prev !== null ? items[prev] : null;

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceRef.current) setPlaying(false);
  }, []);

  // A filter change re-slices the list — start over from the top of it.
  useEffect(() => {
    setActive(0);
    setPrev(null);
    startRef.current = performance.now();
  }, [count]);

  const go = useCallback(
    (next: number) => {
      setActive((cur) => {
        if (next === cur) return cur;
        setPrev(cur);
        return ((next % count) + count) % count;
      });
      startRef.current = performance.now();
    },
    [count],
  );

  // Clear the outgoing layer once the glitch is over.
  useEffect(() => {
    if (prev === null) return;
    const id = window.setTimeout(() => setPrev(null), GLITCH + 260);
    return () => window.clearTimeout(id);
  }, [prev, active]);

  /* ---------------------------- auto-advance ---------------------------- */

  useEffect(() => {
    if (!playing || count < 2) {
      setTick(0);
      return;
    }
    startRef.current = performance.now();

    const frame = (now: number) => {
      if (hoverRef.current || document.hidden) {
        // Paused: hold the bar where it is and keep the clock from running on.
        startRef.current = now - tickRef.current * DWELL;
      } else {
        const p = Math.min(1, (now - startRef.current) / DWELL);
        tickRef.current = p;
        setTick(p);
        if (p >= 1) {
          go(active + 1);
          startRef.current = now;
          tickRef.current = 0;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, count, active, go]);

  /* ------------------------------ keyboard ------------------------------ */

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setPlaying(false);
      go(active + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setPlaying(false);
      go(active - 1);
    }
  }

  if (!work) return null;
  const accent = work.accent[1];

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1fr_minmax(16rem,22rem)] lg:gap-8"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      style={{ ['--a' as string]: accent }}
    >
      {/* ------------------------------ stage ------------------------------ */}
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="carousel"
        aria-label={t.archive.overline}
        className="group notch relative aspect-[4/5] overflow-hidden border border-white/[0.09] bg-ink-900 outline-none focus-visible:border-neon/50 sm:aspect-[16/10] lg:aspect-auto lg:h-[min(72vh,620px)]"
      >
        {/* accent bloom behind the frame */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 transition-[background] duration-700"
          style={{
            background: `radial-gradient(120% 120% at 15% 0%, ${accent}22, transparent 55%), linear-gradient(160deg, ${work.accent[0]}, #04060A 70%)`,
          }}
        />

        {/* outgoing frame — kept for the length of the glitch */}
        {previous?.image && (
          <Image
            key={`prev-${previous.slug}`}
            src={previous.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-top"
            aria-hidden="true"
          />
        )}

        {work.image ? (
          <Image
            key={work.slug}
            src={work.image}
            alt={`${work.title} — ${work.type}`}
            fill
            priority={active === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="animate-fade-in object-cover object-top transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
          />
        ) : (
          /* No screen of its own (the Telegram bot) — draw its terminal. */
          <div className="absolute inset-0 flex flex-col justify-center gap-3 p-8 font-mono text-[11px] leading-relaxed text-white/45 sm:p-12 sm:text-xs">
            <span className="text-white/25">$ webhook --status</span>
            <span style={{ color: accent }}>● listening /api/telegram</span>
            <span className="text-white/25">$ uptime</span>
            <span className="text-white/40">99.9% · serverless</span>
            <span className="mt-4 text-white/25">{t.archive.noPreview}</span>
          </div>
        )}

        {/* the channel-change glitch */}
        {prev !== null && (
          <span
            key={`glitch-${active}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,61,138,0.22), transparent 30%, transparent 70%, rgba(40,224,240,0.22))',
              animation: `glitch-x ${GLITCH}ms steps(2, end) 1, fade-in ${GLITCH}ms reverse forwards`,
            }}
          />
        )}

        {/* treatment: scanlines, grid, grain, vignette */}
        <div aria-hidden="true" className="scanlines absolute inset-0 z-10 opacity-[0.18] mix-blend-overlay" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-grid-faint bg-[size:48px_48px] opacity-40 mix-blend-overlay"
        />
        <div aria-hidden="true" className="grain absolute inset-0 z-10 opacity-[0.07]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(4,6,10,0.96)_2%,rgba(4,6,10,0.25)_38%,transparent_65%)]"
        />

        {/* power-on hairline */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-30 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />

        {/* HUD — top */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 sm:p-5">
          <span className="hud flex items-center gap-2 text-silver/70">
            <span className="h-px w-5" style={{ background: accent }} />
            {work.slug}
          </span>
          <span className="flex items-center gap-2.5">
            {work.live && (
              <span className="hud flex items-center gap-1.5 border border-white/10 bg-ink-950/70 px-2 py-1 text-platinum/90 backdrop-blur">
                <span className="h-1 w-1 rounded-full animate-pulse-dot" style={{ background: accent }} />
                {t.common.live}
              </span>
            )}
            <span className="hud tabular-nums text-silver/70">{work.year}</span>
          </span>
        </div>

        {/* HUD — bottom: the project itself */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6">
          <span className="hud block text-silver/70">{work.type}</span>
          <h3 className="mt-2 font-display text-2xl font-bold leading-none tracking-tightest text-platinum sm:text-4xl">
            {work.title}
          </h3>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-silver/75 sm:text-sm">
            {work.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
            {work.href ? (
              <a
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="notch-sm inline-flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-hud text-ink-950 transition-opacity duration-300 hover:opacity-90 focus-ring"
                style={{ background: accent, borderColor: accent }}
              >
                {t.archive.openLive}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            ) : (
              <span className="hud border border-white/12 px-3 py-2 text-silver/70">
                {t.works.exampleNote}
              </span>
            )}

            <button
              onClick={() => scrollToId(`dossier-${work.slug}`)}
              className="hud border-b border-transparent pb-0.5 text-silver/80 transition-colors duration-300 hover:border-neon/50 hover:text-neon-soft focus-ring"
            >
              {t.archive.builtIn} ↓
            </button>

            <span className="ml-auto hidden items-center gap-1.5 sm:flex">
              {work.stack.map((s) => (
                <span key={s} className="hud border border-white/10 bg-ink-950/50 px-2 py-1 text-muted backdrop-blur">
                  {s}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------ index ------------------------------ */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3 pb-2">
          <span className="hud">
            {t.archive.indexLabel}{' '}
            <span className="tabular-nums text-neon-soft">{String(active + 1).padStart(2, '0')}</span>
            <span className="text-white/20"> / </span>
            <span className="tabular-nums">{String(count).padStart(2, '0')}</span>
          </span>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="hud inline-flex items-center gap-1.5 border border-white/10 px-2 py-1 text-muted transition-colors hover:border-neon/40 hover:text-neon-soft focus-ring"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-3 w-3" strokeWidth={2} /> : <Play className="h-3 w-3" strokeWidth={2} />}
            {playing ? 'auto' : 'hold'}
          </button>
        </div>

        <ul className="no-scrollbar flex max-h-none snap-x gap-2 overflow-x-auto border-t border-white/[0.07] pt-2 lg:max-h-[min(72vh,620px)] lg:snap-none lg:flex-col lg:gap-0 lg:overflow-y-auto lg:pt-0">
          {items.map((w, i) => {
            const on = i === active;
            return (
              <li key={w.slug} className="shrink-0 snap-start lg:w-full lg:shrink">
                <button
                  onMouseEnter={() => go(i)}
                  onFocus={() => go(i)}
                  onClick={() => {
                    setPlaying(false);
                    go(i);
                  }}
                  aria-current={on}
                  className={cn(
                    'group relative flex w-[13.5rem] items-start gap-3 border-b border-white/[0.06] px-3 py-3 text-left transition-colors duration-300 focus-ring lg:w-full',
                    on ? 'bg-white/[0.035]' : 'hover:bg-white/[0.02]',
                  )}
                >
                  {/* active marker */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-px transition-all duration-300"
                    style={{ background: on ? w.accent[1] : 'transparent' }}
                  />

                  <span
                    className={cn(
                      'hud shrink-0 pt-0.5 tabular-nums transition-colors duration-300',
                      on ? 'text-neon-soft' : 'text-faint group-hover:text-silver',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'glitch-text block truncate font-mono text-[12px] uppercase tracking-[0.1em] transition-colors duration-300',
                        on ? 'text-platinum' : 'text-silver/70 group-hover:text-platinum',
                      )}
                      data-glitch={on ? '1' : undefined}
                    >
                      {w.title}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-faint">{w.type}</span>

                    {/* dwell bar — only under the row that holds the stage */}
                    {on && playing && (
                      <span aria-hidden="true" className="mt-2 block h-px w-full bg-white/10">
                        <span
                          className="block h-px"
                          style={{ width: `${tick * 100}%`, background: w.accent[1] }}
                        />
                      </span>
                    )}
                  </span>

                  {w.live && (
                    <span
                      aria-hidden="true"
                      className={cn('mt-1.5 h-1 w-1 shrink-0 rounded-full transition-opacity', on ? 'opacity-100' : 'opacity-40')}
                      style={{ background: w.accent[1] }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="hud mt-3 hidden leading-relaxed lg:block">{t.archive.hint}</p>
      </div>
    </div>
  );
}
