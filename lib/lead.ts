/**
 * Formatting for an incoming contact-form lead.
 * Kept out of the route handler so the message can be tested on its own.
 */

export type Lead = {
  name: string;
  contact: string;
  type: string;
  message: string;
  locale: string;
};

/** Telegram rejects anything over 4096 chars; stay clear of the edge. */
export const TG_LIMIT = 3900;

/** Escape for Telegram HTML parse_mode. */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Turn whatever the visitor typed into something tappable in the chat.
 * The validator already guarantees one of these shapes.
 */
export function contactHref(raw: string): string | null {
  const s = raw.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return `mailto:${s}`;
  if (/^@[a-zA-Z0-9_]{4,32}$/.test(s)) return `https://t.me/${s.slice(1)}`;
  if (/^(t\.me|telegram\.me|wa\.me)\//i.test(s)) return `https://${s}`;
  if (/^https?:\/\/(t\.me|telegram\.me|wa\.me)\//i.test(s)) return s;
  const digits = s.replace(/\D/g, '');
  if (/^\+?[\d\s().-]+$/.test(s) && digits.length >= 7 && digits.length <= 15) {
    return `tel:+${digits}`;
  }
  return null;
}

/** The studio works out of Szczecin — stamp leads in local time, not UTC. */
export function stamp(d: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Warsaw',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Build the chat message, trimming the free-text field to fit the limit. */
export function buildTelegramMessage(lead: Lead, at: string): string {
  const href = contactHref(lead.contact);
  const contactLine = href ? `<a href="${esc(href)}">${esc(lead.contact)}</a>` : esc(lead.contact);

  const head =
    `🟡 <b>Новая заявка — BNSH</b>\n\n` +
    `👤 <b>Имя:</b> ${esc(lead.name)}\n` +
    `📞 <b>Связь:</b> ${contactLine}\n` +
    `🧩 <b>Тип:</b> ${esc(lead.type)}\n\n` +
    `📝 <b>Задача:</b>\n`;
  const foot = `\n\n🌐 ${esc(lead.locale)} · 🕐 ${at}`;

  const room = TG_LIMIT - head.length - foot.length;
  const body = esc(lead.message);
  return head + (body.length > room ? `${body.slice(0, Math.max(0, room - 1))}…` : body) + foot;
}
