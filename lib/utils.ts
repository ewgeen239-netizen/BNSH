export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Smooth-scroll to an in-page section by id, accounting for the sticky header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 88;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}
