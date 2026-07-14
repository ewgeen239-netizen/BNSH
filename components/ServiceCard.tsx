'use client';

import { Icon } from './icon';
import { RevealItem } from './Reveal';
import type { Service } from '@/lib/content';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <RevealItem className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.035] sm:p-6">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-850 text-silver transition-all duration-500 group-hover:border-gold/40 group-hover:text-gold-soft sm:mb-5">
        <Icon name={service.icon} className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-platinum">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver/70">{service.description}</p>
      {/* subtle corner sheen */}
      <span className="pointer-events-none absolute right-5 top-5 h-8 w-8 rounded-full bg-gold/0 blur-xl transition-all duration-500 group-hover:bg-gold/20" />
    </RevealItem>
  );
}
