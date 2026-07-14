import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

export function Overline({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-overline text-gold-soft/80">
      <span className="h-px w-6 bg-gold/40" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeading({
  overline,
  title,
  intro,
  align = 'left',
  className,
}: {
  overline: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <Reveal>
        <Overline>{overline}</Overline>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-display-md font-semibold text-platinum">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-silver/80 sm:text-lg">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
