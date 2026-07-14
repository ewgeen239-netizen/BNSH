'use client';

import { Reveal } from './Reveal';
import { Overline } from './SectionHeading';
import { scrollToId } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const facts = [
  { k: 'Один специалист', v: 'веду проект лично' },
  { k: 'От идеи', v: 'до готового результата' },
  { k: 'Понятная', v: 'коммуникация без воды' },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:items-center">
          {/* Text */}
          <div className="lg:col-span-7">
            <Reveal>
              <Overline>About</Overline>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-display-md font-semibold text-platinum">
                Немного обо мне
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 max-w-prose space-y-4 text-base leading-relaxed text-silver/80">
                <p>
                  Я работаю один и лично веду каждый проект. Это значит, что вы
                  общаетесь напрямую с человеком, который делает сайт — без
                  посредников, менеджеров и потери смысла между этапами.
                </p>
                <p>
                  Фокус — на аккуратности, скорости и визуальном качестве. Мне
                  важно, чтобы результат выглядел дорого, работал быстро и решал
                  конкретную задачу бизнеса, а не просто «был красивым».
                </p>
                <p>
                  Без образа большой студии — но с профессиональным подходом:
                  понятные этапы, честные сроки и внимание к деталям на каждом шаге.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <button
                onClick={() => scrollToId('pricing')}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-platinum focus-ring rounded-full"
              >
                Посмотреть форматы и цены
                <ArrowRight className="h-4 w-4 text-gold-soft transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </button>
            </Reveal>
          </div>

          {/* Signature card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass sm:p-8">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.18),transparent_60%)] blur-2xl" />
                <span className="block font-display text-6xl italic tracking-[0.12em] text-gradient-gold">
                  BNSH
                </span>
                <span className="mt-3 block text-[11px] font-medium uppercase tracking-[0.34em] text-silver/70">
                  Personal Brand
                </span>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.28em] text-gold-soft/60">
                  Digital · Growth · Identity
                </span>

                <div className="mt-8 space-y-4">
                  {facts.map((f) => (
                    <div key={f.k} className="flex items-baseline gap-3 border-t border-white/[0.06] pt-4 first:border-0 first:pt-0">
                      <span className="text-sm font-medium text-platinum">{f.k}</span>
                      <span className="text-sm text-silver/70">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
