import { NextResponse } from 'next/server';
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

  // Always log server-side so the lead isn't lost even without email setup.
  console.info('[BNSH contact] new lead:', lead);

  // Optional: deliver via Resend if configured. Falls back gracefully.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? 'BNSH Studio <onboarding@resend.dev>';

  if (apiKey && to) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: contact.includes('@') ? contact : undefined,
          subject: `Новая заявка · ${name} (${lead.type})`,
          text: `Имя: ${name}\nКонтакт: ${contact}\nТип: ${lead.type}\n\n${lead.message}\n\n${lead.at}`,
        }),
      });

      if (!res.ok) {
        console.error('[BNSH contact] Resend failed:', await res.text());
        // Lead is logged — treat as soft success so the user isn't blocked.
      }
    } catch (err) {
      console.error('[BNSH contact] Resend error:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
