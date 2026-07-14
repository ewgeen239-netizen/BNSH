'use client';

import { motion } from 'framer-motion';
import { locales, localeLabels, useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Quick segmented language switcher: RU · EN · PL. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLang();

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 backdrop-blur',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={cn(
              'relative z-10 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus-ring sm:px-3',
              active ? 'text-ink-950' : 'text-silver/70 hover:text-platinum',
            )}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-platinum"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {localeLabels[l]}
          </button>
        );
      })}
    </div>
  );
}
