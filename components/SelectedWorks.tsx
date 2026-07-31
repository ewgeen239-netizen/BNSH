'use client';

import { useMemo, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { WorkCard } from './WorkCard';
import { RoleCarousel } from './RoleCarousel';
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

        {/* filters */}
        <Reveal delay={0.1} className="mt-6 sm:mt-10">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {workFilters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 focus-ring sm:px-4 sm:py-2 sm:text-sm',
                    active
                      ? 'border-transparent bg-platinum text-ink-950'
                      : 'border-white/10 bg-white/[0.02] text-silver hover:border-white/20 hover:text-platinum',
                  )}
                  aria-pressed={active}
                >
                  {f.id === 'all' ? t.works.filterAll : f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-12">
          <RoleCarousel
            items={filtered}
            getKey={(w) => w.slug}
            resetKey={filter}
            label={t.works.title}
            stageClassName="h-[430px] sm:h-[600px]"
            cardClassName="w-[286px] sm:w-[420px]"
            showCounter
            glowFor={(w) => `${w.accent[1]}26`}
            renderItem={(w) => <WorkCard work={w} plain />}
          />
        </div>
      </div>
    </section>
  );
}
