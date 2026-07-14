'use client';

import { SectionHeading } from './SectionHeading';
import { RevealGroup } from './Reveal';
import { ServiceCard } from './ServiceCard';
import { services } from '@/lib/content';

export function WhatIDo() {
  return (
    <section id="services" className="relative scroll-mt-24 border-t border-white/[0.05] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          overline="What I Do"
          title="Что я делаю"
          intro="От простого лендинга до веб-приложения. Подбираю формат под задачу и веду проект от идеи до запуска."
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
