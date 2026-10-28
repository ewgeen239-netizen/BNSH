'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { HoverPreviewProvider, PreviewLink, type PreviewItem } from './ui/hover-preview';
import { useLang, useT, getWorks, getDossier } from '@/lib/i18n';
import type { Work } from '@/lib/content';
import type { Dossier } from '@/lib/content';

/**
 * The layer below the stage: what was actually built into each project.
 *
 * Every project name in the running text is a hover preview — the screenshot
 * follows the cursor — which is what keeps a page of explanation from reading
 * like documentation. Each block is anchored as `dossier-<slug>` so the stage
 * above can jump straight to the project it is showing.
 */
export function WorkDossier() {
  const { locale } = useLang();
  const t = useT();

  const works = useMemo(() => getWorks(locale), [locale]);

  // Only projects that actually shipped get a dossier — nothing invented.
  const entries = useMemo(
    () =>
      works
        .map((w) => ({ work: w, dossier: getDossier(locale, w.slug) }))
        .filter((e): e is { work: Work; dossier: Dossier } => Boolean(e.dossier)),
    [works, locale],
  );

  const previews = useMemo(() => {
    const map: Record<string, PreviewItem> = {};
    for (const { work } of entries) {
      map[work.slug] = {
        title: work.title,
        subtitle: work.type,
        image: work.image,
        accent: work.accent[1],
        note: t.archive.noPreview,
      };
    }
    return map;
  }, [entries, t.archive.noPreview]);

  if (entries.length === 0) return null;

  return (
    <HoverPreviewProvider items={previews} hint={t.archive.previewHint}>
      <section id="dossier" className="relative scroll-mt-24 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <SectionHeading
            overline={t.archive.dossierOverline}
            title={t.archive.dossierTitle}
            intro={t.archive.dossierIntro}
          />

          {/* The hover-preview strip: every project name reveals its screen. */}
          <Reveal delay={0.1} className="mt-7">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              <span className="hud text-neon/60">{t.archive.indexLabel}</span>
              {entries.map(({ work }, i) => (
                <span key={work.slug} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/10" />}
                  <PreviewLink id={work.slug} href={work.href}>
                    {work.title}
                  </PreviewLink>
                </span>
              ))}
            </p>
          </Reveal>

          <div className="mt-12 space-y-px">
            {entries.map(({ work, dossier }, i) => (
              <DossierBlock key={work.slug} work={work} dossier={dossier} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </HoverPreviewProvider>
  );
}

function DossierBlock({
  work,
  dossier,
  index,
}: {
  work: Work;
  dossier: Dossier;
  index: number;
}) {
  const t = useT();
  const accent = work.accent[1];

  return (
    <Reveal>
      <article
        id={`dossier-${work.slug}`}
        className="group scroll-mt-28 border-t border-white/[0.07] py-10 transition-colors duration-500 hover:border-white/[0.14] sm:py-12"
        style={{ ['--a' as string]: accent }}
      >
        {/* header line */}
        <div className="flex items-center gap-4">
          <span className="hud shrink-0 tabular-nums text-neon/60">
            {String(index).padStart(2, '0')}
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
          />
          <span className="hud shrink-0 tabular-nums">{work.year}</span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          {/* left — identity */}
          <div className="min-w-0">
            <h3 className="glitch-text font-display text-2xl font-bold leading-none tracking-tightest text-platinum sm:text-3xl">
              {work.title}
            </h3>
            <p className="hud mt-3">{work.type}</p>

            <p className="mt-5 max-w-prose text-sm leading-relaxed text-silver/80">
              {dossier.summary}
            </p>

            {/* a small, treated screen of the project */}
            {work.image && (
              <div className="rounded-2xl relative mt-6 aspect-[16/10] w-full max-w-sm overflow-hidden border border-white/[0.08] bg-ink-900">
                <Image
                  src={work.image}
                  alt={`${work.title} — ${work.type}`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 380px"
                  className="object-cover object-top transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                />
                <div aria-hidden="true" className="scanlines absolute inset-0 opacity-[0.2] mix-blend-overlay" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,10,0.75),transparent_60%)]" />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="min-w-0">
                <span className="hud block">{t.archive.roleLabel}</span>
                <span className="mt-1 block text-xs text-silver/75">{dossier.role}</span>
              </span>
              {work.href && (
                <a
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full ml-auto inline-flex items-center gap-2 border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-hud text-platinum transition-colors duration-300 hover:border-[color:var(--a)] hover:text-white focus-ring"
                >
                  {t.archive.openLive}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </a>
              )}
            </div>
          </div>

          {/* right — what was built in */}
          <div className="min-w-0">
            <span className="hud block">{t.archive.builtIn}</span>

            <ul className="mt-4">
              {dossier.details.map((d, i) => (
                <li
                  key={d}
                  className="group/row relative flex items-start gap-3 border-b border-white/[0.05] py-3 transition-colors duration-300 hover:border-white/[0.14]"
                >
                  {/* the marker lights up and slides on hover */}
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 group-hover/row:translate-x-0.5"
                    style={{ background: accent, opacity: 0.55 }}
                  />
                  <span className="min-w-0 flex-1 text-sm leading-relaxed text-silver/75 transition-colors duration-300 group-hover/row:text-platinum">
                    {d}
                  </span>
                  <span className="hud mt-[3px] shrink-0 tabular-nums opacity-0 transition-opacity duration-300 group-hover/row:opacity-100">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* a scan sweeping the row under the cursor */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-0 transition-all duration-500 ease-premium group-hover/row:w-full"
                    style={{ background: accent }}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <span className="hud mr-1">{t.archive.stackLabel}</span>
              {work.stack.map((s) => (
                <span
                  key={s}
                  className="border border-white/[0.08] bg-white/[0.02] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
