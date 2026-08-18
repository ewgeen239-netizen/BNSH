'use client';

import { useMemo, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { WorkCard } from './WorkCard';
import { WorkRail } from './WorkRail';
import { workFilters, type WorkCategory } from '@/lib/content';
import { useLang, useT, getWorks } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Filter = 'all' | WorkCategory;

export function SelectedWorks() {
  const { locale } = useLang();
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');

  const works = useMemo(() => getWorks(locale), [locale]);
  const filtered = useMemo(
    () => (filter === 'all' ? works : works.filter((w) => w.category === filter)),
    [filter, works],
  );

  return (
    <section id="works" className="relative scroll-mt-24 py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="Selected Works"
          title={t.works.title}
          intro={t.works.intro}
        />

        {/* filters — a console selector rather than pill buttons */}
        <Reveal delay={0.1} className="mt-6 sm:mt-10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {workFilters.map((f) => {
              const active = filter === f.id;
              const n = f.id === 'all' ? works.length : works.filter((w) => w.category === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'group relative inline-flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-300 focus-ring sm:px-3.5 sm:py-2 sm:text-[11px]',
                    active
                      ? 'border-gold/45 bg-gold/[0.08] text-gold-soft'
                      : 'border-white/[0.09] bg-white/[0.015] text-muted hover:border-white/25 hover:text-silver',
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full transition-colors duration-300',
                      active ? 'bg-gold-soft' : 'bg-white/20 group-hover:bg-white/40',
                    )}
                  />
                  {f.id === 'all' ? t.works.filterAll : f.label}
                  <span className="tabular-nums text-[9px] opacity-50 sm:text-[10px]">{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-14">
          <WorkRail
            items={filtered}
            getKey={(w) => w.slug}
            resetKey={filter}
            label={t.works.title}
            stageClassName="h-[452px] sm:h-[556px]"
            cardClassName="w-[300px] sm:w-[440px]"
            glowFor={(w) => `${w.accent[1]}22`}
            renderItem={(w, isCenter) => <WorkCard work={w} plain active={isCenter} />}
          />
        </div>
      </div>
    </section>
  );
}
