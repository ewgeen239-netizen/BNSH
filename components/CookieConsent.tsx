'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { useConsent } from '@/lib/consent';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Cookie / RODO consent panel.
 *
 * Nothing non-essential loads until this is answered — Vercel Analytics is
 * mounted by the layout only once `analytics` is granted, so "essential only"
 * genuinely means no third-party script is fetched. The panel appears with a
 * short delay so it never collides with the boot screen, and it cannot be
 * dismissed without a choice: closing it is the same as "essential only",
 * which is the privacy-preserving default.
 */
export function CookieConsent() {
  const t = useT();
  const { consent, ready, accept } = useConsent();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false); // the "customise" drawer
  const [analytics, setAnalytics] = useState(false);

  const pending = ready && consent === null;

  useEffect(() => {
    if (!pending) {
      setShown(false);
      return;
    }
    const id = window.setTimeout(() => setShown(true), 900);
    return () => window.clearTimeout(id);
  }, [pending]);

  if (!pending) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.consent.title}
      className={cn(
        'fixed inset-x-3 bottom-3 z-[150] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[26rem]',
        'transition-all duration-500 ease-premium',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="rounded-2xl relative border border-white/12 bg-ink-900/95 p-4 shadow-panel backdrop-blur-xl sm:p-5">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent"
        />

        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-neon/30 bg-neon/[0.07] text-neon-soft">
            <Cookie className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <span className="hud block text-neon/70">{t.consent.tag}</span>
            <h2 className="mt-1.5 font-mono text-sm uppercase tracking-[0.12em] text-platinum">
              {t.consent.title}
            </h2>
          </div>
          <button
            onClick={() => accept(false)}
            aria-label={t.consent.essentialOnly}
            className="grid h-7 w-7 shrink-0 place-items-center border border-white/10 text-muted transition-colors hover:border-white/25 hover:text-platinum focus-ring"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-3.5 text-[13px] leading-relaxed text-silver/75">{t.consent.text}</p>

        {open && (
          <ul className="mt-4 space-y-px border-t border-white/[0.07] pt-3">
            <li className="flex items-start justify-between gap-4 py-2">
              <div className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-hud text-platinum">
                  {t.consent.necessaryLabel}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-faint">
                  {t.consent.necessaryText}
                </span>
              </div>
              <span className="hud shrink-0 whitespace-nowrap text-neon/60">{t.consent.always}</span>
            </li>
            <li className="flex items-start justify-between gap-4 border-t border-white/[0.05] py-2">
              <div className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-hud text-platinum">
                  {t.consent.analyticsLabel}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-faint">
                  {t.consent.analyticsText}
                </span>
              </div>
              <button
                role="switch"
                aria-checked={analytics}
                aria-label={t.consent.analyticsLabel}
                onClick={() => setAnalytics((v) => !v)}
                className={cn(
                  'relative mt-0.5 h-5 w-10 shrink-0 border transition-colors duration-300 focus-ring',
                  analytics ? 'border-neon/60 bg-neon/20' : 'border-white/15 bg-white/[0.03]',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-[3px] h-3 w-3 transition-all duration-300 ease-premium',
                    analytics ? 'left-[23px] bg-neon shadow-[0_0_10px_rgba(201,164,255,0.8)]' : 'left-[3px] bg-silver/60',
                  )}
                />
              </button>
            </li>
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => accept(open ? analytics : true)}
            className="rounded-full inline-flex items-center bg-neon px-4 py-2.5 font-mono text-[10px] uppercase tracking-hud text-ink-950 transition-colors duration-300 hover:bg-neon-soft focus-ring"
          >
            {open ? t.consent.save : t.consent.acceptAll}
          </button>
          <button
            onClick={() => accept(false)}
            className="rounded-full inline-flex items-center border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-hud text-silver transition-colors duration-300 hover:border-white/30 hover:text-platinum focus-ring"
          >
            {t.consent.essentialOnly}
          </button>
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="hud underline-offset-4 transition-colors hover:text-silver hover:underline focus-ring"
            >
              {t.consent.customize}
            </button>
          )}
        </div>

        <Link
          href="/privacy"
          className="hud mt-3 inline-block underline-offset-4 transition-colors hover:text-neon-soft hover:underline focus-ring"
        >
          {t.consent.policyLink} ↗
        </Link>
      </div>
    </div>
  );
}
