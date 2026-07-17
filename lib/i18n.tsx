'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  works as baseWorks,
  services as baseServices,
  plans as basePlans,
  advantages as baseAdvantages,
  steps as baseSteps,
  type Work,
  type Service,
  type Plan,
  type Advantage,
  type Step,
} from './content';

export type Locale = 'ru' | 'en' | 'pl';
export const locales: Locale[] = ['ru', 'en', 'pl'];
export const localeLabels: Record<Locale, string> = { ru: 'RU', en: 'EN', pl: 'PL' };

/* ------------------------------------------------------------------ */
/* UI strings                                                          */
/* ------------------------------------------------------------------ */

type UIDict = {
  madeBy: string;
  nav: { works: string; services: string; about: string; pricing: string; process: string; contact: string };
  common: { discuss: string; details: string; live: string; toTop: string; writeTelegram: string };
  hero: {
    badge: string;
    taglineA: string;
    taglineB: string;
    description: string;
    ctaWorks: string;
    ctaDiscuss: string;
    quickJump: string;
    trust: [string, string][];
    scroll: string;
  };
  works: { title: string; intro: string; filterAll: string; exampleNote: string };
  services: { title: string; intro: string };
  pricing: { title: string; intro: string; note: string; popular: string; byTask: string };
  advantages: { title: string; intro: string };
  process: { title: string; intro: string };
  contact: {
    title: string;
    intro: string;
    form: {
      name: string; namePh: string;
      contact: string; contactPh: string; contactHint: string;
      type: string; typePh: string; typeOptions: string[];
      message: string; messagePh: string;
      submit: string; sending: string;
      consent: string;
      successTitle: string; successText: string; successAgain: string;
      errorGeneric: string;
    };
  };
  footer: { about: string; rights: string };
  errors: Record<string, string>;
};

const ui: Record<Locale, UIDict> = {
  ru: {
    madeBy: 'Личная страница — часть моего портфолио',
    nav: { works: 'Работы', services: 'Услуги', about: 'Обо мне', pricing: 'Прайс', process: 'Процесс', contact: 'Контакты' },
    common: { discuss: 'Обсудить проект', details: 'Подробнее', live: 'Live', toTop: 'Наверх', writeTelegram: 'Написать в Telegram' },
    hero: {
      badge: 'BNSH Studio — digital craft',
      taglineA: 'Premium websites & digital products',
      taglineB: 'crafted with precision.',
      description:
        'Проектирую и разрабатываю сайты и цифровые продукты, которые выглядят дорого и работают на результат. Ниже — мои работы, форматы сотрудничества и способ связаться.',
      ctaWorks: 'Смотреть работы',
      ctaDiscuss: 'Обсудить проект',
      quickJump: 'Быстрый переход',
      trust: [['Сайты', 'под бизнес'], ['Лендинги', 'под заявки'], ['Веб-приложения', 'и интерфейсы']],
      scroll: 'Ниже',
    },
    works: { title: 'Мои работы', intro: 'Подборка сайтов и приложений. Каждый проект — отдельная задача бизнеса и аккуратно собранное решение под неё.', filterAll: 'Все', exampleNote: 'Это пример того, на что я способен' },
    services: { title: 'Что я делаю', intro: 'От простого лендинга до веб-приложения. Подбираю формат под задачу и веду проект от идеи до запуска.' },
    pricing: { title: 'Форматы и цены', intro: 'Три понятных формата под разные задачи. Финальная цена — под задачу.', note: 'Финальная цена зависит от задачи, объёма, контента и сроков. После короткого обсуждения предложу точную смету и формат.', popular: 'Популярно', byTask: 'Цена зависит от задачи' },
    advantages: { title: 'Почему со мной удобно', intro: 'Работа без лишней бюрократии — с вниманием к результату и вашему времени.' },
    process: { title: 'Как проходит работа', intro: 'Прозрачный маршрут от первого сообщения до запуска. Никаких сюрпризов — вы видите каждый этап.' },
    contact: {
      title: 'Расскажите о проекте — я предложу лучший формат сайта.',
      intro: 'Опишите задачу в двух словах. Отвечу, задам пару вопросов и предложу подходящий формат, сроки и смету.',
      form: {
        name: 'Имя', namePh: 'Как к вам обращаться',
        contact: 'Контакт', contactPh: 'Email, телефон или @telegram', contactHint: 'Например: name@mail.com · +48 600 000 000 · @username',
        type: 'Тип проекта', typePh: 'Выберите формат', typeOptions: ['Лендинг', 'Сайт для бизнеса', 'Портфолио / личный бренд', 'Веб-приложение', 'Редизайн', 'Другое'],
        message: 'Коротко о проекте', messagePh: 'Что нужно, для кого, есть ли примеры и сроки',
        submit: 'Отправить заявку', sending: 'Отправляю…',
        consent: 'Нажимая «Отправить», вы соглашаетесь на обработку данных для ответа на заявку.',
        successTitle: 'Заявка отправлена', successText: 'Спасибо! Я свяжусь с вами в ближайшее время и предложу лучший формат под задачу.', successAgain: 'Отправить ещё одну',
        errorGeneric: 'Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.',
      },
    },
    footer: { about: 'Премиальная разработка сайтов и веб-приложений под задачу клиента. BNSH Production · Digital · Web Studio.', rights: 'Все права защищены.' },
    errors: {
      name_required: 'Укажите имя', name_short: 'Слишком короткое имя', name_long: 'Слишком длинное имя', name_letters: 'Только буквы — без цифр и символов', name_real: 'Введите настоящее имя',
      contact_required: 'Укажите контакт для связи', contact_invalid: 'Введите email, телефон или @telegram',
    },
  },

  en: {
    madeBy: 'Personal page — part of my portfolio',
    nav: { works: 'Work', services: 'Services', about: 'About', pricing: 'Pricing', process: 'Process', contact: 'Contact' },
    common: { discuss: 'Discuss a project', details: 'View', live: 'Live', toTop: 'To top', writeTelegram: 'Message on Telegram' },
    hero: {
      badge: 'BNSH Studio — digital craft',
      taglineA: 'Premium websites & digital products',
      taglineB: 'crafted with precision.',
      description:
        'I design and build websites and digital products that look premium and drive results. Below: my work, ways to collaborate, and how to reach me.',
      ctaWorks: 'View work',
      ctaDiscuss: 'Discuss a project',
      quickJump: 'Quick jump',
      trust: [['Websites', 'for business'], ['Landing pages', 'for leads'], ['Web apps', 'and interfaces']],
      scroll: 'Scroll',
    },
    works: { title: 'Selected work', intro: 'A selection of websites and apps. Each project is a specific business problem with a solution built precisely around it.', filterAll: 'All', exampleNote: 'An example of what I can build' },
    services: { title: 'What I do', intro: 'From a simple landing page to a web app. I pick the right format for the task and run the project from idea to launch.' },
    pricing: { title: 'Formats & pricing', intro: 'Three clear formats for different needs. The final price is scoped to the task.', note: 'The final price depends on the task, scope, content and timeline. After a short chat I’ll propose an exact quote and format.', popular: 'Popular', byTask: 'Price depends on the task' },
    advantages: { title: 'Why it’s easy to work with me', intro: 'Work without extra bureaucracy — with attention to the result and your time.' },
    process: { title: 'How we work', intro: 'A clear path from the first message to launch. No surprises — you see every stage.' },
    contact: {
      title: 'Tell me about your project — I’ll suggest the best format.',
      intro: 'Describe the task in a couple of lines. I’ll reply, ask a few questions and propose a format, timeline and quote.',
      form: {
        name: 'Name', namePh: 'How should I address you',
        contact: 'Contact', contactPh: 'Email, phone or @telegram', contactHint: 'e.g. name@mail.com · +48 600 000 000 · @username',
        type: 'Project type', typePh: 'Choose a format', typeOptions: ['Landing page', 'Business site', 'Portfolio / personal brand', 'Web app', 'Redesign', 'Other'],
        message: 'About the project', messagePh: 'What you need, for whom, references and timeline',
        submit: 'Send request', sending: 'Sending…',
        consent: 'By clicking “Send” you agree to your data being processed to reply to your request.',
        successTitle: 'Request sent', successText: 'Thank you! I’ll get back to you shortly and suggest the best format for your task.', successAgain: 'Send another',
        errorGeneric: 'Couldn’t send. Please try again or message me on Telegram.',
      },
    },
    footer: { about: 'Premium websites and web apps built around the client’s task. BNSH Production · Digital · Web Studio.', rights: 'All rights reserved.' },
    errors: {
      name_required: 'Enter your name', name_short: 'Name is too short', name_long: 'Name is too long', name_letters: 'Letters only — no digits or symbols', name_real: 'Enter a real name',
      contact_required: 'Enter a contact', contact_invalid: 'Enter an email, phone or @telegram',
    },
  },

  pl: {
    madeBy: 'Strona osobista — część mojego portfolio',
    nav: { works: 'Prace', services: 'Usługi', about: 'O mnie', pricing: 'Cennik', process: 'Proces', contact: 'Kontakt' },
    common: { discuss: 'Omów projekt', details: 'Zobacz', live: 'Live', toTop: 'Do góry', writeTelegram: 'Napisz na Telegramie' },
    hero: {
      badge: 'BNSH Studio — digital craft',
      taglineA: 'Premium websites & digital products',
      taglineB: 'crafted with precision.',
      description:
        'Projektuję i buduję strony oraz produkty cyfrowe, które wyglądają premium i działają na wynik. Poniżej: moje prace, formy współpracy i sposób kontaktu.',
      ctaWorks: 'Zobacz prace',
      ctaDiscuss: 'Omów projekt',
      quickJump: 'Szybkie przejście',
      trust: [['Strony', 'dla biznesu'], ['Landing page', 'pod zapytania'], ['Aplikacje web', 'i interfejsy']],
      scroll: 'Niżej',
    },
    works: { title: 'Wybrane prace', intro: 'Wybór stron i aplikacji. Każdy projekt to konkretne zadanie biznesowe i rozwiązanie starannie dopasowane pod nie.', filterAll: 'Wszystkie', exampleNote: 'Przykład tego, co potrafię' },
    services: { title: 'Czym się zajmuję', intro: 'Od prostego landing page po aplikację web. Dobieram format pod zadanie i prowadzę projekt od pomysłu do startu.' },
    pricing: { title: 'Formaty i ceny', intro: 'Trzy jasne formaty pod różne zadania. Ostateczna cena zależy od zadania.', note: 'Ostateczna cena zależy od zadania, zakresu, treści i terminu. Po krótkiej rozmowie zaproponuję dokładną wycenę i format.', popular: 'Popularny', byTask: 'Cena zależy od zadania' },
    advantages: { title: 'Dlaczego wygodnie się ze mną pracuje', intro: 'Praca bez zbędnej biurokracji — z uwagą na efekt i Twój czas.' },
    process: { title: 'Jak przebiega praca', intro: 'Przejrzysta droga od pierwszej wiadomości do startu. Bez niespodzianek — widzisz każdy etap.' },
    contact: {
      title: 'Opowiedz o projekcie — zaproponuję najlepszy format.',
      intro: 'Opisz zadanie w dwóch zdaniach. Odpowiem, zadam kilka pytań i zaproponuję format, termin i wycenę.',
      form: {
        name: 'Imię', namePh: 'Jak się do Ciebie zwracać',
        contact: 'Kontakt', contactPh: 'E-mail, telefon lub @telegram', contactHint: 'np. name@mail.com · +48 600 000 000 · @username',
        type: 'Typ projektu', typePh: 'Wybierz format', typeOptions: ['Landing page', 'Strona firmowa', 'Portfolio / marka osobista', 'Aplikacja web', 'Redesign', 'Inne'],
        message: 'Krótko o projekcie', messagePh: 'Co potrzebne, dla kogo, przykłady i termin',
        submit: 'Wyślij zgłoszenie', sending: 'Wysyłam…',
        consent: 'Klikając „Wyślij”, zgadzasz się na przetwarzanie danych w celu odpowiedzi na zgłoszenie.',
        successTitle: 'Zgłoszenie wysłane', successText: 'Dziękuję! Odezwę się wkrótce i zaproponuję najlepszy format pod Twoje zadanie.', successAgain: 'Wyślij kolejne',
        errorGeneric: 'Nie udało się wysłać. Spróbuj ponownie lub napisz na Telegramie.',
      },
    },
    footer: { about: 'Premium strony i aplikacje web budowane pod zadanie klienta. BNSH Production · Digital · Web Studio.', rights: 'Wszelkie prawa zastrzeżone.' },
    errors: {
      name_required: 'Podaj imię', name_short: 'Imię jest za krótkie', name_long: 'Imię jest za długie', name_letters: 'Tylko litery — bez cyfr i symboli', name_real: 'Podaj prawdziwe imię',
      contact_required: 'Podaj kontakt', contact_invalid: 'Podaj e-mail, telefon lub @telegram',
    },
  },
};

/* ------------------------------------------------------------------ */
/* Localized data (text overrides; structure comes from content.ts)   */
/* ------------------------------------------------------------------ */

// Works: text overrides keyed by slug for en/pl. ru uses content.ts as-is.
const worksText: Record<'en' | 'pl', Record<string, { title?: string; type: string; description: string }>> = {
  en: {
    balance: { type: 'Bar website · cocktails & shisha', description: 'A lounge-bar site in Szczecin: atmospheric visuals, menu, online booking and four languages.' },
    autodoc: { type: 'Telegram bot', description: 'A Telegram bot for document tracking — requests and statuses right inside the chat.' },
    krasnovska: { type: 'Personal brand', description: 'A personal-brand site: studio, portfolio, services and a multilingual UI. Calm, premium presentation.' },
    'aurora-clinic': { type: 'Clinic website', description: 'A multi-page medical center site: services, doctors, booking. Calm premium tone and clear navigation.' },
    'lumen-coaching': { type: 'Lead landing page', description: 'A selling landing page for an expert: strong structure, cases, a high-converting consultation form.' },
    'vela-finance': { type: 'Web app', description: 'A personal finance dashboard: charts, categories, goals. Thoughtful UX and a light data interface.' },
    'nord-estate': { type: 'Real estate site', description: 'A property catalog with filters, cards and a viewing request. Rich typography and careful details.' },
    'atelier-kova': { type: 'Portfolio / personal brand', description: 'A product designer’s portfolio: gallery, brand story, contacts. Quiet luxury and lots of air.' },
    'pulse-analytics': { type: 'SaaS interface', description: 'A team analytics panel: real-time metrics, tables, loading and empty states.' },
    'form-studio': { type: 'Studio landing', description: 'A one-pager for a creative studio: strong hero, services, reviews, a clear call to action.' },
    'meridian-os': { type: 'Concept interface', description: 'An experimental workspace concept: bold composition, micro-interactions, motion details.' },
  },
  pl: {
    balance: { type: 'Strona baru · koktajle i shisha', description: 'Strona lounge baru w Szczecinie: klimatyczna oprawa, menu, rezerwacja online i cztery języki.' },
    autodoc: { type: 'Bot Telegram', description: 'Bot Telegram do śledzenia dokumentów — zgłoszenia i statusy prosto na czacie.' },
    krasnovska: { type: 'Marka osobista', description: 'Strona marki osobistej: studio, portfolio, usługi i wielojęzyczność. Spokojna, premium prezentacja.' },
    'aurora-clinic': { type: 'Strona kliniki', description: 'Wielostronicowa strona centrum medycznego: usługi, lekarze, rejestracja. Spokojny, premium ton.' },
    'lumen-coaching': { type: 'Landing pod zapytania', description: 'Sprzedażowy landing dla eksperta: mocna struktura, case’y, konwertujący formularz konsultacji.' },
    'vela-finance': { type: 'Aplikacja web', description: 'Dashboard finansów osobistych: wykresy, kategorie, cele. Przemyślany UX i lekki interfejs danych.' },
    'nord-estate': { type: 'Strona nieruchomości', description: 'Katalog ofert z filtrami, kartami i zapytaniem o oglądanie. Bogata typografia i dbałość o detale.' },
    'atelier-kova': { type: 'Portfolio / marka osobista', description: 'Portfolio projektanta produktu: galeria, historia marki, kontakt. Cicha elegancja i dużo powietrza.' },
    'pulse-analytics': { type: 'Interfejs SaaS', description: 'Panel analityczny zespołu: metryki na żywo, tabele, stany ładowania i pustych danych.' },
    'form-studio': { type: 'Landing studia', description: 'One-pager dla kreatywnego studia: mocny hero, usługi, opinie, wyraźne wezwanie do działania.' },
    'meridian-os': { type: 'Koncept interfejsu', description: 'Eksperymentalny koncept przestrzeni pracy: odważna kompozycja, mikrointerakcje, detale ruchu.' },
  },
};

// Services text by index (aligned to content.ts order).
const servicesText: Record<'en' | 'pl', { title: string; description: string }[]> = {
  en: [
    { title: 'Business websites', description: 'Multi-page sites for companies and local business — with a clear structure and careful design.' },
    { title: 'Lead landing pages', description: 'One-pagers that lead the visitor to the goal: a request, a call or a purchase.' },
    { title: 'Portfolios & personal brands', description: 'Personal sites for experts and authors — so the brand looks premium and convincing.' },
    { title: 'Web apps', description: 'Interfaces with logic: dashboards, accounts, tools. Thoughtful UX for real scenarios.' },
    { title: 'UI/UX prototypes', description: 'Structure and visual direction before build — to align the idea fast, without extra edits.' },
    { title: 'Redesign of old sites', description: 'I refresh outdated sites: modern look, speed, responsiveness and usability without losing the point.' },
    { title: 'Launch & basic SEO', description: 'I prepare the site for release: domain, metadata, sitemap, speed and basic search optimization.' },
  ],
  pl: [
    { title: 'Strony dla biznesu', description: 'Wielostronicowe strony dla firm i lokalnego biznesu — z jasną strukturą i starannym designem.' },
    { title: 'Landingi pod zapytania', description: 'One-pagery, które prowadzą odwiedzającego do celu: zapytania, telefonu lub zakupu.' },
    { title: 'Portfolio i marki osobiste', description: 'Strony osobiste dla ekspertów i autorów — żeby marka wyglądała premium i przekonująco.' },
    { title: 'Aplikacje web', description: 'Interfejsy z logiką: dashboardy, panele, narzędzia. Przemyślany UX pod realne scenariusze.' },
    { title: 'Prototypy UI/UX', description: 'Struktura i kierunek wizualny przed budową — by szybko uzgodnić pomysł, bez zbędnych poprawek.' },
    { title: 'Redesign starych stron', description: 'Odświeżam przestarzałe strony: nowoczesny wygląd, szybkość, responsywność i wygodę bez utraty sensu.' },
    { title: 'Start i podstawowe SEO', description: 'Przygotowuję stronę do publikacji: domena, metadane, sitemap, szybkość i podstawowe SEO.' },
  ],
};

// Plans text by index.
const plansText: Record<'en' | 'pl', { audience: string; priceNote: string; features: string[] }[]> = {
  en: [
    { audience: 'For a simple landing page or a service page', priceNote: 'from', features: ['Well-crafted structure and offer', 'Custom design', 'Responsive for phone and desktop', 'Request form', 'Basic SEO'] },
    { audience: 'For a company, expert or local business', priceNote: 'from', features: ['Several sections or pages', 'Portfolio / services / about', 'Contacts and map', 'Responsive and subtle animation', 'SEO prep for launch'] },
    { audience: 'For a web app, personal brand or non-standard project', priceNote: 'custom', features: ['UX structure and scenarios', 'Design system', 'Complex interfaces and states', 'Thoughtful animations', 'Integrations for the task'] },
  ],
  pl: [
    { audience: 'Dla prostego landing page lub strony usługi', priceNote: 'od', features: ['Dopracowana struktura i oferta', 'Indywidualny design', 'Responsywność na telefon i desktop', 'Formularz zgłoszenia', 'Podstawowe SEO'] },
    { audience: 'Dla firmy, eksperta lub lokalnego biznesu', priceNote: 'od', features: ['Kilka sekcji lub stron', 'Portfolio / usługi / o firmie', 'Kontakt i mapa', 'Responsywność i subtelna animacja', 'Przygotowanie SEO do startu'] },
    { audience: 'Dla aplikacji web, marki osobistej lub niestandardowego projektu', priceNote: 'indywidualnie', features: ['Struktura UX i scenariusze', 'System projektowy', 'Złożone interfejsy i stany', 'Przemyślane animacje', 'Integracje pod zadanie'] },
  ],
};

// Advantages text by index.
const advantagesText: Record<'en' | 'pl', { title: string; text: string }[]> = {
  en: [
    { title: 'Personal involvement', text: 'I run the project myself — from idea to launch. You talk directly to the person who builds it.' },
    { title: 'Modern level', text: 'Current visuals and details that read as “premium”.' },
    { title: 'Clear workflow', text: 'Clear stages and deadlines. You always know what’s happening with the project.' },
    { title: 'Responsive on every screen', text: 'Equally neat on phone, tablet and desktop.' },
    { title: 'Animation without overload', text: 'Smooth, calm transitions that help rather than distract.' },
    { title: 'Fast launch', text: 'The first working version — fast, without endless approvals.' },
    { title: 'Help with copy', text: 'I help with wording and positioning so the site sells the benefit.' },
    { title: 'Basic SEO', text: 'I prepare the site for indexing: metadata, speed, semantics.' },
  ],
  pl: [
    { title: 'Osobiste zaangażowanie', text: 'Prowadzę projekt sam — od pomysłu do startu. Rozmawiasz wprost z osobą, która go tworzy.' },
    { title: 'Nowoczesny poziom', text: 'Aktualna oprawa i detale, które czytają się jako „premium”.' },
    { title: 'Jasny przebieg pracy', text: 'Jasne etapy i terminy. Zawsze wiesz, co dzieje się z projektem.' },
    { title: 'Responsywność na każdym ekranie', text: 'Równie starannie na telefonie, tablecie i desktopie.' },
    { title: 'Animacja bez przeładowania', text: 'Płynne, spokojne przejścia, które pomagają, a nie rozpraszają.' },
    { title: 'Szybki start', text: 'Pierwsza działająca wersja — szybko, bez niekończących się akceptacji.' },
    { title: 'Pomoc z tekstami', text: 'Pomogę ze sformułowaniami i pozycjonowaniem, żeby strona sprzedawała korzyść.' },
    { title: 'Podstawowe SEO', text: 'Przygotowuję stronę do indeksowania: metadane, szybkość, semantyka.' },
  ],
};

// Steps text by index.
const stepsText: Record<'en' | 'pl', { title: string; text: string }[]> = {
  en: [
    { title: 'Intro', text: 'A short call or chat — tell me about the task and what you already have.' },
    { title: 'Site goal', text: 'We define what the site is for and what action the visitor should take.' },
    { title: 'Structure & direction', text: 'I put together the structure and visual direction, we align before design.' },
    { title: 'Design & build', text: 'I design and immediately assemble a working version on a modern stack.' },
    { title: 'Revisions', text: 'We go through revision rounds — adjustments until the right result.' },
    { title: 'Launch', text: 'I publish the site, connect the domain and basic SEO. Ready to show clients.' },
  ],
  pl: [
    { title: 'Poznanie', text: 'Krótka rozmowa lub wiadomości — opowiedz o zadaniu i co już masz.' },
    { title: 'Cel strony', text: 'Ustalamy, po co jest strona i jaką akcję ma wykonać odwiedzający.' },
    { title: 'Struktura i kierunek', text: 'Składam strukturę i kierunek wizualny, uzgadniamy przed designem.' },
    { title: 'Design i budowa', text: 'Projektuję i od razu składam działającą wersję na nowoczesnym stacku.' },
    { title: 'Poprawki', text: 'Przechodzimy rundy poprawek — korekty aż do właściwego efektu.' },
    { title: 'Start', text: 'Publikuję stronę, podpinam domenę i podstawowe SEO. Gotowe do pokazania klientom.' },
  ],
};

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export function getWorks(locale: Locale): Work[] {
  if (locale === 'ru') return baseWorks;
  return baseWorks.map((w) => {
    const o = worksText[locale][w.slug];
    return o ? { ...w, ...o } : w;
  });
}

export function getServices(locale: Locale): Service[] {
  if (locale === 'ru') return baseServices;
  return baseServices.map((s, i) => ({ ...s, ...servicesText[locale][i] }));
}

export function getPlans(locale: Locale): Plan[] {
  if (locale === 'ru') return basePlans;
  return basePlans.map((p, i) => ({ ...p, ...plansText[locale][i] }));
}

export function getAdvantages(locale: Locale): Advantage[] {
  if (locale === 'ru') return baseAdvantages;
  return baseAdvantages.map((a, i) => ({ ...a, ...advantagesText[locale][i] }));
}

export function getSteps(locale: Locale): Step[] {
  if (locale === 'ru') return baseSteps;
  return baseSteps.map((s, i) => ({ ...s, ...stepsText[locale][i] }));
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: UIDict };
const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('bnsh-locale')) as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem('bnsh-locale', l);
    } catch {}
    if (typeof document !== 'undefined') document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ locale, setLocale, t: ui[locale] }}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export function useT(): UIDict {
  return useLang().t;
}
