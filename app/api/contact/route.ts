import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm } from '@/lib/validation';
import { buildTelegramMessage, stamp } from '@/lib/lead';

export const runtime = 'nodejs';

type Payload = {
  name?: string;
  contact?: string;
  type?: string;
  message?: string;
  locale?: string;
  company?: string; // honeypot
};

const TG_TIMEOUT_MS = 8000;
const TG_ATTEMPTS = 2;

function clean(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * A cold serverless invocation can lose the first outbound connection, so one
 * retry is worth it — this is the channel the lead actually arrives on.
 */
async function sendTelegram(token: string, chatId: string, text: string): Promise<boolean> {
  for (let attempt = 1; attempt <= TG_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(TG_TIMEOUT_MS),
      });
      if (res.ok) return true;
      // 4xx is a config error (bad token, wrong chat id) — retrying won't fix it.
      const body = await res.text();
      console.error(`[BNSH contact] Telegram ${res.status}:`, body);
      if (res.status >= 400 && res.status < 500) return false;
    } catch (err) {
      console.error(`[BNSH contact] Telegram attempt ${attempt} failed:`, err);
    }
  }
  return false;
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  // Honeypot — silently accept and drop.
  if (clean(data.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(data.name, 120);
  const contact = clean(data.contact, 200);
  const type = clean(data.type, 120);
  const message = clean(data.message, 2000);
  const locale = clean(data.locale, 8).toUpperCase() || '—';

  // Server-side mirror of the client validation — reject unreachable/garbage input.
  const { valid, errors } = validateContactForm({ name, contact });
  if (!valid) {
    return NextResponse.json({ error: 'Проверьте поля формы', errors }, { status: 422 });
  }

  const at = stamp(new Date());
  const lead = { name, contact, type: type || '—', message: message || '—', locale, at };

  // Log first: whatever happens downstream, the lead exists in the runtime logs.
  console.info('[BNSH contact] new lead:', lead);

  const text = buildTelegramMessage(lead, at);

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  const tgConfigured = Boolean(tgToken && tgChat);

  const telegramOk = tgConfigured ? await sendTelegram(tgToken!, tgChat!, text) : false;

  // Email is the backup channel; it never blocks the response on its own.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? 'BNSH Studio <onboarding@resend.dev>';
  const emailConfigured = Boolean(apiKey && to);
  let emailOk = false;

  if (emailConfigured) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to: [to!],
        replyTo: contact.includes('@') ? contact : undefined,
        subject: `Новая заявка · ${name} (${lead.type})`,
        text:
          `Имя: ${name}\nКонтакт: ${contact}\nТип: ${lead.type}\nЯзык: ${locale}\n\n` +
          `${lead.message}\n\n${at}`,
      });
      emailOk = !error;
      if (error) console.error('[BNSH contact] Resend failed:', error);
    } catch (err) {
      console.error('[BNSH contact] Resend error:', err);
    }
  }

  if (telegramOk || emailOk) {
    return NextResponse.json({ ok: true });
  }

  // Nothing is wired up at all — fine locally, never acceptable in production.
  if (!tgConfigured && !emailConfigured) {
    console.warn('[BNSH contact] no delivery channel configured; lead only in logs');
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ ok: true });
    }
  }

  // Telling the visitor it went through when it did not is how leads disappear.
  console.error('[BNSH contact] delivery failed on every channel:', lead);
  return NextResponse.json({ error: 'Не удалось доставить заявку' }, { status: 502 });
}
