'use client';

import { Analytics } from '@vercel/analytics/next';
import { useConsent } from '@/lib/consent';

/**
 * Vercel Analytics, mounted only once the visitor has granted it. Until then
 * the script is never requested, which is what makes "essential only" true
 * rather than cosmetic.
 */
export function AnalyticsGate() {
  const { consent } = useConsent();
  if (!consent?.analytics) return null;
  return <Analytics />;
}
