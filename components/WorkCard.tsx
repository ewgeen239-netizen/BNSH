'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Work } from '@/lib/content';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * A card built to read as an instrument panel rather than a blog tile:
 * hairline frame, corner brackets, monospaced telemetry, and a pointer-tracked
 * sheen. The project's own accent colour is injected as `--a` so every accent
 * on the card — bracket, hairline, glow, hover ring — comes from one source.
 */
export function WorkCard({
  work,
  plain = false,
  active = true,
}: {
  work: Work;
  plain?: boolean;
  active?: boolean;
}) {
  const t = useT();
  const ref = useRef<HTMLElement>(null);

  // `plain` renders a static card — used inside the rail, where the stage owns
  // the transforms and a nested layout animation would fight them.
  const motionProps = plain
    ? {}
    : {
        layout: true as const,
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        exit: { opacity: 0, y: 12 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  /** Track the pointer so the sheen follows it across the card. */
  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <motion.article
      ref={ref}
      {...motionProps}
      onMouseMove={onMove}
      style={{ '--a': work.accent[1] } as React.CSSProperties}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-ink-900/80 backdrop-blur-sm',
        'transition-[border-color,box-shadow,transform] duration-500 ease-premium sm:rounded-2xl',
        active
          ? 'border-white/[0.12] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] hover:-translate-y-1 hover:border-[color:var(--a)]/45'
          : 'border-white/[0.06] shadow-none',
      )}
    >
      {/* accent hairline along the top edge — the card's "power on" line */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-30 h-px opacity-70"
        style={{ background: 'linear-gradient(to right, transparent, var(--a), transparent)' }}
      />

      {/* corner brackets */}
      {(['left-2 top-2 border-l border-t', 'right-2 top-2 border-r border-t', 'left-2 bottom-2 border-b border-l', 'right-2 bottom-2 border-b border-r'] as const).map(
        (pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute z-30 h-3 w-3 border-white/20 transition-colors duration-500 sm:h-3.5 sm:w-3.5',
              'group-hover:border-[color:var(--a)]',
              pos,
            )}
          />
        ),
      )}

      {/* pointer-tracked sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.07), transparent 65%)' }}
      />

      {/* Whole-card link for real, published projects */}
      {work.href && (
        <a
          href={work.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-40 rounded-xl focus-ring sm:rounded-2xl"
          aria-label={`${work.title} — ${t.common.details}`}
        />
      )}

      <div className="relative aspect-[16/10] overflow-hidden">
        {work.live && (
          <span className="absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded border border-white/10 bg-ink-950/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-platinum/90 backdrop-blur sm:right-3.5 sm:top-3.5 sm:text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: 'var(--a)' }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: 'var(--a)' }} />
            </span>
            {t.common.live}
          </span>
        )}

        {/* base fill (also the tint behind a loading image) */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 120% at 20% 10%, ${work.accent[1]}33, transparent 55%), linear-gradient(135deg, ${work.accent[0]}, #050505 75%)`,
          }}
        />

        {work.image ? (
          /* Real project screenshot */
          <Image
            src={work.image}
            alt={`${work.title} — ${work.type}`}
            fill
            sizes="(max-width: 640px) 80vw, 460px"
            className="object-cover object-top transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
          />
        ) : work.live ? (
          /* Real project with no screen of its own (e.g. the Telegram bot) —
             draw a terminal instead of pretending there is a UI to show. */
          <div className="absolute inset-0 flex flex-col justify-center gap-2 p-5 font-mono text-[10px] leading-relaxed text-white/45 sm:gap-2.5 sm:p-7 sm:text-[11px]">
            <span className="text-white/25">$ webhook --status</span>
            <span style={{ color: 'var(--a)' }}>● listening /api/telegram</span>
            <span className="text-white/25">$ uptime</span>
            <span className="text-white/40">99.9% · serverless</span>
          </div>
        ) : (
          /* Template / concept — no photo, just a clear "example" note */
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <span className="inline-flex items-center gap-2 rounded border border-white/12 bg-ink-950/60 px-3 py-2 font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-silver/85 backdrop-blur sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--a)' }} strokeWidth={1.75} />
              {t.works.exampleNote}
            </span>
          </div>
        )}

        {/* scanlines + grain + bottom fade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)' }}
        />
        <div className="grain absolute inset-0 opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#080808,transparent_55%)]" />
      </div>

      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        {/* telemetry row */}
        <div className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-faint sm:text-[10px]">
          <span className="h-px w-4 shrink-0" style={{ background: 'var(--a)' }} />
          <span className="truncate text-silver/70">{work.type}</span>
          <span className="ml-auto shrink-0 tabular-nums">{work.year}</span>
        </div>

        <h3 className="mt-2.5 text-lg font-semibold leading-tight tracking-tight text-platinum sm:mt-3 sm:text-2xl">
          {work.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-silver/70 sm:text-[13px]">
          {work.description}
        </p>

        <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-4">
          {work.stack.map((s) => (
            <span
              key={s}
              className="rounded border border-white/[0.08] bg-white/[0.02] px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-muted sm:text-[10px]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 sm:pt-5">
          <span
            aria-hidden="true"
            className="h-px flex-1 opacity-40"
            style={{ background: 'linear-gradient(to right, var(--a), transparent)' }}
          />
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-silver transition-colors duration-300 group-hover:text-platinum sm:text-[11px]">
            {t.common.details}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
