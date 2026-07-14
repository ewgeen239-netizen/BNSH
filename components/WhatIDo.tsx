'use client';

import { SectionHeading } from './SectionHeading';
import { RevealGroup } from './Reveal';
import { ServiceCard } from './ServiceCard';
import { services } from '@/lib/content';

export function WhatIDo() {
  return (
    <section id="services" className="relative scroll-mt-24 border-t border-white/[0.05] py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="What I Do"
          title="Что я делаю"
          intro="От простого лендинга до веб-приложения. Подбираю формат под задачу и веду проект от идеи до запуска."
        />

        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
