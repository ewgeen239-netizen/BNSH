'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { CyberBackground } from './CyberBackground';
import { Reveal } from './Reveal';
import { useConsent } from '@/lib/consent';
import { useT } from '@/lib/i18n';
import { siteConfig } from '@/lib/site';

/** Last substantive change to this policy. Bump it when the text changes. */
const UPDATED = '2026-10-28';

/**
 * Privacy / cookie / RODO page. Same cockpit language as the rest of the site,
 * but deliberately plain in its typography: this is the one place on the site
 * where reading comes before effect.
 */
export function PrivacyContent() {
  const t = useT();
  const { consent, reset } = useConsent();

  return (
    <main id="main" className="relative min-h-screen pt-28 pb-24">
      <CyberBackground horizon={false} />

      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <Link
            href="/"
            className="hud inline-flex items-center gap-2 transition-colors hover:text-neon-soft focus-ring"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            {t.privacy.back}
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <span className="hud mt-10 flex items-center gap-2 text-neon/70">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.privacy.tag}
          </span>
          <h1 className="mt-5 font-display text-display-md font-bold text-platinum">
            {t.privacy.title}
          </h1>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-silver/80 sm:text-base">
            {t.privacy.intro}
          </p>
          <p className="hud mt-5">
            {t.privacy.updated} <span className="tabular-nums text-silver/70">{UPDATED}</span>
          </p>
        </Reveal>

        {/* policy body */}
        <div className="mt-14 space-y-px">
          {t.privacy.sections.map((s, i) => (
            <Reveal key={s.h}>
              <section className="border-t border-white/[0.07] py-8">
                <div className="flex items-baseline gap-4">
                  <span className="hud shrink-0 tabular-nums text-neon/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-mono text-sm uppercase tracking-[0.12em] text-platinum">{s.h}</h2>
                </div>
                <div className="mt-4 space-y-3 pl-0 sm:pl-10">
                  {s.p.map((p) => (
                    <p key={p} className="max-w-prose text-sm leading-relaxed text-silver/75">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        {/* what is stored in the browser */}
        <Reveal>
          <section className="mt-10 border-t border-white/[0.07] py-8">
            <h2 className="font-mono text-sm uppercase tracking-[0.12em] text-platinum">
              {t.privacy.cookieTableTitle}
            </h2>
            <ul className="mt-5 space-y-px">
              {t.privacy.cookieTable.map((c) => (
                <li
                  key={c.name}
                  className="grid gap-1 border-b border-white/[0.05] py-3 sm:grid-cols-[11rem_1fr_7rem] sm:items-baseline sm:gap-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-neon-soft/90">
                    {c.name}
                  </span>
                  <span className="text-sm text-silver/75">{c.purpose}</span>
                  <span className="hud sm:text-right">
                    {c.life} · {c.group}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* consent control */}
        <Reveal>
          <section className="rounded-2xl mt-10 border border-white/[0.09] bg-ink-900/60 p-5 sm:p-6">
            <h2 className="font-mono text-sm uppercase tracking-[0.12em] text-platinum">
              {t.privacy.manageTitle}
            </h2>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-silver/75">
              {t.privacy.manageText}
            </p>
            {consent && (
              <p className="hud mt-4">
                {t.consent.decidedAt}:{' '}
                <span className="tabular-nums text-silver/70">
                  {new Date(consent.decidedAt).toLocaleString()}
                </span>
                {' · '}
                {t.consent.analyticsLabel}: {consent.analytics ? 'on' : 'off'}
              </p>
            )}
            <button
              onClick={reset}
              className="rounded-full mt-5 inline-flex items-center border border-neon/40 bg-neon/[0.07] px-4 py-2.5 font-mono text-[10px] uppercase tracking-hud text-neon-soft transition-colors duration-300 hover:bg-neon/[0.14] focus-ring"
            >
              {t.privacy.manageButton}
            </button>
          </section>
        </Reveal>

        <Reveal>
          <p className="hud mt-10">
            {siteConfig.name} ·{' '}
            <a
              href={`mailto:${siteConfig.contacts.email}`}
              className="underline-offset-4 transition-colors hover:text-neon-soft hover:underline focus-ring"
            >
              {siteConfig.contacts.email}
            </a>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
