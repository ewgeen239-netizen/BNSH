'use client';

import { useMemo, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { WorkStage } from './WorkStage';
import { workFilters, type WorkCategory } from '@/lib/content';
import { useLang, useT, getWorks } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Filter = 'all' | WorkCategory;

/**
 * The archive section. The works are not a grid you scroll past: one project
 * holds a near-full-height stage while the rest sit beside it as an index, and
 * the stage is already cycling by the time you arrive. The filters above it
 * read as channel selectors on an instrument.
 */
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
    <section id="works" className="relative scroll-mt-24 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading overline={t.archive.overline} title={t.works.title} intro={t.works.intro} />

        <Reveal delay={0.1} className="mt-7 sm:mt-10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {workFilters.map((f) => {
              const active = filter === f.id;
              const n = f.id === 'all' ? works.length : works.filter((w) => w.category === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  disabled={n === 0}
                  className={cn(
                    'group inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-hud transition-colors duration-300 focus-ring disabled:opacity-30 sm:px-3.5 sm:py-2',
                    active
                      ? 'border-neon/45 bg-neon/[0.08] text-neon-soft'
                      : 'border-white/[0.09] bg-white/[0.015] text-muted hover:border-white/25 hover:text-silver',
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      'h-1 w-1 transition-colors duration-300',
                      active ? 'bg-neon-soft' : 'bg-white/20 group-hover:bg-white/40',
                    )}
                  />
                  {f.id === 'all' ? t.works.filterAll : f.label}
                  <span className="tabular-nums text-[9px] opacity-50">{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-6 sm:mt-10">
          <WorkStage key={filter} items={filtered} />
        </div>
      </div>
    </section>
  );
}
