# BNSH Studio

Премиум-портфолио digital-специалиста: современные сайты, лендинги, веб-приложения и digital-интерфейсы. Тёмный ultra-premium дизайн, плавные scroll-анимации, рабочая контактная форма и SEO из коробки.

**Стек:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · lucide-react · Vercel.

---

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать переменные окружения (по желанию)
cp .env.example .env.local

# 3. Запустить дев-сервер
npm run dev
# → http://localhost:3000
```

Продакшн-сборка:

```bash
npm run build
npm run start
```

---

## Структура проекта

```
BNSH/
├── app/
│   ├── api/contact/route.ts     # приём заявок (валидация + опц. Resend)
│   ├── globals.css              # Tailwind + кастомные утилиты/эффекты
│   ├── layout.tsx               # <html>, метаданные, шрифты, JSON-LD
│   ├── page.tsx                 # сборка секций главной страницы
│   ├── opengraph-image.tsx      # динамическая OG-картинка 1200×630
│   ├── icon.svg                 # favicon
│   ├── robots.ts                # robots.txt
│   └── sitemap.ts               # sitemap.xml
├── components/
│   ├── Header.tsx               # sticky-хедер с blur + мобильное меню
│   ├── Hero.tsx                 # первый экран + parallax
│   ├── AuroraBackground.tsx     # премиальный фон (CSS aurora + grain)
│   ├── SelectedWorks.tsx        # секция работ + фильтры
│   ├── WorkCard.tsx             # карточка проекта
│   ├── WhatIDo.tsx / ServiceCard.tsx
│   ├── About.tsx
│   ├── Pricing.tsx / PricingCard.tsx
│   ├── Advantages.tsx
│   ├── Process.tsx / ProcessStep.tsx
│   ├── Contact.tsx / ContactForm.tsx   # форма: loading / success / error
│   ├── Footer.tsx
│   ├── SectionHeading.tsx       # заголовки секций + overline
│   ├── Reveal.tsx               # scroll-reveal обёртки (Framer Motion)
│   └── icon.tsx                 # маппинг lucide-иконок
├── lib/
│   ├── site.ts                  # бренд, контакты, навигация, SEO
│   ├── content.ts               # ВЕСЬ контент: работы, услуги, прайс…
│   └── utils.ts                 # cn(), плавный scroll к секции
├── tailwind.config.ts           # цвета, типографика, анимации
├── next.config.mjs
└── README.md
```

---

## Что редактировать под себя

Почти весь контент вынесен в данные — UI трогать не нужно.

| Что | Файл |
|-----|------|
| Название, контакты (Telegram/Instagram/email), SEO-тексты | `lib/site.ts` |
| Работы, услуги, прайс, преимущества, процесс | `lib/content.ts` |
| Цвета, шрифты, тени, анимации | `tailwind.config.ts` |
| Пункты меню | `navLinks` в `lib/site.ts` |

### Контакты

Задайте реальные каналы в `.env.local` (или прямо в `lib/site.ts`):

```env
NEXT_PUBLIC_TELEGRAM=https://t.me/ewgeess
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/ewvgeen.s0
NEXT_PUBLIC_EMAIL=ewgeen239@gmail.com
NEXT_PUBLIC_SITE_URL=https://bnsh.studio
```

### Работы (реальные скриншоты)

Сейчас карточки используют премиальные градиентные placeholder-ы. Чтобы
поставить реальные скрины проекта:

1. Положите изображение в `public/works/<slug>.jpg`.
2. В `components/WorkCard.tsx` замените градиентный блок на
   `next/image` `<Image src={...} />` (оставьте `aspect-[16/10]`).

Оптимизация изображений включена в `next.config.mjs` (AVIF/WebP).

---

## Контактная форма

Форма (`ContactForm.tsx`) шлёт `POST /api/contact` и показывает состояния
**loading → success → error**. Есть honeypot-защита от ботов.

Роут работает сразу: заявка валидируется и логируется на сервере
(`console.info`). Чтобы получать письма — подключите [Resend](https://resend.com):

```env
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO=hello@bnsh.studio
CONTACT_FROM=BNSH Studio <onboarding@resend.dev>
```

Без ключа заявки всё равно не теряются — они пишутся в логи сервера
(на Vercel видны в Runtime Logs). Логику доставки легко заменить на Telegram
Bot API, Google Sheets, CRM и т.п. — точка одна: `app/api/contact/route.ts`.

---

## Дизайн-система

- **Фон:** глубокий ink `#050505 / #080808 / #0B0B0B`.
- **Нейтрали:** platinum `#E7E7E9`, silver, muted, faint.
- **Акценты (по минимуму):** muted gold `#C6A15B`, electric blue `#5B8DEF`.
- **Типографика:** Inter (текст) + Instrument Serif (акцентные италики).
- **Эффекты:** стеклянные карточки, film grain, aurora-фон, platinum-градиент текста.
- **Анимации:** scroll-reveal, stagger, parallax hero, hover карточек,
  micro-interactions кнопок. Всё уважает `prefers-reduced-motion`.

---

## Доступность

- Семантические теги (`header`, `main`, `section`, `nav`, `footer`).
- Видимые focus-состояния (`.focus-ring`) для клавиатуры.
- `aria-*` на интерактивных элементах, `alt` на визуалах.
- Контраст текста и уважение к reduced-motion.

---

## SEO

- Метаданные и шаблон title в `app/layout.tsx`.
- Open Graph + Twitter Card, динамическая OG-картинка (`opengraph-image.tsx`).
- `sitemap.xml` и `robots.txt` генерируются автоматически.
- JSON-LD (`ProfessionalService`) в разметке.
- Тёмная тема по умолчанию, mobile-first, быстрый Lighthouse.

> После деплоя укажите правильный `NEXT_PUBLIC_SITE_URL` — от него зависят
> canonical, OG и sitemap.

---

## Деплой на Vercel

1. Запушьте проект в GitHub/GitLab.
2. На [vercel.com](https://vercel.com) → **Add New → Project** → импорт репозитория.
   Framework определится как **Next.js** автоматически.
3. В **Environment Variables** добавьте переменные из `.env.example`
   (как минимум `NEXT_PUBLIC_SITE_URL`; для писем — `RESEND_*`).
4. **Deploy**. Домен подключается в **Settings → Domains**.

CLI-вариант:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

---

## Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | дев-сервер |
| `npm run build` | продакшн-сборка |
| `npm run start` | запуск собранного приложения |
| `npm run lint` | проверка ESLint |

---

© BNSH Studio
