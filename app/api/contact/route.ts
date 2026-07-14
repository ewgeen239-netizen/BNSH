import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm } from '@/lib/validation';

export const runtime = 'nodejs';

type Payload = {
  name?: string;
  contact?: string;
  type?: string;
  message?: string;
  company?: string; // honeypot
};

function clean(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Escape for Telegram HTML parse_mode. */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  const message = clean(data.message, 4000);

  // Server-side mirror of the client validation — reject unreachable/garbage input.
  const { valid, errors } = validateContactForm({ name, contact });
  if (!valid) {
    return NextResponse.json({ error: 'Проверьте поля формы', errors }, { status: 422 });
  }

  const lead = {
    name,
    contact,
    type: type || '—',
    message: message || '—',
    at: new Date().toISOString(),
  };

  // Always log server-side so the lead isn't lost even without integrations.
  console.info('[BNSH contact] new lead:', lead);

  // --- Deliver to Telegram bot (primary channel for leads) ---
  // Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment.
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChat) {
    const text =
      `🟡 <b>Новая заявка — BNSH</b>\n\n` +
      `👤 <b>Имя:</b> ${esc(name)}\n` +
      `📞 <b>Контакт:</b> ${esc(contact)}\n` +
      `🧩 <b>Тип:</b> ${esc(lead.type)}\n` +
      `📝 <b>Описание:</b> ${esc(lead.message)}\n\n` +
      `🕐 ${lead.at}`;
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChat,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      if (!res.ok) {
        console.error('[BNSH contact] Telegram failed:', await res.text());
      }
    } catch (err) {
      console.error('[BNSH contact] Telegram error:', err);
    }
  }

  // Email delivery via Resend if configured. Falls back gracefully.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? 'BNSH Studio <onboarding@resend.dev>';

  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: contact.includes('@') ? contact : undefined,
        subject: `Новая заявка · ${name} (${lead.type})`,
        text: `Имя: ${name}\nКонтакт: ${contact}\nТип: ${lead.type}\n\n${lead.message}\n\n${lead.at}`,
      });
      if (error) {
        // Lead is already logged — treat as soft success so the user isn't blocked.
        console.error('[BNSH contact] Resend failed:', error);
      }
    } catch (err) {
      console.error('[BNSH contact] Resend error:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
