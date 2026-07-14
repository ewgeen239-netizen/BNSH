'use client';

import { ArrowUp } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/site';
import { scrollToId } from '@/lib/utils';
import { useT } from '@/lib/i18n';

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* brand */}
          <div className="max-w-xs">
            <button
              onClick={() => scrollToId('hero')}
              className="flex items-center gap-2.5 focus-ring rounded-full"
              aria-label={t.common.toTop}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[13px] font-semibold text-platinum">
                B
              </span>
              <span className="text-sm font-semibold tracking-tight text-platinum">
                BNSH <span className="text-muted">Studio</span>
              </span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-silver/60">{t.footer.about}</p>
          </div>

          {/* nav */}
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-3">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="text-left text-sm text-silver/70 transition-colors hover:text-platinum focus-ring rounded"
              >
                {t.nav[l.id]}
              </button>
            ))}
          </nav>

          {/* contacts */}
          <div className="flex flex-col gap-2.5 text-sm">
            <a href={siteConfig.contacts.telegram} target="_blank" rel="noopener noreferrer" className="text-silver/70 transition-colors hover:text-platinum focus-ring rounded">
              Telegram
            </a>
            <a href={siteConfig.contacts.instagram} target="_blank" rel="noopener noreferrer" className="text-silver/70 transition-colors hover:text-platinum focus-ring rounded">
              Instagram
            </a>
            <a href={`mailto:${siteConfig.contacts.email}`} className="text-silver/70 transition-colors hover:text-platinum focus-ring rounded">
              {siteConfig.contacts.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-faint">
            © {year} BNSH Studio. {t.footer.rights}
          </p>
          <button
            onClick={() => scrollToId('hero')}
            className="group inline-flex items-center gap-2 text-xs text-silver/60 transition-colors hover:text-platinum focus-ring rounded-full"
          >
            {t.common.toTop}
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 transition group-hover:border-gold/40">
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.75} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
