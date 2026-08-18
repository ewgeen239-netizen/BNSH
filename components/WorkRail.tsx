'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A continuous 3D rail.
 *
 * Unlike RoleCarousel — which snaps between three discrete slots — position
 * here is a float measured in card units. Drag, trackpad and keys all move
 * that one number; a spring pulls it to the nearest whole card on release.
 * Because the position is continuous the depth, rotation, blur and fade of
 * every card can be derived from its distance to it, which is what makes the
 * motion read as physical rather than as a slideshow.
 *
 * Frames are written straight to the DOM inside rAF: re-rendering fourteen
 * cards at 60fps through React would drop frames on a phone. React state only
 * carries the rounded index, which the HUD and the glow need.
 */

/** Horizontal step between neighbours, as a fraction of the card width. */
const STEP_RATIO = 0.62;
const STEP_RATIO_SM = 0.5;
/** Depth, rotation and falloff applied per unit of distance from centre. */
const DEPTH_PX = 190;
const ANGLE_DEG = 24;
const SCALE_FALLOFF = 0.12;
const BLUR_PX = 2.4;
/** Cards further out than this are not rendered at all. */
const VISIBLE_SPAN = 2.6;
/** Settle stiffness, expressed per 60fps frame, and the distance it stops at. */
const SPRING = 0.16;
const REST = 0.0015;
/** A frame this long or longer is treated as a stall, not as elapsed motion. */
const MAX_FRAME_MS = 120;
/** Fraction of a card the pointer must travel before a drag beats a click. */
const DRAG_SLOP = 0.04;
const FLICK_DECAY = 0.92;

type WorkRailProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, isCenter: boolean) => ReactNode;
  /** Change this (e.g. the active filter) to snap back to the first card. */
  resetKey?: string;
  stageClassName: string;
  cardClassName: string;
  /** Accent glow behind the stage, crossfaded with the active card. */
  glowFor?: (item: T, index: number) => string | undefined;
  label: string;
};

/** Shortest signed distance from `pos` to slot `i` on a ring of `count`. */
function ringDelta(i: number, pos: number, count: number) {
  const half = count / 2;
  return ((((i - pos) % count) + count + half) % count) - half;
}

export function WorkRail<T>({
  items,
  getKey,
  renderItem,
  resetKey,
  stageClassName,
  cardClassName,
  glowFor,
  label,
}: WorkRailProps<T>) {
  const count = items.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const posRef = useRef(0); // rendered position, in card units
  const targetRef = useRef(0); // where the spring is pulling
  const velRef = useRef(0); // carried over from a flick
  const stepRef = useRef(280); // px between neighbours, measured
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  // Rounded position — the only thing React needs to re-render on.
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /* ------------------------------ measuring ----------------------------- */

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const card = slotsRef.current.find(Boolean);
    if (!stage || !card) return;
    const cardW = card.getBoundingClientRect().width || 280;
    const ratio = window.matchMedia('(min-width: 640px)').matches ? STEP_RATIO : STEP_RATIO_SM;
    stepRef.current = cardW * ratio;
  }, []);

  useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* ------------------------------- painting ----------------------------- */

  const paint = useCallback(() => {
    const pos = posRef.current;
    const step = stepRef.current;

    for (let i = 0; i < count; i++) {
      const el = slotsRef.current[i];
      if (!el) continue;

      const d = ringDelta(i, pos, count);
      const far = Math.abs(d) > VISIBLE_SPAN;

      const inner = el.firstElementChild as HTMLElement | null;

      if (far) {
        // Parked: kept mounted (images stay warm) but out of the paint path.
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        continue;
      }

      const a = Math.abs(d);
      const sign = Math.sign(d);
      // eased so neighbours separate quickly and the far ones stack tight
      const eased = 1 - Math.pow(1 - Math.min(a, VISIBLE_SPAN) / VISIBLE_SPAN, 2);

      el.style.visibility = 'visible';
      el.style.opacity = String(Math.max(0, 1 - 0.3 * a));
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.style.pointerEvents = a < 0.5 ? 'auto' : 'none';
      el.style.transform =
        `translate3d(calc(-50% + ${(d * step).toFixed(1)}px), -50%, ${(-eased * DEPTH_PX * VISIBLE_SPAN).toFixed(1)}px)` +
        ` rotateY(${(-sign * eased * ANGLE_DEG).toFixed(2)}deg)` +
        ` scale(${(1 - SCALE_FALLOFF * a).toFixed(3)})`;

      // The blur lives on the child, never on the 3D-transformed element:
      // a filter and a perspective transform on the same layer make Chrome
      // drop the whole card on repaint after a scroll.
      if (inner) {
        inner.style.filter =
          a < 0.02
            ? 'none'
            : `blur(${(a * BLUR_PX).toFixed(2)}px) brightness(${(1 - 0.22 * Math.min(a, 1.6)).toFixed(3)})`;
      }
    }

    const rounded = ((Math.round(pos) % count) + count) % count;
    if (rounded !== activeRef.current) {
      activeRef.current = rounded;
      setActive(rounded);
    }
  }, [count]);

  /* -------------------------------- motion ------------------------------ */

  const lastTRef = useRef(0);

  const tick = useCallback(
    (now: number) => {
      frameRef.current = null;
      if (draggingRef.current) return;

      // Frame-rate independent: the same gesture settles in the same wall time
      // at 60Hz, at 120Hz, and on a throttled background tab.
      const dt = Math.min(MAX_FRAME_MS, Math.max(1, now - (lastTRef.current || now - 16.7)));
      lastTRef.current = now;
      const frames = dt / 16.667;

      const target = targetRef.current;
      let pos = posRef.current;

      // Carry a flick a little further before the settle takes over.
      if (Math.abs(velRef.current) > 0.002) {
        pos += velRef.current * frames;
        velRef.current *= Math.pow(FLICK_DECAY, frames);
        targetRef.current = Math.round(pos + velRef.current * 6);
      } else {
        velRef.current = 0;
        const delta = target - pos;
        if (Math.abs(delta) < REST) {
          posRef.current = target;
          paint();
          return;
        }
        pos += delta * (1 - Math.pow(1 - SPRING, frames));
      }

      posRef.current = pos;
      paint();
      frameRef.current = requestAnimationFrame(tick);
    },
    [paint],
  );

  const run = useCallback(() => {
    if (frameRef.current !== null) return;
    lastTRef.current = 0; // a fresh run must not inherit the last frame's age
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const goTo = useCallback(
    (next: number) => {
      if (count < 2) return;
      velRef.current = 0;
      targetRef.current = next;
      if (reducedRef.current) {
        posRef.current = next;
        paint();
        return;
      }
      run();
    },
    [count, paint, run],
  );

  /** Move by whole cards from wherever the rail currently sits. */
  const nudge = useCallback(
    (dir: 1 | -1) => goTo(Math.round(targetRef.current) + dir),
    [goTo],
  );

  /** Jump to a specific item, taking the short way around the ring. */
  const focusItem = useCallback(
    (i: number) => {
      const from = Math.round(targetRef.current);
      goTo(from + ringDelta(i, from, count));
    },
    [count, goTo],
  );

  useEffect(() => {
    paint();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [paint]);

  // A filter change re-slices the list — start over from the first card.
  useEffect(() => {
    posRef.current = 0;
    targetRef.current = 0;
    velRef.current = 0;
    activeRef.current = 0;
    setActive(0);
    paint();
  }, [resetKey, count, paint]);

  /* ------------------------------- dragging ----------------------------- */

  const dragRef = useRef({ x: 0, y: 0, pos: 0, t: 0, lastX: 0, lastT: 0 });

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (count < 2 || e.button !== 0) return;
    draggingRef.current = true;
    movedRef.current = false;
    velRef.current = 0;
    const now = performance.now();
    dragRef.current = { x: e.clientX, y: e.clientY, pos: posRef.current, t: now, lastX: e.clientX, lastT: now };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const d = dragRef.current;
    const dx = e.clientX - d.x;

    if (!movedRef.current) {
      // Let a mostly-vertical gesture through so the page can still scroll.
      if (Math.abs(dx) < Math.abs(e.clientY - d.y)) return;
      if (Math.abs(dx) < stepRef.current * DRAG_SLOP) return;
      movedRef.current = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }

    posRef.current = d.pos - dx / stepRef.current;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    paint();
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId);
    }
    if (!movedRef.current) return;

    const d = dragRef.current;
    const dt = Math.max(16, performance.now() - d.lastT);
    // px/ms → card units per frame, capped so a hard flick stays readable
    const v = ((d.lastX - e.clientX) / stepRef.current / dt) * 16;
    velRef.current = Math.max(-0.45, Math.min(0.45, v));
    targetRef.current = Math.round(posRef.current + velRef.current * 6);
    run();
  }

  /* ------------------------ trackpad + keyboard ------------------------- */

  const wheelLockRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function onWheel(e: WheelEvent) {
      // Only horizontal intent drives the rail — vertical belongs to the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 6) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLockRef.current < 260) return;
      wheelLockRef.current = now;
      nudge(e.deltaX > 0 ? 1 : -1);
    }

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [nudge]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nudge(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nudge(-1);
    }
  }

  /* -------------------------------- render ------------------------------ */

  const activeItem = items[active];
  const glow = activeItem ? glowFor?.(activeItem, active) : undefined;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="select-none">
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'relative w-full cursor-grab touch-pan-y overflow-hidden outline-none active:cursor-grabbing',
          'focus-visible:ring-1 focus-visible:ring-gold/40',
          stageClassName,
        )}
        style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
      >
        {/* accent bloom, crossfaded with the centre card */}
        {glow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${glow}, transparent 65%)`, transition: 'background 600ms ease' }}
          />
        )}

        {/* horizon line + measurement ticks: the rail reads as an instrument */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-3 -translate-y-1/2 opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.10) 0 1px, transparent 1px 64px)',
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        />

        {items.map((item, i) => (
          <div
            key={getKey(item, i)}
            ref={(el) => {
              slotsRef.current[i] = el;
            }}
            onClick={() => {
              if (movedRef.current) return; // a drag just ended — not a click
              if (i !== active) focusItem(i);
            }}
            className={cn('absolute left-1/2 top-1/2', cardClassName, i !== active && 'cursor-pointer')}
            style={{ transformStyle: 'preserve-3d' }}
            aria-hidden={i !== active}
          >
            {/* Off-centre cards are inert — a click brings them forward. */}
            <div className={cn(i !== active && 'pointer-events-none')}>{renderItem(item, i === active)}</div>
          </div>
        ))}

        {/* edge vignettes so cards dissolve into the page instead of clipping */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent sm:w-20" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink-950 via-ink-950/60 to-transparent sm:w-20" />
      </div>

      {/* ------------------------------ HUD ------------------------------ */}

      <div className="mt-6 flex items-center gap-4 sm:mt-9 sm:gap-6">
        <button
          onClick={() => nudge(-1)}
          disabled={count < 2}
          aria-label={`${label} — prev`}
          className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.02] text-silver transition-colors duration-200 hover:border-gold/45 hover:bg-gold/[0.07] hover:text-gold-soft focus-ring disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
        </button>

        {/* segmented rail — one tick per project, doubles as a scrubber */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
          <span className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.18em] text-faint sm:text-xs">
            <span className="text-gold-soft">{pad(count === 0 ? 0 : active + 1)}</span>
            <span className="mx-1 text-white/15">/</span>
            {pad(count)}
          </span>

          <div
            className={cn('flex min-w-0 flex-1 items-center gap-[3px] sm:gap-1.5', count < 2 && 'invisible')}
            aria-hidden="true"
          >
            {items.map((item, i) => (
              <button
                key={getKey(item, i)}
                tabIndex={-1}
                onClick={() => focusItem(i)}
                className="group relative h-6 min-w-0 flex-1 focus-ring"
                aria-label={`${label} ${i + 1}`}
              >
                <span
                  className={cn(
                    'absolute inset-x-0 top-1/2 block -translate-y-1/2 rounded-full transition-all duration-300 ease-premium',
                    i === active
                      ? 'h-[3px] bg-gold-soft shadow-[0_0_12px_rgba(216,188,134,0.55)]'
                      : 'h-[2px] bg-white/20 group-hover:h-[3px] group-hover:bg-white/45',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => nudge(1)}
          disabled={count < 2}
          aria-label={`${label} — next`}
          className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.02] text-silver transition-colors duration-200 hover:border-gold/45 hover:bg-gold/[0.07] hover:text-gold-soft focus-ring disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
