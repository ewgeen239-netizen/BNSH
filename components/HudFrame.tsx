'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

/**
 * The quiet instrument layer: a scroll-progress seam along the top and one
 * status pill at the bottom. It used to be a full machined frame; with the
 * hero's soft, floating language now driving the whole site, everything that
 * boxed the page in has gone and only the readouts remain.
 *
 * The timestamp is mounted-only (never rendered on the server) because its
 * value depends on the clock and would otherwise mismatch on hydration.
 */
export function HudFrame() {
  const t = useT();
  const [stamp, setStamp] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      // Same month and day, three millennia on.
      setStamp(`3089.${p(d.getMonth() + 1)}.${p(d.getDate())}`);
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      {/* scroll progress */}
      <span
        className="absolute left-0 top-0 h-[2px] bg-neon shadow-[0_0_12px_rgba(201,164,255,0.7)] transition-[width] duration-150 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />

      {/* status pill */}
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-hud text-faint backdrop-blur-md sm:flex">
        <span className="h-1 w-1 rounded-full bg-neon animate-pulse-dot" />
        {t.hud.node}
        <span className="h-3 w-px bg-white/10" />
        <span className="tabular-nums">{stamp}</span>
        <span className="h-3 w-px bg-white/10" />
        <span className="tabular-nums text-silver/70">
          {String(Math.round(progress * 100)).padStart(3, '0')}%
        </span>
      </div>
    </div>
  );
}
