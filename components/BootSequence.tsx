'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n';

/**
 * Boot screen — the door into 3089.
 *
 * A canvas of falling binary (the matrix cliché, kept cold and thin so it
 * reads as telemetry rather than as a screensaver), a decrypting title and a
 * boot log that fills as the progress counter climbs. Runs once per tab
 * session; any click or key skips it; `prefers-reduced-motion` never sees it.
 *
 * The canvas is painted in rAF and the counter lives in a ref — React only
 * re-renders when a whole boot-log line lands, which is four or five times.
 */

const KEY = 'bnsh-boot';
const DURATION = 2600; // ms of boot before the curtain lifts
const OUT = 700; // ms of curtain

const GLYPHS = '01';
const TITLE = 'BNSH';
const SCRAMBLE = '01\\/|<>+=*#';

export function BootSequence() {
  const t = useT();
  const [phase, setPhase] = useState<'idle' | 'run' | 'out' | 'done'>('idle');
  const [step, setStep] = useState(-1); // index of the last boot-log line shown
  const [pct, setPct] = useState(0);
  const [title, setTitle] = useState('0110');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lines = t.boot.lines;

  /* --------------------------- should it run? --------------------------- */

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
    } catch {}
    if (reduce || seen) {
      setPhase('done');
      return;
    }
    setPhase('run');
    document.body.dataset.booting = '1';
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
  }, []);

  const finish = useCallback(() => {
    setPhase((p) => (p === 'run' ? 'out' : p));
  }, []);

  useEffect(() => {
    if (phase !== 'out') return;
    const id = window.setTimeout(() => {
      setPhase('done');
      delete document.body.dataset.booting;
    }, OUT);
    return () => window.clearTimeout(id);
  }, [phase]);

  /* ------------------------------ skipping ------------------------------ */

  useEffect(() => {
    if (phase !== 'run') return;
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, finish]);

  /* --------------------------- rain + progress -------------------------- */

  useEffect(() => {
    if (phase !== 'run') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let cols = 0;
    let drops: number[] = [];
    const size = 14; // glyph cell, css px

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth / size);
      // Stagger the starting heights so the first frame already looks alive.
      drops = Array.from({ length: cols }, () => -Math.random() * 40);
      ctx.font = `${size - 2}px var(--font-mono, monospace)`;
      ctx.textBaseline = 'top';
    };
    resize();
    window.addEventListener('resize', resize);

    startRef.current = performance.now();
    let lastStep = -1;

    const frame = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / DURATION);

      // trail: a translucent wash instead of a clear, so glyphs smear downward
      ctx.fillStyle = 'rgba(4, 6, 10, 0.16)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        // the head is bright, the tail is a dim cyan
        ctx.fillStyle = 'rgba(127, 240, 250, 0.92)';
        ctx.fillText(g, i * size, y);
        ctx.fillStyle = 'rgba(40, 224, 240, 0.22)';
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * size, y - size);

        drops[i] += 0.9 + Math.random() * 0.7;
        if (y > window.innerHeight && Math.random() > 0.975) drops[i] = -2;
      }

      setPct(Math.round(p * 100));

      // Title decrypts from noise into the wordmark as the bar fills.
      const resolved = Math.floor(p * 1.35 * TITLE.length);
      setTitle(
        TITLE.split('')
          .map((ch, i) => (i < resolved ? ch : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]))
          .join(''),
      );

      const s = Math.min(lines.length - 1, Math.floor(p * lines.length));
      if (s !== lastStep) {
        lastStep = s;
        setStep(s);
      }

      if (p >= 1) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, lines.length, finish]);

  if (phase === 'idle' || phase === 'done') return null;

  const out = phase === 'out';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t.boot.tag}
      onClick={finish}
      className="fixed inset-0 z-[200] cursor-pointer select-none bg-ink-950"
      style={{
        opacity: out ? 0 : 1,
        transition: `opacity ${OUT}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.55]" aria-hidden="true" />

      {/* vignette + scanlines so the rain sits behind glass */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent,rgba(4,6,10,0.92))]"
      />
      <div aria-hidden="true" className="scanlines absolute inset-0 opacity-50" />

      {/* the curtain: a cyan seam that snaps open as the overlay leaves */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px bg-neon"
        style={{
          transform: `translateY(-50%) scaleX(${out ? 1 : 0.18})`,
          opacity: out ? 1 : 0.5,
          boxShadow: '0 0 30px 2px rgba(40,224,240,0.65)',
          transition: `transform ${OUT}ms cubic-bezier(0.22,1,0.36,1), opacity ${OUT}ms linear`,
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          transform: out ? 'scale(1.04)' : 'scale(1)',
          transition: `transform ${OUT}ms cubic-bezier(0.22,1,0.36,1)`,
        }}
      >
        <span className="hud text-neon/70">{t.boot.tag}</span>

        <h1
          className="mt-5 font-mono text-[clamp(2.75rem,12vw,6rem)] font-bold leading-none tracking-[0.08em] text-platinum"
          style={{ textShadow: '-2px 0 0 rgba(255,61,138,0.5), 2px 0 0 rgba(40,224,240,0.6)' }}
        >
          {title}
        </h1>

        {/* raw payload — the binary the archive is being read from */}
        <p className="mt-4 max-w-[34rem] break-all font-mono text-[10px] leading-relaxed text-neon/35 sm:text-[11px]">
          011101000110100001100101001000000110000101110010011000110110100001101001011101100110010100100000011010010111001100100000011011110111000001100101011011100110100101101110011001110011
        </p>

        {/* progress */}
        <div className="mt-8 w-full max-w-sm">
          <div className="flex items-end justify-between font-mono text-[10px] uppercase tracking-hud text-faint">
            <span>{pct < 100 ? t.boot.decrypt : t.boot.ready}</span>
            <span className="tabular-nums text-neon-soft">{String(pct).padStart(3, '0')}%</span>
          </div>
          <div className="relative mt-2 h-px w-full bg-white/10">
            <span
              className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_12px_rgba(40,224,240,0.8)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* boot log */}
        <ul className="mt-6 h-[5.5rem] w-full max-w-sm space-y-1 text-left font-mono text-[10px] leading-relaxed text-silver/70 sm:text-[11px]">
          {lines.slice(0, step + 1).map((l, i) => (
            <li key={l} className="flex gap-2">
              <span className="text-neon/60">›</span>
              <span className={i === step ? 'text-platinum' : ''}>{l}</span>
              {i < step && <span className="ml-auto text-neon/50">ok</span>}
            </li>
          ))}
        </ul>

        <span className="mt-8 hud">{t.boot.skip} · ESC</span>
      </div>
    </div>
  );
}
