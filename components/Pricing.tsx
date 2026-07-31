'use client';

import { Info } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { PricingCard } from './PricingCard';
import { RoleCarousel } from './RoleCarousel';
import { useLang, useT, getPlans } from '@/lib/i18n';

/** Accent glow behind the stage — crossfades with the active plan. */
const GLOWS = ['rgba(91,141,239,0.13)', 'rgba(198,161,91,0.20)', 'rgba(124,140,255,0.13)'];

export function Pricing() {
  const { locale } = useLang();
  const t = useT();
  const plans = getPlans(locale);
  const featuredIndex = Math.max(0, plans.findIndex((p) => p.featured));

  return (
    <section id="pricing" className="relative scroll-mt-24 border-t border-white/[0.05] py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading overline="Pricing" title={t.pricing.title} intro={t.pricing.intro} />

        <div className="mt-10 sm:mt-14">
          <RoleCarousel
            items={plans}
            getKey={(p) => p.name}
            initialIndex={featuredIndex}
            resetKey={locale}
            label={t.pricing.title}
            stageClassName="h-[500px] sm:h-[600px]"
            cardClassName="w-[280px] sm:w-[380px]"
            showDots
            glowFor={(_p, i) => GLOWS[i % GLOWS.length]}
            renderItem={(p) => <PricingCard plan={p} className="w-full" />}
          />
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-silver/70 sm:mt-10 sm:p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft/80" strokeWidth={1.75} />
            <p>{t.pricing.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
