'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { PricingCard } from './PricingCard';
import { RoleCarousel } from './RoleCarousel';
import { useLang, useT, getPlans } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Accent glow behind the stage — crossfades with the active plan. */
const GLOWS = ['rgba(91,141,239,0.13)', 'rgba(198,161,91,0.20)', 'rgba(124,140,255,0.13)'];

export function Pricing() {
  const { locale } = useLang();
  const t = useT();
  const plans = getPlans(locale);

  const featuredIndex = Math.max(0, plans.findIndex((p) => p.featured));
  const [active, setActive] = useState(featuredIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ---------------- mobile swipe track ---------------- */

  function cardCenterLeft(el: HTMLDivElement, card: HTMLElement) {
    return Math.max(0, card.offsetLeft - (el.clientWidth - card.clientWidth) / 2);
  }

  // Start the mobile track centered on the popular card.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      const featured = el.querySelector<HTMLElement>('[data-featured="true"]');
      if (featured && featured.clientWidth > 0) {
        el.scrollTo({ left: cardCenterLeft(el, featured), behavior: 'auto' });
        setActive(featuredIndex);
      }
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  function onScroll() {
    const el = trackRef.current;
    // The track is `lg:hidden`; a hidden element still emits a reset scroll
    // event, which would otherwise clobber the desktop carousel's index.
    if (!el || el.clientWidth === 0) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'));
    let idx = 0;
    let best = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    setActive(idx);
  }

  function goTo(i: number) {
    const el = trackRef.current;
    const card = el?.querySelectorAll<HTMLElement>('[data-card]')[i];
    if (el && card) el.scrollTo({ left: cardCenterLeft(el, card), behavior: 'smooth' });
  }

  return (
    <section id="pricing" className="relative scroll-mt-24 border-t border-white/[0.05] py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading overline="Pricing" title={t.pricing.title} intro={t.pricing.intro} />

        {/* ---------- Mobile: swipeable snap track ---------- */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className={cn(
            '-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mt-12',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden',
          )}
          role="group"
          aria-roledescription="carousel"
          aria-label={t.pricing.title}
        >
          {plans.map((p) => (
            <PricingCard
              key={p.name}
              plan={p}
              className="w-[85%] max-w-sm shrink-0 snap-center sm:w-[70%]"
            />
          ))}
        </div>

        {/* Dots — mobile only */}
        <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
          {plans.map((p, i) => (
            <button
              key={p.name}
              onClick={() => goTo(i)}
              aria-label={p.name}
              aria-current={i === active}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 focus-ring',
                i === active ? 'w-6 bg-gold-soft' : 'w-1.5 bg-white/20 hover:bg-white/40',
              )}
            />
          ))}
        </div>

        {/* ---------- Desktop: role-based carousel ---------- */}
        <div className="mt-14 hidden lg:block">
          <RoleCarousel
            items={plans}
            getKey={(p) => p.name}
            initialIndex={featuredIndex}
            resetKey={locale}
            label={t.pricing.title}
            cardWidth={380}
            height={580}
            glowFor={(_p, i) => GLOWS[i % GLOWS.length]}
            renderItem={(p) => <PricingCard plan={p} className="w-full" />}
          />
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-silver/70 sm:mt-10 sm:p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft/80" strokeWidth={1.75} />
            <p>{t.pricing.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
