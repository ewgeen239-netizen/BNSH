'use client';

import { SectionHeading } from './SectionHeading';
import { RevealGroup } from './Reveal';
import { ProcessStep } from './ProcessStep';
import { useLang, useT, getSteps } from '@/lib/i18n';

export function Process() {
  const { locale } = useLang();
  const t = useT();
  const steps = getSteps(locale);
  return (
    <section id="process" className="relative scroll-mt-24 border-t border-white/[0.05] py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                overline="Process"
                title={t.process.title}
                intro={t.process.intro}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <RevealGroup className="max-w-xl">
              {steps.map((s, i) => (
                <ProcessStep key={s.n} step={s} last={i === steps.length - 1} />
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
