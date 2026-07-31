'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Shared motion language for every carousel on the site. */
export const CAROUSEL_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const CAROUSEL_MS = 650;

const TRANSITION =
  `transform ${CAROUSEL_MS}ms ${CAROUSEL_EASE},` +
  ` filter ${CAROUSEL_MS}ms ${CAROUSEL_EASE},` +
  ` opacity ${CAROUSEL_MS}ms ${CAROUSEL_EASE},` +
  ` left ${CAROUSEL_MS}ms ${CAROUSEL_EASE}`;

type Role = 'center' | 'left' | 'right' | 'back';

/**
 * Placement is driven by CSS variables so the breakpoint lives in CSS, not in
 * JS state — a stale `isMobile` flag would otherwise size the stage wrongly
 * after a resize. The consuming properties still transition when a var changes.
 *
 * On phones the neighbours sit further out and shrink harder, so the centre
 * card stays readable on a narrow screen.
 */
const ROLE_CLASS: Record<Role, string> = {
  center: 'z-20 [--rl:50%] [--ro:1] [--rs:1] [--rb:0px]',
  left: 'z-10 [--rl:4%] [--ro:0.32] [--rs:0.72] [--rb:2px] sm:[--rl:16%] sm:[--ro:0.5] sm:[--rs:0.84]',
  right: 'z-10 [--rl:96%] [--ro:0.32] [--rs:0.72] [--rb:2px] sm:[--rl:84%] sm:[--ro:0.5] sm:[--rs:0.84]',
  back: 'z-[5] [--rl:50%] [--ro:0] [--rs:0.6] [--rb:4px] sm:[--rs:0.7]',
};

const ROLE_STYLE: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: 'var(--rl)',
  opacity: 'var(--ro)',
  transform: 'translate(-50%, -50%) scale(var(--rs))',
  filter: 'blur(var(--rb))',
  transition: TRANSITION,
  willChange: 'transform, filter, opacity',
};

const SWIPE_THRESHOLD = 45;

type RoleCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, isCenter: boolean) => ReactNode;
  /** Index to focus on mount and whenever `resetKey` changes. */
  initialIndex?: number;
  /** Change this (e.g. the active filter) to snap back to `initialIndex`. */
  resetKey?: string;
  /** Responsive height for the stage, e.g. "h-[430px] sm:h-[560px]". */
  stageClassName: string;
  /** Responsive width for each card, e.g. "w-[286px] sm:w-[420px]". */
  cardClassName: string;
  /** Optional accent glow behind the stage, crossfaded with the active item. */
  glowFor?: (item: T, index: number) => string | undefined;
  label: string;
  /** Show a "3 / 10" position counter — useful when there are many items. */
  showCounter?: boolean;
  /** Show dot indicators — better for a short list. */
  showDots?: boolean;
};

export function RoleCarousel<T>({
  items,
  getKey,
  renderItem,
  initialIndex = 0,
  resetKey,
  stageClassName,
  cardClassName,
  glowFor,
  label,
  showCounter = false,
  showDots = false,
}: RoleCarouselProps<T>) {
  const count = items.length;
  const [active, setActive] = useState(initialIndex);
  // Clamped during render: filtering can shrink the list before the reset
  // effect runs, and an out-of-range index would read a missing item.
  const current = count > 0 ? Math.min(active, count - 1) : 0;

  // A ref, not state — the guard has to be synchronous so bursts of clicks in
  // the same tick are rejected rather than queued.
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Snap back when the collection changes (e.g. a filter was applied).
  useEffect(() => {
    setActive(Math.min(initialIndex, Math.max(0, count - 1)));
    lockedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, count]);

  function lock() {
    lockedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, CAROUSEL_MS);
  }

  function focusIndex(next: number) {
    if (lockedRef.current || next === current) return;
    lock();
    setActive(next);
  }

  function navigate(dir: 'next' | 'prev') {
    if (lockedRef.current || count < 2) return;
    lock();
    setActive((prev) => {
      const from = Math.min(prev, count - 1);
      return dir === 'next' ? (from + 1) % count : (from + count - 1) % count;
    });
  }

  /* ---------------- touch swipe (phones/tablets) ---------------- */

  const touchRef = useRef<{ x: number; y: number } | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Ignore mostly-vertical gestures so page scrolling still works.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    navigate(dx < 0 ? 'next' : 'prev');
  }

  function roleOf(i: number): Role {
    if (i === current) return 'center';
    if (i === (current + 1) % count) return 'right';
    if (i === (current + count - 1) % count) return 'left';
    return 'back';
  }

  const activeItem = items[current];
  const glow = activeItem ? glowFor?.(activeItem, current) : undefined;

  return (
    <div>
      <div
        className={cn('relative w-full overflow-hidden', stageClassName)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
      >
        {glow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${glow}, transparent 65%)`,
              transition: `background ${CAROUSEL_MS}ms ${CAROUSEL_EASE}`,
            }}
          />
        )}

        {items.map((item, i) => {
          const role = roleOf(i);
          const isCenter = role === 'center';
          return (
            <div
              key={getKey(item, i)}
              onClick={() => !isCenter && focusIndex(i)}
              style={ROLE_STYLE}
              className={cn(ROLE_CLASS[role], cardClassName, !isCenter && 'cursor-pointer')}
              aria-hidden={!isCenter}
            >
              {/* Side cards are inert — a click focuses them instead. */}
              <div className={cn(!isCenter && 'pointer-events-none')}>
                {renderItem(item, isCenter)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
        <button
          onClick={() => navigate('prev')}
          aria-label={`${label} — prev`}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/20 bg-transparent text-platinum transition-[transform,background-color,border-color] duration-150 hover:scale-[1.08] hover:border-gold/40 hover:bg-white/[0.12] focus-ring sm:h-16 sm:w-16"
        >
          <ArrowLeft className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" strokeWidth={2.25} />
        </button>

        {showCounter && (
          <span className="min-w-[56px] text-center text-sm tabular-nums text-silver/70 sm:min-w-[64px]">
            <span className="text-platinum">{count === 0 ? 0 : current + 1}</span> / {count}
          </span>
        )}

        {showDots && (
          <div className="flex items-center gap-2 px-1">
            {items.map((item, i) => (
              <button
                key={getKey(item, i)}
                onClick={() => focusIndex(i)}
                aria-current={i === current}
                aria-label={`${label} ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 focus-ring',
                  i === current ? 'w-6 bg-gold-soft' : 'w-1.5 bg-white/20 hover:bg-white/40',
                )}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('next')}
          aria-label={`${label} — next`}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/20 bg-transparent text-platinum transition-[transform,background-color,border-color] duration-150 hover:scale-[1.08] hover:border-gold/40 hover:bg-white/[0.12] focus-ring sm:h-16 sm:w-16"
        >
          <ArrowRight className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
