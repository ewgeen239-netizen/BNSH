/**
 * Shared, framework-agnostic validators for the contact form.
 * Used on the client (live feedback) and re-checked on the server.
 * Goal: only accept data you can actually reach the person through.
 */

const NAME_RE = /^[\p{L}][\p{L}\s'’.-]{1,59}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEGRAM_RE = /^@[a-zA-Z0-9_]{4,32}$/;
const LINK_RE = /^(https?:\/\/)?(t\.me|telegram\.me|wa\.me)\/[A-Za-z0-9_+./-]+$/i;

export function validateName(value: string): string | null {
  const s = value.trim();
  if (!s) return 'Укажите имя';
  if (s.length < 2) return 'Слишком короткое имя';
  if (s.length > 60) return 'Слишком длинное имя';
  // letters (any alphabet) + spaces / hyphen / apostrophe / dot only
  if (!NAME_RE.test(s)) return 'Только буквы — без цифр и символов';
  // must contain at least two letters in a row (blocks "a.", "j j")
  if (!/[\p{L}]{2,}/u.test(s)) return 'Введите настоящее имя';
  return null;
}

/** Accepts a valid email, phone, @telegram handle, or t.me/wa.me link. */
export function validateContact(value: string): string | null {
  const s = value.trim();
  if (!s) return 'Укажите контакт для связи';

  if (EMAIL_RE.test(s)) return null;
  if (TELEGRAM_RE.test(s)) return null;
  if (LINK_RE.test(s)) return null;

  // Phone: digits with optional +, spaces, (), - — 7..15 digits total.
  const digits = s.replace(/\D/g, '');
  const phoneShape = /^\+?[\d\s().-]+$/.test(s);
  if (phoneShape && digits.length >= 7 && digits.length <= 15) return null;

  return 'Введите email, телефон или @telegram';
}

export function validateContactForm(data: { name?: string; contact?: string }) {
  const errors: { name?: string; contact?: string } = {};
  const name = validateName(data.name ?? '');
  const contact = validateContact(data.contact ?? '');
  if (name) errors.name = name;
  if (contact) errors.contact = contact;
  return { valid: Object.keys(errors).length === 0, errors };
}
