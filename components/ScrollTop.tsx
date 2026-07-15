'use client';

import { useEffect } from 'react';

/**
 * On (re)load the page should start at the very top, not where the browser
 * restored the previous scroll position. Disable scroll restoration and jump
 * to the top instantly (avoids the global smooth-scroll animation).
 */
export function ScrollTop() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return null;
}
