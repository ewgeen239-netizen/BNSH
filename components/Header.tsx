'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/site';
import { scrollToId, cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Wait a frame so the menu closes before scrolling.
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium',
        scrolled
          ? 'border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => go('hero')}
          className="group flex items-center gap-2.5 rounded-full focus-ring"
          aria-label={`BNSH Studio — ${t.common.toTop}`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[13px] font-semibold tracking-tight text-platinum transition group-hover:border-gold/40">
            B
          </span>
          <span className="text-sm font-semibold tracking-tight text-platinum">
            BNSH <span className="text-muted">Studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-full px-3.5 py-2 text-sm text-silver/80 transition-colors hover:text-platinum focus-ring"
            >
              {t.nav[l.id]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />

          <button
            onClick={() => go('contact')}
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-platinum transition hover:border-gold/40 hover:bg-white/[0.06] focus-ring lg:inline-flex"
          >
            {t.common.discuss}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-platinum focus-ring md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <nav className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-base text-silver transition hover:bg-white/[0.04] hover:text-platinum focus-ring"
                >
                  {t.nav[l.id]}
                  <ArrowUpRight className="h-4 w-4 text-faint" strokeWidth={1.5} />
                </button>
              ))}
              <div className="mt-2 flex items-center justify-between px-3">
                <LanguageSwitcher />
              </div>
              <a
                href={siteConfig.contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-platinum px-4 py-3 text-sm font-semibold text-ink-950 focus-ring"
              >
                {t.common.writeTelegram}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
