'use client';

import { SectionHeading } from './SectionHeading';
import { RevealGroup, RevealItem } from './Reveal';
import { Icon } from './icon';
import { advantages } from '@/lib/content';

export function Advantages() {
  return (
    <section className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="Advantages"
          title="Почему со мной удобно"
          intro="Работа без лишней бюрократии — с вниманием к результату и вашему времени."
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <RevealItem
              key={a.title}
              className="group flex flex-col bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-silver transition-colors duration-500 group-hover:border-gold/40 group-hover:text-gold-soft">
                <Icon name={a.icon} className="h-[18px] w-[18px]" />
              </div>
              <h3 className="text-sm font-semibold text-platinum">{a.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-silver/65">{a.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
