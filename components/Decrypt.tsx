'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const NOISE = '01/\\|<>+=*#{}[]%&';

/**
 * Text that resolves out of noise, left to right, once it is on screen.
 * The whole site's "decryption" motif in one small component.
 *
 * Characters settle one by one; everything not settled yet is re-rolled on
 * each tick, which is what makes it read as a stream being decoded rather
 * than as a typewriter. Spaces are never scrambled so the word shape — and
 * therefore the layout — stays stable while it resolves.
 */
export function Decrypt({
  text,
  className,
  /** ms between ticks; lower is faster and noisier. */
  speed = 28,
  /** ms before it starts, once visible. */
  delay = 0,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);
  const [armed, setArmed] = useState(false);

  // Only start when scrolled into view — a decrypt nobody saw is wasted.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    let settled = 0;
    let timer = 0;

    const noise = (from: number) =>
      text
        .split('')
        .map((ch, i) => {
          if (ch === ' ' || ch === '\u00a0') return ch;
          if (i < from) return ch;
          return NOISE[(Math.random() * NOISE.length) | 0];
        })
        .join('');

    // Go to noise immediately so the text is never briefly readable first.
    setOut(noise(0));

    const start = window.setTimeout(() => {
      const tick = () => {
        settled += 1;
        setOut(noise(settled));
        if (settled <= text.length) timer = window.setTimeout(tick, speed);
      };
      tick();
    }, delay);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(timer);
    };
  }, [armed, text, speed, delay]);

  return (
    <Tag ref={ref as never} className={cn(armed && 'tabular-nums', className)}>
      {armed ? out : text}
    </Tag>
  );
}
