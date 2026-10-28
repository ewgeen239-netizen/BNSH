import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

export function Overline({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-hud text-neon-soft/80">
      <span className="h-1 w-1 rounded-full bg-neon animate-pulse-dot" aria-hidden="true" />
      <span className="h-px w-5 bg-neon/40" aria-hidden="true" />
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
        <h2 className="mt-5 font-display text-display-md font-bold tracking-tightest text-platinum">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-sm leading-relaxed text-silver/75 sm:text-base">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
