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

/** The active item sits front and centre; the rest recede and blur away. */
const ROLE_STYLE: Record<Role, CSSProperties> = {
  center: { left: '50%', transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0px)', opacity: 1, zIndex: 20 },
  left: { left: '16%', transform: 'translate(-50%, -50%) scale(0.84)', filter: 'blur(2px)', opacity: 0.5, zIndex: 10 },
  right: { left: '84%', transform: 'translate(-50%, -50%) scale(0.84)', filter: 'blur(2px)', opacity: 0.5, zIndex: 10 },
  back: { left: '50%', transform: 'translate(-50%, -50%) scale(0.7)', filter: 'blur(4px)', opacity: 0, zIndex: 5 },
};

type RoleCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, isCenter: boolean) => ReactNode;
  /** Index to focus on mount and whenever `resetKey` changes. */
  initialIndex?: number;
  /** Change this (e.g. the active filter) to snap back to `initialIndex`. */
  resetKey?: string;
  cardWidth?: number;
  height?: number;
  /** Optional accent glow behind the stage, crossfaded with the active item. */
  glowFor?: (item: T, index: number) => string | undefined;
  label: string;
  /** Show a "3 / 10" position counter — useful when there are many items. */
  showCounter?: boolean;
};

export function RoleCarousel<T>({
  items,
  getKey,
  renderItem,
  initialIndex = 0,
  resetKey,
  cardWidth = 380,
  height = 580,
  glowFor,
  label,
  showCounter = false,
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
        className="relative w-full"
        style={{ height }}
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
              style={{
                position: 'absolute',
                top: '50%',
                width: cardWidth,
                transition: TRANSITION,
                willChange: 'transform, filter, opacity',
                ...ROLE_STYLE[role],
              }}
              className={cn(!isCenter && 'cursor-pointer')}
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

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => navigate('prev')}
          aria-label={`${label} — prev`}
          className="grid h-16 w-16 place-items-center rounded-full border-2 border-white/20 bg-transparent text-platinum transition-[transform,background-color,border-color] duration-150 hover:scale-[1.08] hover:border-gold/40 hover:bg-white/[0.12] focus-ring"
        >
          <ArrowLeft size={26} strokeWidth={2.25} />
        </button>

        {showCounter && (
          <span className="min-w-[64px] text-center text-sm tabular-nums text-silver/70">
            <span className="text-platinum">{count === 0 ? 0 : current + 1}</span> / {count}
          </span>
        )}

        <button
          onClick={() => navigate('next')}
          aria-label={`${label} — next`}
          className="grid h-16 w-16 place-items-center rounded-full border-2 border-white/20 bg-transparent text-platinum transition-[transform,background-color,border-color] duration-150 hover:scale-[1.08] hover:border-gold/40 hover:bg-white/[0.12] focus-ring"
        >
          <ArrowRight size={26} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
