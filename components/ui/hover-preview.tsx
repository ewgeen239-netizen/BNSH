'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Hover preview — a card that follows the cursor off an inline link.
 *
 * Adapted from the 21st.dev `hover-preview` pattern, with three changes that
 * make it fit this codebase: the styling is Tailwind + the project's own
 * tokens instead of an injected <style> blob, the previews are passed in as
 * data instead of hard-coded, and the images go through next/image so the
 * screenshots already in /public/works are served optimised.
 *
 * Mechanics kept from the original: the card is positioned above the pointer
 * and clamped to the viewport, it flips below when there is no room, and
 * every image is warmed on mount so the first hover never shows a blank card.
 */

export type PreviewItem = {
  title: string;
  subtitle?: string;
  /** Screenshot path under /public. Omit for projects with no screen. */
  image?: string;
  /** Accent used for the hairline and the link underline. */
  accent?: string;
  /** Shown instead of an image when there is none. */
  note?: string;
};

type Ctx = {
  items: Record<string, PreviewItem>;
  show: (id: string, e: ReactMouseEvent) => void;
  move: (e: ReactMouseEvent) => void;
  hide: () => void;
  activeId: string | null;
};

const PreviewContext = createContext<Ctx | null>(null);

const CARD_W = 300;
const CARD_H = 250;
const GAP = 18;

export function HoverPreviewProvider({
  items,
  children,
  hint,
}: {
  items: Record<string, PreviewItem>;
  children: ReactNode;
  /** Small caption on the card, e.g. "hover to preview". */
  hint?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [coarse, setCoarse] = useState(false);

  // Touch devices have no hover: there the links stay links and no card is
  // ever mounted, which also keeps the screenshots off a phone's data budget.
  useEffect(() => {
    setCoarse(!window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (coarse) return;
    Object.values(items).forEach((it) => {
      if (!it.image) return;
      const img = new window.Image();
      img.src = it.image;
    });
  }, [items, coarse]);

  const place = useCallback((e: ReactMouseEvent) => {
    let x = e.clientX - CARD_W / 2;
    let y = e.clientY - CARD_H - GAP;

    x = Math.min(x, window.innerWidth - CARD_W - 16);
    x = Math.max(16, x);
    if (y < 16) y = e.clientY + GAP;

    setPos({ x, y });
  }, []);

  const show = useCallback(
    (id: string, e: ReactMouseEvent) => {
      if (coarse) return;
      setActiveId(id);
      setVisible(true);
      place(e);
    },
    [coarse, place],
  );

  const move = useCallback(
    (e: ReactMouseEvent) => {
      if (!visible) return;
      place(e);
    },
    [visible, place],
  );

  const hide = useCallback(() => setVisible(false), []);

  const ctx = useMemo<Ctx>(() => ({ items, show, move, hide, activeId }), [items, show, move, hide, activeId]);
  const active = activeId ? items[activeId] : null;

  return (
    <PreviewContext.Provider value={ctx}>
      {children}
      {!coarse && active && (
        <PreviewCard item={active} pos={pos} visible={visible} hint={hint} />
      )}
    </PreviewContext.Provider>
  );
}

function PreviewCard({
  item,
  pos,
  visible,
  hint,
}: {
  item: PreviewItem;
  pos: { x: number; y: number };
  visible: boolean;
  hint?: string;
}) {
  const accent = item.accent ?? '#C9A4FF';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-[120] w-[300px] will-change-transform',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{
        left: pos.x,
        top: pos.y,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        transition:
          'opacity 180ms linear, transform 260ms cubic-bezier(0.22,1,0.36,1), left 110ms linear, top 110ms linear',
        ['--a' as string]: accent,
      }}
    >
      <div className="rounded-2xl relative overflow-hidden border border-white/10 bg-ink-900/95 p-1.5 shadow-panel backdrop-blur-sm">
        {/* power-on hairline */}
        <span
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, var(--a), transparent)' }}
        />

        <div className="relative aspect-[16/10] overflow-hidden bg-ink-850">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="300px"
              className="object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-hud text-silver/70">
              {item.note}
            </div>
          )}
          <div className="scanlines absolute inset-0 opacity-[0.22] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,10,16,0.9),transparent_55%)]" />
        </div>

        <div className="flex items-end justify-between gap-3 px-1.5 pb-1 pt-2.5">
          <div className="min-w-0">
            <p className="truncate font-mono text-[11px] uppercase tracking-hud text-platinum">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="mt-1 truncate text-[11px] text-muted">{item.subtitle}</p>
            )}
          </div>
          {hint && <span className="hud shrink-0 text-[8px] text-neon/50">{hint}</span>}
        </div>
      </div>
    </div>
  );
}

/**
 * An inline word that reveals its project on hover. Renders as a link when the
 * item has somewhere to go, otherwise as plain emphasised text.
 */
export function PreviewLink({
  id,
  href,
  children,
  className,
}: {
  id: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(PreviewContext);
  const ref = useRef<HTMLAnchorElement & HTMLSpanElement>(null);
  if (!ctx) throw new Error('PreviewLink must be used within HoverPreviewProvider');

  const item = ctx.items[id];
  const accent = item?.accent ?? '#C9A4FF';

  const props = {
    ref,
    onMouseEnter: (e: ReactMouseEvent) => ctx.show(id, e),
    onMouseMove: (e: ReactMouseEvent) => ctx.move(e),
    onMouseLeave: () => ctx.hide(),
    style: { ['--a' as string]: accent },
    className: cn(
      'group/preview relative inline-flex items-baseline font-mono text-[0.92em] uppercase tracking-[0.08em] text-platinum',
      'transition-colors duration-300 hover:text-white focus-ring',
      className,
    ),
  };

  const inner = (
    <>
      {children}
      {/* the underline sweeps in from the left on hover */}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-500 ease-premium group-hover/preview:w-full"
        style={{ background: 'var(--a)', boxShadow: '0 0 8px var(--a)' }}
      />
    </>
  );

  if (href) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <span {...props}>{inner}</span>;
}
