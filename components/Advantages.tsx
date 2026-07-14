'use client';

import { SectionHeading } from './SectionHeading';
import { RevealGroup, RevealItem } from './Reveal';
import { Icon } from './icon';
import { advantages } from '@/lib/content';

export function Advantages() {
  return (
    <section className="relative scroll-mt-24 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="Advantages"
          title="Почему со мной удобно"
          intro="Работа без лишней бюрократии — с вниманием к результату и вашему времени."
        />

        <RevealGroup className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.05] sm:mt-12 lg:grid-cols-4">
          {advantages.map((a) => (
            <RevealItem
              key={a.title}
              className="group flex flex-col bg-ink-950 p-4 transition-colors duration-500 hover:bg-ink-900 sm:p-6"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-silver transition-colors duration-500 group-hover:border-gold/40 group-hover:text-gold-soft sm:mb-4 sm:h-10 sm:w-10">
                <Icon name={a.icon} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <h3 className="text-[13px] font-semibold text-platinum sm:text-sm">{a.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-silver/65 sm:mt-2 sm:text-[13px]">{a.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
