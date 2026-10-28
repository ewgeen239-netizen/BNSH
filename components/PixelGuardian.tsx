'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * The guardian: a human silhouette made of pixels that watches the pointer.
 *
 * The figure is not an asset — it is drawn once into an offscreen canvas from
 * primitives and then sampled on a grid, so every dot is generated at runtime
 * and scales with the device pixel ratio. From then on only the dots are
 * painted:
 *
 *  - the whole body leans and rotates a little toward the pointer (parallax);
 *  - the head leans further than the body, which is what reads as "looking";
 *  - the two eye dots track the pointer directly and stay bright;
 *  - dots close to the pointer are pulled toward it and lit, so dragging a
 *    finger across the figure drags light through it.
 *
 * Without a pointer the figure breathes on a slow sine and the dots drift,
 * so it is alive before it is touched. `prefers-reduced-motion` gets a still
 * figure with no tracking.
 */

/** Model space the silhouette is authored in; the canvas scales to fit it. */
const MW = 220;
const MH = 340;
/** Sampling grid in model units — smaller means denser, more expensive. */
const GRID = 3.4;

type Dot = {
  /** home position in model space */
  hx: number;
  hy: number;
  /** current offset from home, in model units */
  ox: number;
  oy: number;
  /** 0 = feet, 1 = top of head — drives the lean falloff */
  up: number;
  /** 1 while this dot belongs to the head */
  head: number;
  seed: number;
  /** extra brightness, decays each frame */
  lit: number;
};

/** Draw the silhouette into a context, in model space. */
function drawBody(c: CanvasRenderingContext2D) {
  c.fillStyle = '#fff';
  c.strokeStyle = '#fff';
  c.lineCap = 'round';
  c.lineJoin = 'round';

  // head
  c.beginPath();
  c.ellipse(110, 52, 26, 30, 0, 0, Math.PI * 2);
  c.fill();

  // neck
  c.fillRect(101, 78, 18, 14);

  // torso — shoulders wide, waist narrow
  c.beginPath();
  c.moveTo(68, 96);
  c.quadraticCurveTo(110, 84, 152, 96);
  c.lineTo(142, 196);
  c.quadraticCurveTo(110, 206, 78, 196);
  c.closePath();
  c.fill();

  // arms, hanging slightly away from the body
  c.lineWidth = 17;
  c.beginPath();
  c.moveTo(72, 104);
  c.quadraticCurveTo(52, 150, 58, 200);
  c.stroke();
  c.beginPath();
  c.moveTo(148, 104);
  c.quadraticCurveTo(168, 150, 162, 200);
  c.stroke();

  // legs
  c.lineWidth = 20;
  c.beginPath();
  c.moveTo(94, 198);
  c.lineTo(88, 318);
  c.stroke();
  c.beginPath();
  c.moveTo(126, 198);
  c.lineTo(132, 318);
  c.stroke();
}

function buildDots(): Dot[] {
  const off = document.createElement('canvas');
  off.width = MW;
  off.height = MH;
  const c = off.getContext('2d');
  if (!c) return [];
  drawBody(c);

  const { data } = c.getImageData(0, 0, MW, MH);
  const dots: Dot[] = [];

  for (let y = 0; y < MH; y += GRID) {
    for (let x = 0; x < MW; x += GRID) {
      const idx = ((y | 0) * MW + (x | 0)) * 4 + 3;
      if (data[idx] < 128) continue;
      // Thin the cloud out a little at random so the grid never shows through.
      if (Math.random() < 0.12) continue;
      dots.push({
        hx: x,
        hy: y,
        ox: 0,
        oy: 0,
        up: 1 - y / MH,
        head: y < 86 ? 1 : 0,
        seed: Math.random() * Math.PI * 2,
        lit: 0,
      });
    }
  }
  return dots;
}

export function PixelGuardian({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = buildDots();

    let scale = 1;
    let dpr = 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      // Fit the model into the element, keeping its proportions.
      scale = Math.min(w / MW, h / MH);
    };
    resize();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    /* ----------------------------- pointer ------------------------------ */

    // Pointer in model space; starts off-figure so nothing is "watched" yet.
    const ptr = { x: MW / 2, y: -300, active: false };
    // Smoothed aim, so the figure glides instead of snapping.
    const aim = { x: 0, y: 0 };

    const toModel = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const ox = (w - MW * scale) / 2;
      const oy = (h - MH * scale) / 2;
      return {
        x: (clientX - rect.left - ox) / scale,
        y: (clientY - rect.top - oy) / scale,
      };
    };

    const onPointer = (e: PointerEvent) => {
      const m = toModel(e.clientX, e.clientY);
      ptr.x = m.x;
      ptr.y = m.y;
      ptr.active = true;
    };
    const onLeave = () => {
      ptr.active = false;
    };

    if (!reduce) {
      // Listened for on the window, not the canvas: the figure should follow
      // the pointer across the whole hero, not only while it is over the dots.
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('blur', onLeave);
    }

    /* ------------------------------ painting ---------------------------- */

    let raf = 0;
    let t0 = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(48, now - t0);
      t0 = now;
      const time = now / 1000;

      // Where the pointer sits relative to the chest, clamped to ±1.
      const tx = ptr.active ? Math.max(-1, Math.min(1, (ptr.x - MW / 2) / (MW * 1.1))) : 0;
      const ty = ptr.active ? Math.max(-1, Math.min(1, (ptr.y - MH * 0.35) / (MH * 1.1))) : 0;
      aim.x += (tx - aim.x) * Math.min(1, dt / 160);
      aim.y += (ty - aim.y) * Math.min(1, dt / 200);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const ox = (w - MW * scale) / 2;
      const oy = (h - MH * scale) / 2;
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);

      // Body lean: rotate about the feet and shift, both driven by the aim.
      const lean = aim.x * 0.07;
      const breathe = reduce ? 0 : Math.sin(time * 0.9) * 1.6;
      ctx.translate(MW / 2, MH);
      ctx.rotate(lean);
      ctx.translate(-MW / 2, -MH);
      ctx.translate(aim.x * 10, aim.y * 5 + breathe);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Head leans further than the chest, which reads as looking.
        const look = d.head ? 1 : d.up * 0.45;
        let px = d.hx + aim.x * 11 * look;
        let py = d.hy + aim.y * 7 * look;

        if (!reduce) {
          // idle drift so the cloud never looks frozen
          px += Math.sin(time * 0.8 + d.seed) * 0.5;
          py += Math.cos(time * 0.7 + d.seed) * 0.5;
        }

        // Local attraction: dots near the pointer are pulled to it and lit.
        if (ptr.active && !reduce) {
          const dx = ptr.x - px;
          const dy = ptr.y - py;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 3600) {
            const dist = Math.sqrt(dist2) || 1;
            const pull = (1 - dist / 60) ** 2;
            d.ox += (dx / dist) * pull * 2.6;
            d.oy += (dy / dist) * pull * 2.6;
            d.lit = Math.min(1, d.lit + pull * 0.35);
          }
        }

        // Spring back home, and let the light fade.
        d.ox *= 0.86;
        d.oy *= 0.86;
        d.lit *= 0.94;

        const x = px + d.ox;
        const y = py + d.oy;

        // Base brightness rises up the body; the eyes are brightest.
        const base = 0.16 + d.up * 0.3;
        const a = Math.min(1, base + d.lit * 0.8);
        ctx.fillStyle = d.lit > 0.25 ? `rgba(228,210,255,${a})` : `rgba(175,175,186,${a * 0.75})`;
        ctx.fillRect(x, y, 1.7, 1.7);
      }

      // Eyes — two dots that track the pointer directly.
      const ex = 110 + aim.x * 17;
      const ey = 50 + aim.y * 10;
      ctx.fillStyle = 'rgba(201,164,255,0.95)';
      ctx.fillRect(ex - 9, ey, 3.2, 3.2);
      ctx.fillRect(ex + 6, ey, 3.2, 3.2);
      ctx.fillStyle = 'rgba(201,164,255,0.22)';
      ctx.fillRect(ex - 12, ey - 3, 9, 9);
      ctx.fillRect(ex + 3, ey - 3, 9, 9);

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    // No position utility of its own: the caller places it, and whatever it
    // passes (absolute/relative/fixed) is also the context the glows need.
    <div className={cn('pointer-events-none', className)} aria-hidden="true">
      {/* the light it stands in */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_42%,rgba(201,164,255,0.1),transparent_70%)]" />
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* floor shadow, so the figure is standing on the grid */}
      <div className="absolute inset-x-[18%] bottom-[4%] -z-10 h-6 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(201,164,255,0.18),transparent_70%)] blur-[2px]" />
    </div>
  );
}
