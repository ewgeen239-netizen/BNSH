'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { WorkCard } from './WorkCard';
import { works, workFilters, type WorkCategory } from '@/lib/content';
import { cn } from '@/lib/utils';

type Filter = 'all' | WorkCategory;

export function SelectedWorks() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? works : works.filter((w) => w.category === filter)),
    [filter],
  );

  return (
    <section id="works" className="relative scroll-mt-24 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="Selected Works"
          title="Мои работы"
          intro="Подборка сайтов и приложений. Каждый проект — отдельная задача бизнеса и аккуратно собранное решение под неё."
        />

        {/* filters */}
        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap gap-2">
            {workFilters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-ring',
                    active
                      ? 'border-transparent bg-platinum text-ink-950'
                      : 'border-white/10 bg-white/[0.02] text-silver hover:border-white/20 hover:text-platinum',
                  )}
                  aria-pressed={active}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* grid */}
        <LayoutGroup>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((w) => (
                <WorkCard key={w.slug} work={w} />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
