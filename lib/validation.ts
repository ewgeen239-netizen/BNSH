/**
 * Shared, framework-agnostic validators for the contact form.
 * Return machine codes (not messages) so the UI can localize them.
 * Goal: only accept data you can actually reach the person through.
 */

const NAME_RE = /^[\p{L}][\p{L}\s'’.-]{1,59}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEGRAM_RE = /^@[a-zA-Z0-9_]{4,32}$/;
const LINK_RE = /^(https?:\/\/)?(t\.me|telegram\.me|wa\.me)\/[A-Za-z0-9_+./-]+$/i;

export function validateName(value: string): string | null {
  const s = value.trim();
  if (!s) return 'name_required';
  if (s.length < 2) return 'name_short';
  if (s.length > 60) return 'name_long';
  if (!NAME_RE.test(s)) return 'name_letters';
  if (!/[\p{L}]{2,}/u.test(s)) return 'name_real';
  return null;
}

/** Accepts a valid email, phone, @telegram handle, or t.me/wa.me link. */
export function validateContact(value: string): string | null {
  const s = value.trim();
  if (!s) return 'contact_required';

  if (EMAIL_RE.test(s)) return null;
  if (TELEGRAM_RE.test(s)) return null;
  if (LINK_RE.test(s)) return null;

  const digits = s.replace(/\D/g, '');
  const phoneShape = /^\+?[\d\s().-]+$/.test(s);
  if (phoneShape && digits.length >= 7 && digits.length <= 15) return null;

  return 'contact_invalid';
}

export function validateContactForm(data: { name?: string; contact?: string }) {
  const errors: { name?: string; contact?: string } = {};
  const name = validateName(data.name ?? '');
  const contact = validateContact(data.contact ?? '');
  if (name) errors.name = name;
  if (contact) errors.contact = contact;
  return { valid: Object.keys(errors).length === 0, errors };
}
