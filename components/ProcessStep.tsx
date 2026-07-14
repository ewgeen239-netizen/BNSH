'use client';

import { RevealItem } from './Reveal';
import type { Step } from '@/lib/content';

export function ProcessStep({ step, last }: { step: Step; last?: boolean }) {
  return (
    <RevealItem className="relative flex gap-5 pb-10 last:pb-0">
      {/* connector line */}
      {!last && (
        <span
          className="absolute left-[19px] top-11 bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-ink-900 text-[13px] font-semibold text-gold-soft">
        {step.n}
      </div>

      <div className="pt-1.5">
        <h3 className="text-base font-semibold text-platinum">{step.title}</h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-silver/70">{step.text}</p>
      </div>
    </RevealItem>
  );
}
