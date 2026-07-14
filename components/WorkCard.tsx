'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Work } from '@/lib/content';

export function WorkCard({ work }: { work: Work }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] shadow-glass transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-glass-hover"
    >
      {/* Showcase visual (placeholder). Swap for a real screenshot: put an
          <Image/> here and remove the gradient block. */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          style={{
            background: `radial-gradient(120% 120% at 20% 10%, ${work.accent[1]}33, transparent 55%), linear-gradient(135deg, ${work.accent[0]}, #050505 75%)`,
          }}
        />
        {/* faux window chrome for a product-shot feel */}
        <div className="absolute inset-x-5 top-5 flex items-center gap-1.5 opacity-70">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="absolute inset-x-5 bottom-5 space-y-2">
          <div className="h-2 w-2/3 rounded-full bg-white/15" />
          <div className="h-2 w-1/2 rounded-full bg-white/10" />
        </div>
        {/* grain + sheen */}
        <div className="grain absolute inset-0 opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.6),transparent_45%)]" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-overline text-gold-soft/80">
            {work.type}
          </span>
          <span className="text-xs text-faint">{work.year}</span>
        </div>

        <h3 className="mt-3 text-xl font-semibold text-platinum">{work.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-silver/75">{work.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {work.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-muted"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-sm font-medium text-silver transition-colors group-hover:text-platinum">
            Подробнее
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-silver transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:text-gold-soft">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
