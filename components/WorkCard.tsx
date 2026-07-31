'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Work } from '@/lib/content';
import { useT } from '@/lib/i18n';

export function WorkCard({ work, plain = false }: { work: Work; plain?: boolean }) {
  const t = useT();
  // `plain` renders a static card — used inside the carousel, where the stage
  // owns the transforms and a nested layout animation would fight them.
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
  return (
    <motion.article
      {...motionProps}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-glass transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-glass-hover sm:rounded-3xl"
    >
      {/* Whole-card link for real, published projects */}
      {work.href && (
        <a
          href={work.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20 focus-ring rounded-2xl sm:rounded-3xl"
          aria-label={`${work.title} — ${t.common.details}`}
        />
      )}

      {/* Showcase visual (placeholder). Swap for a real screenshot: put an
          <Image/> here and remove the gradient block. */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {work.live && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-ink-950/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-soft backdrop-blur sm:right-4 sm:top-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
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
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 380px"
            className="object-cover object-top transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
          />
        ) : work.live ? (
          /* Real project without a screenshot (e.g. the Telegram bot) */
          <>
            <div className="absolute inset-x-4 top-4 flex items-center gap-1.5 opacity-70 sm:inset-x-5 sm:top-5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/20 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20 sm:h-2 sm:w-2" />
            </div>
            <div className="absolute inset-x-4 bottom-4 space-y-1.5 sm:inset-x-5 sm:bottom-5 sm:space-y-2">
              <div className="h-1.5 w-2/3 rounded-full bg-white/15 sm:h-2" />
              <div className="h-1.5 w-1/2 rounded-full bg-white/10 sm:h-2" />
            </div>
          </>
        ) : (
          /* Template / concept — no photo, just a clear "example" note */
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-ink-950/50 px-3.5 py-2 text-[11px] font-medium leading-tight text-gold-soft/90 backdrop-blur sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {t.works.exampleNote}
            </span>
          </div>
        )}

        {/* grain + sheen */}
        <div className="grain absolute inset-0 opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.55),transparent_50%)]" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-overline text-gold-soft/80 sm:text-[11px]">
            {work.type}
          </span>
          <span className="text-[11px] text-faint sm:text-xs">{work.year}</span>
        </div>

        <h3 className="mt-2 text-base font-semibold text-platinum sm:mt-3 sm:text-xl">{work.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-silver/75 sm:mt-2 sm:line-clamp-none sm:text-sm">
          {work.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5">
          {work.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] text-muted sm:px-2.5 sm:py-1 sm:text-[11px]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 sm:mt-6 sm:pt-4">
          <span className="text-xs font-medium text-silver transition-colors group-hover:text-platinum sm:text-sm">
            {t.common.details}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-silver transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:text-gold-soft sm:h-9 sm:w-9">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
