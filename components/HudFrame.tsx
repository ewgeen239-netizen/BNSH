'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

/**
 * The cockpit the whole site is viewed through: hairline edges, corner
 * brackets, a scroll-progress seam along the top and vertical telemetry down
 * both sides. Everything here is decoration — it never takes pointer events,
 * and it is hidden from assistive tech.
 *
 * The clock is mounted-only (never rendered on the server) because its value
 * differs every second and would otherwise mismatch on hydration.
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
      setStamp(`3089.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
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
      {/* scroll progress — the only moving part of the frame */}
      <span
        className="absolute left-0 top-0 h-[2px] bg-neon shadow-[0_0_10px_rgba(40,224,240,0.7)] transition-[width] duration-150 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />

      {/* edge hairlines */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />
      <span className="absolute inset-y-0 left-0 w-px bg-white/[0.05]" />
      <span className="absolute inset-y-0 right-0 w-px bg-white/[0.05]" />

      {/* corner brackets */}
      {(
        [
          'left-2 top-2 border-l border-t',
          'right-2 top-2 border-r border-t',
          'left-2 bottom-2 border-b border-l',
          'right-2 bottom-2 border-b border-r',
        ] as const
      ).map((pos) => (
        <span key={pos} className={`absolute h-3 w-3 border-neon/40 ${pos}`} />
      ))}

      {/* left rail — system id */}
      <span
        className="absolute left-[14px] top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-faint/70 xl:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        {t.hud.sys} · {t.hud.node}
      </span>

      {/* right rail — depth into the archive */}
      <span
        className="absolute right-[14px] top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-faint/70 xl:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        {t.hud.archive} {String(Math.round(progress * 100)).padStart(3, '0')}%
      </span>

      {/* bottom status bar */}
      <div className="absolute inset-x-0 bottom-0 hidden items-center justify-between px-5 pb-1.5 font-mono text-[9px] uppercase tracking-hud text-faint/70 sm:flex">
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 bg-neon animate-pulse-dot" />
          {t.hud.uplink} · {t.hud.year}
        </span>
        <span className="tabular-nums">{stamp}</span>
      </div>

      {/* a very faint CRT wash over everything */}
      <div className="scanlines absolute inset-0 opacity-[0.35]" />
    </div>
  );
}
