/**
 * Central site configuration.
 * Replace placeholder contacts / URLs with real values (or use .env).
 */

export const siteConfig = {
  name: 'BNSH Studio',
  brand: 'BNSH',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bnsh.space',
  locale: 'ru_RU',

  title: 'BNSH Studio — премиальные сайты и веб-приложения',
  description:
    'Портфолио BNSH Studio: современные сайты, лендинги, веб-приложения и digital-интерфейсы для бизнеса, экспертов и личных брендов.',

  tagline: 'Premium websites & digital products, crafted with precision.',

  // Contact channels.
  contacts: {
    telegram: process.env.NEXT_PUBLIC_TELEGRAM ?? 'https://t.me/ewgeess',
    telegramHandle: '@ewgeess',
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM ??
      'https://www.instagram.com/ewvgeen.s0?igsh=ZHd4eDZrOXl3YTVw&utm_source=qr',
    instagramHandle: '@ewvgeen.s0',
    email: process.env.NEXT_PUBLIC_EMAIL ?? 'ewgeen239@gmail.com',
  },
} as const;

/** In-page anchors used by the header nav and smooth scroll. */
export const navLinks = [
  { id: 'works', label: 'Работы' },
  { id: 'services', label: 'Услуги' },
  { id: 'about', label: 'Обо мне' },
  { id: 'pricing', label: 'Прайс' },
  { id: 'process', label: 'Процесс' },
  { id: 'contact', label: 'Контакты' },
] as const;
