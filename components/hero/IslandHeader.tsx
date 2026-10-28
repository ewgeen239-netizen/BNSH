'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/site';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

/**
 * The floating island: one centred pill that carries the whole top bar —
 * a grid mark, a live clock, a listening indicator, the nav, the language
 * switcher and the acid CTA.
 *
 * It is a single element rather than a full-width bar on purpose: the hero
 * behind it is a 3D scene, and a bar would cut the frame in half.
 *
 * The clock only renders after mount; a server-rendered time would differ
 * from the client's by a second and trip hydration.
 */
export function IslandHeader() {
  const t = useT();
  const pathname = usePathname();
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // The nav is in-page, so off the home page it has to go there first.
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header className="fixed left-1/2 top-4 z-[100] w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-5 sm:w-auto">
        <div
          className={cn(
            'flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 px-2.5 py-2 shadow-2xl backdrop-blur-md',
            'sm:gap-3 sm:px-3 sm:py-2',
          )}
        >
          {/* grid mark — back to the top */}
          <button
            onClick={() => go('hero')}
            aria-label={`${siteConfig.name} — ${t.common.toTop}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-silver transition-colors hover:text-platinum focus-ring"
          >
            <LayoutGrid size={15} strokeWidth={1.75} />
          </button>

          {/* live clock */}
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-platinum/90" suppressHydrationWarning>
            {time || '--:--:--'}
          </span>

          <span aria-hidden="true" className="hidden h-4 w-px bg-white/10 sm:block" />

          {/* listening indicator */}
          <span className="hidden shrink-0 items-center gap-1.5 text-[12px] text-silver/80 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t.island.status}
          </span>

          <span aria-hidden="true" className="hidden h-4 w-px bg-white/10 lg:block" />

          {/* nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(0, 4).map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-full px-2.5 py-1 text-[13px] text-silver/75 transition-colors hover:text-white focus-ring"
              >
                {t.nav[l.id]}
              </button>
            ))}
          </nav>

          <span aria-hidden="true" className="hidden h-4 w-px bg-white/10 lg:block" />

          <LanguageSwitcher className="hidden lg:inline-flex" />

          {/* the acid CTA */}
          <button
            onClick={() => go('contact')}
            className="ml-auto shrink-0 rounded-full bg-acid px-3.5 py-1.5 text-[12px] font-bold text-ink-950 transition hover:brightness-110 focus-ring sm:ml-0 sm:px-4"
          >
            {t.island.cta}
          </button>

          {/* compact menu */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={t.island.menu}
            aria-expanded={open}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-silver transition-colors hover:text-platinum focus-ring lg:hidden"
          >
            {open ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* compact menu sheet */}
      {open && (
        <div className="fixed inset-0 z-[99] bg-ink-950/92 px-5 pt-24 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-content flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="flex items-center justify-between border-b border-white/[0.06] px-1 py-4 text-left text-lg text-silver transition hover:text-platinum focus-ring"
              >
                {t.nav[l.id]}
                <ArrowUpRight className="h-4 w-4 text-faint" strokeWidth={1.5} />
              </button>
            ))}
            <div className="mt-5 flex items-center justify-between">
              <LanguageSwitcher />
              <a
                href={siteConfig.contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-acid px-4 py-2.5 text-[12px] font-bold text-ink-950 focus-ring"
              >
                {t.common.writeTelegram}
              </a>
            </div>
            <span className="hud mt-6 block">{t.island.build}</span>
          </nav>
        </div>
      )}
    </>
  );
}
