'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Cookie / consent state (GDPR · RODO).
 *
 * Only two buckets exist, which is all this site actually needs:
 *  - `necessary` is implicit and cannot be switched off (language choice,
 *    the consent record itself, the boot-screen flag);
 *  - `analytics` gates Vercel Analytics, which is therefore not loaded at all
 *    until it is granted. No marketing or third-party ad cookies exist here.
 *
 * The decision is stored in localStorage (not a cookie) so nothing at all is
 * sent to the server before the visitor has chosen.
 */

export type Consent = {
  analytics: boolean;
  /** ISO timestamp of the decision — shown back to the visitor on request. */
  decidedAt: string;
  /** Bumped when the wording or the buckets change, which re-asks everyone. */
  version: number;
};

export const CONSENT_VERSION = 1;
const KEY = 'bnsh-consent';

type Ctx = {
  /** `null` while unknown — either not asked yet or not yet read from storage. */
  consent: Consent | null;
  /** True once storage has been read, so the banner never flashes on reload. */
  ready: boolean;
  accept: (analytics: boolean) => void;
  /** Wipe the decision and ask again. */
  reset: () => void;
};

const ConsentContext = createContext<Ctx | null>(null);

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(read());
    setReady(true);
  }, []);

  const accept = useCallback((analytics: boolean) => {
    const next: Consent = {
      analytics,
      decidedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    setConsent(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const reset = useCallback(() => {
    setConsent(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, ready, accept, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): Ctx {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
