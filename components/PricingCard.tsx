'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { Plan } from '@/lib/content';

export function PricingCard({ plan, className }: { plan: Plan; className?: string }) {
  const t = useT();
  return (
    <motion.div
      data-card
      data-featured={plan.featured ? 'true' : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-3xl border p-6 sm:p-8',
        className,
        plan.featured
          ? 'border-gold/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-gold'
          : 'border-white/[0.08] bg-white/[0.02] shadow-glass hover:border-white/[0.16]',
      )}
    >
      {plan.featured && (
        <>
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.22),transparent_60%)] blur-2xl" />
          <span className="absolute right-6 top-6 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold-soft">
            {t.pricing.popular}
          </span>
        </>
      )}

      <h3 className="text-lg font-semibold text-platinum">{plan.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver/70 sm:min-h-[2.5rem]">
        {plan.audience}
      </p>

      <div className="mt-4 sm:mt-6">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium',
            plan.featured
              ? 'border-gold/30 bg-gold/[0.08] text-gold-soft'
              : 'border-white/12 bg-white/[0.03] text-platinum',
          )}
        >
          {t.pricing.byTask}
        </span>
      </div>

      <ul className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-silver/85">
            <span
              className={cn(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
                plan.featured ? 'bg-gold/15 text-gold-soft' : 'bg-white/[0.05] text-silver',
              )}
            >
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => scrollToId('contact')}
        className={cn(
          'mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold transition focus-ring sm:mt-8',
          plan.featured
            ? 'bg-platinum text-ink-950 hover:bg-white'
            : 'border border-white/12 bg-white/[0.03] text-platinum hover:border-gold/40 hover:bg-white/[0.06]',
        )}
      >
        {t.common.discuss}
      </button>
    </motion.div>
  );
}
