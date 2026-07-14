'use client';

import { Info } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, RevealGroup } from './Reveal';
import { PricingCard } from './PricingCard';
import { plans, pricingNote } from '@/lib/content';

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 border-t border-white/[0.05] py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="Pricing"
          title="Форматы и цены"
          intro="Три понятных формата под разные задачи. Цены — ориентир, чтобы вы понимали порядок."
        />

        <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-3" stagger={0.1}>
          {plans.map((p) => (
            <PricingCard key={p.name} plan={p} />
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-silver/70 sm:mt-10 sm:p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft/80" strokeWidth={1.75} />
            <p>{pricingNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
