'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  works as baseWorks,
  dossiers as baseDossiers,
  services as baseServices,
  plans as basePlans,
  advantages as baseAdvantages,
  steps as baseSteps,
  type Work,
  type Service,
  type Plan,
  type Advantage,
  type Step,
  type Dossier,
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
  about: {
    title: string;
    paragraphs: [string, string, string];
    facts: { k: string; v: string }[];
    cta: string;
  };
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
  hud: { sys: string; archive: string; uplink: string; node: string; year: string; scrollCue: string };
  boot: { tag: string; lines: string[]; decrypt: string; ready: string; skip: string; enter: string };
  archive: {
    overline: string;
    hint: string;
    indexLabel: string;
    dossierOverline: string;
    dossierTitle: string;
    dossierIntro: string;
    builtIn: string;
    roleLabel: string;
    stackLabel: string;
    openLive: string;
    previewHint: string;
    noPreview: string;
    liveCount: string;
  };
  consent: {
    tag: string;
    title: string;
    text: string;
    acceptAll: string;
    essentialOnly: string;
    customize: string;
    save: string;
    necessaryLabel: string;
    necessaryText: string;
    analyticsLabel: string;
    analyticsText: string;
    always: string;
    policyLink: string;
    manage: string;
    decidedAt: string;
  };
  privacy: {
    tag: string;
    title: string;
    intro: string;
    updated: string;
    back: string;
    sections: { h: string; p: string[] }[];
    cookieTableTitle: string;
    cookieTable: { name: string; purpose: string; life: string; group: string }[];
    manageTitle: string;
    manageText: string;
    manageButton: string;
  };
  island: { status: string; build: string; signIn: string; cta: string; menu: string };
  hero3d: {
    badgeA: string;
    badgeB: string;
    headline: [string, string, string];
    cardsOverline: string;
    scroll: string;
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
    about: {
      title: 'Немного обо мне',
      paragraphs: [
        'Я работаю один и лично веду каждый проект. Это значит, что вы общаетесь напрямую с человеком, который делает сайт — без посредников, менеджеров и потери смысла между этапами.',
        'Фокус — на аккуратности, скорости и визуальном качестве. Мне важно, чтобы результат выглядел дорого, работал быстро и решал конкретную задачу бизнеса, а не просто «был красивым».',
        'Без образа большой студии — но с профессиональным подходом: понятные этапы, честные сроки и внимание к деталям на каждом шаге.',
      ],
      facts: [
        { k: 'Один специалист', v: 'веду проект лично' },
        { k: 'От идеи', v: 'до готового результата' },
        { k: 'Понятная', v: 'коммуникация без воды' },
      ],
      cta: 'Посмотреть форматы и цены',
    },
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
    hud: { sys: 'BNSH // SYS', archive: 'АРХИВ', uplink: 'КАНАЛ', node: 'УЗЕЛ PL-SZZ', year: '3089', scrollCue: 'Листайте вниз' },
    boot: {
      tag: 'ИНИЦИАЛИЗАЦИЯ',
      lines: [
        'связь с узлом PL-SZZ установлена',
        'расшифровка архива портфолио',
        'загрузка визуального слоя 3089',
        'проверка целостности проектов',
        'интерфейс готов',
      ],
      decrypt: 'РАСШИФРОВКА',
      ready: 'СИСТЕМА ГОТОВА',
      skip: 'Пропустить',
      enter: 'Войти в архив',
    },
    archive: {
      overline: 'Архив работ',
      hint: 'Наведите или выберите проект — слева индекс, справа живой экран',
      indexLabel: 'Индекс',
      dossierOverline: 'Разбор проектов',
      dossierTitle: 'Что именно сделано внутри',
      dossierIntro:
        'Ниже — по каждому проекту: задача, что собрано внутри и моя роль. Наведите на название проекта в тексте — увидите его экран.',
      builtIn: 'Собрано внутри',
      roleLabel: 'Моя роль',
      stackLabel: 'Стек',
      openLive: 'Открыть проект',
      previewHint: 'наведите для превью',
      noPreview: 'Экрана нет — проект живёт в Telegram',
      liveCount: 'проектов в работе',
    },
    consent: {
      tag: 'ЗАПРОС ДОСТУПА',
      title: 'Файлы cookie',
      text:
        'Сайт использует только необходимые cookie, чтобы работать. Аналитику подключаю лишь с вашего согласия — чтобы видеть, какие работы смотрят.',
      acceptAll: 'Принять всё',
      essentialOnly: 'Только необходимые',
      customize: 'Настроить',
      save: 'Сохранить выбор',
      necessaryLabel: 'Необходимые',
      necessaryText: 'Выбор языка, запись о согласии, состояние интерфейса. Без них сайт не работает.',
      analyticsLabel: 'Аналитика',
      analyticsText: 'Обезличенная статистика посещений (Vercel Analytics). Загружается только после согласия.',
      always: 'всегда включены',
      policyLink: 'Политика приватности и RODO',
      manage: 'Настройки cookie',
      decidedAt: 'Решение сохранено',
    },
    privacy: {
      tag: 'ПРАВОВОЙ СЛОЙ',
      title: 'Приватность, cookie и RODO',
      intro:
        'Коротко и без юридического тумана: какие данные я получаю, зачем они нужны, сколько хранятся и как их удалить.',
      updated: 'Обновлено',
      back: 'На главную',
      sections: [
        {
          h: 'Кто обрабатывает данные',
          p: [
            'Администратор данных — BNSH Studio (частная практика, Польша). Связь: ewgeen239@gmail.com или Telegram @ewgeess.',
            'Я работаю один: ваши данные не передаются отделу продаж, подрядчикам или рекламным сетям, потому что их нет.',
          ],
        },
        {
          h: 'Какие данные и зачем',
          p: [
            'Форма заявки: имя, контакт (email, телефон или Telegram), тип проекта и описание задачи. Нужны только для того, чтобы ответить и предложить формат работы.',
            'Технические данные: обезличенная статистика визитов, если вы дали согласие на аналитику. Без IP-профилирования и без рекламных трекеров.',
            'Правовая основа (ст. 6 RODO/GDPR): ответ на заявку — ч. 1 п. b (подготовка договора), аналитика — ч. 1 п. a (согласие), базовая безопасность сайта — ч. 1 п. f (законный интерес).',
          ],
        },
        {
          h: 'Сколько храню',
          p: [
            'Переписку по заявке — до 12 месяцев после последнего сообщения, затем удаляю.',
            'Запись о согласии на cookie — 12 месяцев, после чего спрашиваю заново.',
            'Статистику — в обезличенном виде, без привязки к человеку.',
          ],
        },
        {
          h: 'Кому передаю',
          p: [
            'Хостинг и доставка сайта — Vercel Inc. (включая Vercel Analytics при согласии).',
            'Доставка писем с заявкой — Resend.',
            'Оба сервиса работают на стандартных договорных условиях ЕС (SCC). Больше никому данные не передаются и не продаются.',
          ],
        },
        {
          h: 'Ваши права',
          p: [
            'Доступ к данным, исправление, удаление, ограничение обработки, перенос и возражение против обработки.',
            'Отзыв согласия в любой момент — кнопкой «Настройки cookie» ниже или письмом. Отзыв не влияет на обработку до момента отзыва.',
            'Жалоба в надзорный орган: Prezes Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.',
          ],
        },
        {
          h: 'Безопасность',
          p: [
            'Передача данных только по HTTPS. Доступ к заявкам — у меня одного, с двухфакторной аутентификацией на почте.',
            'Данные не используются для автоматического принятия решений и профилирования.',
          ],
        },
      ],
      cookieTableTitle: 'Что лежит в браузере',
      cookieTable: [
        { name: 'bnsh-locale', purpose: 'Запоминает выбранный язык', life: '12 месяцев', group: 'Необходимые' },
        { name: 'bnsh-consent', purpose: 'Хранит ваш выбор по cookie', life: '12 месяцев', group: 'Необходимые' },
        { name: 'bnsh-boot', purpose: 'Загрузочный экран один раз за сессию', life: 'сессия', group: 'Необходимые' },
        { name: 'Vercel Analytics', purpose: 'Обезличенная статистика визитов', life: 'сессия', group: 'Аналитика' },
      ],
      manageTitle: 'Изменить решение',
      manageText: 'Можно пересмотреть выбор по cookie в любой момент — баннер появится снова.',
      manageButton: 'Открыть настройки cookie',
    },
    island: { status: 'BNSH на связи', build: 'BNSH OS 3089 · локальная память', signIn: 'Войти', cta: 'Обсудить проект', menu: 'Меню' },
    hero3d: {
      badgeA: 'Личный приём',
      badgeB: 'BNSH OS 3089 · локальная память',
      headline: ['BNSH — студия, которая', 'видит продукт целиком.', 'И спрашивает, прежде чем делать.'],
      cardsOverline: 'Что я беру на себя',
      scroll: 'Листайте',
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
    about: {
      title: 'A bit about me',
      paragraphs: [
        'I work solo and personally lead every project. That means you talk directly to the person who builds the site — no middlemen, no managers, no meaning lost between stages.',
        'The focus is on precision, speed and visual quality. It matters to me that the result looks premium, runs fast and solves a real business task — not just “looks nice”.',
        'No big-studio image — but a professional approach: clear stages, honest deadlines and attention to detail at every step.',
      ],
      facts: [
        { k: 'One specialist', v: 'I lead the project personally' },
        { k: 'From idea', v: 'to a finished result' },
        { k: 'Clear', v: 'communication, no fluff' },
      ],
      cta: 'See formats & pricing',
    },
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
    hud: { sys: 'BNSH // SYS', archive: 'ARCHIVE', uplink: 'UPLINK', node: 'NODE PL-SZZ', year: '3089', scrollCue: 'Scroll down' },
    boot: {
      tag: 'INITIALISING',
      lines: [
        'uplink to node PL-SZZ established',
        'decrypting portfolio archive',
        'loading 3089 visual layer',
        'verifying project integrity',
        'interface ready',
      ],
      decrypt: 'DECRYPTING',
      ready: 'SYSTEM READY',
      skip: 'Skip',
      enter: 'Enter the archive',
    },
    archive: {
      overline: 'Work archive',
      hint: 'Hover or pick a project — index on the left, live screen on the right',
      indexLabel: 'Index',
      dossierOverline: 'Project breakdown',
      dossierTitle: 'What was actually built inside',
      dossierIntro:
        'Per project: the task, what was built in, and my part in it. Hover a project name in the text to see its screen.',
      builtIn: 'Built in',
      roleLabel: 'My role',
      stackLabel: 'Stack',
      openLive: 'Open project',
      previewHint: 'hover to preview',
      noPreview: 'No screen — this one lives inside Telegram',
      liveCount: 'projects live',
    },
    consent: {
      tag: 'ACCESS REQUEST',
      title: 'Cookies',
      text:
        'This site uses only the cookies it needs to work. Analytics load exclusively with your consent — so I can see which work gets looked at.',
      acceptAll: 'Accept all',
      essentialOnly: 'Essential only',
      customize: 'Customise',
      save: 'Save choice',
      necessaryLabel: 'Necessary',
      necessaryText: 'Language choice, the consent record, interface state. The site does not work without them.',
      analyticsLabel: 'Analytics',
      analyticsText: 'Anonymous visit statistics (Vercel Analytics). Loaded only after consent.',
      always: 'always on',
      policyLink: 'Privacy policy & GDPR',
      manage: 'Cookie settings',
      decidedAt: 'Choice stored',
    },
    privacy: {
      tag: 'LEGAL LAYER',
      title: 'Privacy, cookies & GDPR',
      intro:
        'Short and without legal fog: what data reaches me, why it is needed, how long it is kept and how to have it deleted.',
      updated: 'Updated',
      back: 'Back home',
      sections: [
        {
          h: 'Who processes the data',
          p: [
            'The data controller is BNSH Studio (sole practitioner, Poland). Contact: ewgeen239@gmail.com or Telegram @ewgeess.',
            'I work alone: your data is not handed to a sales team, subcontractors or ad networks, because there are none.',
          ],
        },
        {
          h: 'What data and why',
          p: [
            'Request form: name, contact (email, phone or Telegram), project type and a description of the task. Used only to reply and propose a format.',
            'Technical data: anonymous visit statistics, if you consented to analytics. No IP profiling, no advertising trackers.',
            'Legal basis (GDPR art. 6): replying to your request — 1(b) (pre-contractual steps), analytics — 1(a) (consent), basic site security — 1(f) (legitimate interest).',
          ],
        },
        {
          h: 'How long it is kept',
          p: [
            'Correspondence about a request — up to 12 months after the last message, then deleted.',
            'The cookie consent record — 12 months, after which you are asked again.',
            'Statistics — anonymous, never tied back to a person.',
          ],
        },
        {
          h: 'Who it is shared with',
          p: [
            'Hosting and delivery — Vercel Inc. (including Vercel Analytics when consented).',
            'Delivery of request emails — Resend.',
            'Both operate under standard EU contractual clauses (SCC). Nothing is shared with anyone else and nothing is sold.',
          ],
        },
        {
          h: 'Your rights',
          p: [
            'Access, rectification, erasure, restriction of processing, portability and objection.',
            'You can withdraw consent at any time — via “Cookie settings” below or by email. Withdrawal does not affect processing done before it.',
            'Complaint to the supervisory authority: President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw, Poland.',
          ],
        },
        {
          h: 'Security',
          p: [
            'Data travels over HTTPS only. Requests are accessible to me alone, with two-factor authentication on the mailbox.',
            'Your data is never used for automated decision-making or profiling.',
          ],
        },
      ],
      cookieTableTitle: 'What sits in your browser',
      cookieTable: [
        { name: 'bnsh-locale', purpose: 'Remembers the chosen language', life: '12 months', group: 'Necessary' },
        { name: 'bnsh-consent', purpose: 'Stores your cookie choice', life: '12 months', group: 'Necessary' },
        { name: 'bnsh-boot', purpose: 'Boot screen once per session', life: 'session', group: 'Necessary' },
        { name: 'Vercel Analytics', purpose: 'Anonymous visit statistics', life: 'session', group: 'Analytics' },
      ],
      manageTitle: 'Change your mind',
      manageText: 'You can revisit the cookie choice at any time — the banner comes back.',
      manageButton: 'Open cookie settings',
    },
    island: { status: 'BNSH is listening', build: 'BNSH OS 3089 · on-device memory', signIn: 'Sign in', cta: 'Discuss a project', menu: 'Menu' },
    hero3d: {
      badgeA: 'Private intake',
      badgeB: 'BNSH OS 3089 · on-device memory',
      headline: ['BNSH is the studio that', 'sees the whole product.', 'It asks before it builds.'],
      cardsOverline: 'What I take on',
      scroll: 'Scroll',
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
    about: {
      title: 'Kilka słów o mnie',
      paragraphs: [
        'Pracuję sam i osobiście prowadzę każdy projekt. To znaczy, że rozmawiasz wprost z osobą, która robi stronę — bez pośredników, menedżerów i gubienia sensu między etapami.',
        'Skupiam się na precyzji, szybkości i jakości wizualnej. Zależy mi, żeby efekt wyglądał premium, działał szybko i rozwiązywał konkretne zadanie biznesowe — a nie tylko „ładnie wyglądał”.',
        'Bez wizerunku dużego studia — ale z profesjonalnym podejściem: jasne etapy, uczciwe terminy i dbałość o detale na każdym kroku.',
      ],
      facts: [
        { k: 'Jeden specjalista', v: 'prowadzę projekt osobiście' },
        { k: 'Od pomysłu', v: 'do gotowego rezultatu' },
        { k: 'Jasna', v: 'komunikacja bez lania wody' },
      ],
      cta: 'Zobacz formaty i ceny',
    },
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
    hud: { sys: 'BNSH // SYS', archive: 'ARCHIWUM', uplink: 'ŁĄCZE', node: 'WĘZEŁ PL-SZZ', year: '3089', scrollCue: 'Przewiń w dół' },
    boot: {
      tag: 'INICJALIZACJA',
      lines: [
        'łącze z węzłem PL-SZZ ustanowione',
        'odszyfrowywanie archiwum portfolio',
        'ładowanie warstwy wizualnej 3089',
        'weryfikacja spójności projektów',
        'interfejs gotowy',
      ],
      decrypt: 'ODSZYFROWYWANIE',
      ready: 'SYSTEM GOTOWY',
      skip: 'Pomiń',
      enter: 'Wejdź do archiwum',
    },
    archive: {
      overline: 'Archiwum prac',
      hint: 'Najedź lub wybierz projekt — indeks po lewej, żywy ekran po prawej',
      indexLabel: 'Indeks',
      dossierOverline: 'Rozbiór projektów',
      dossierTitle: 'Co dokładnie zostało zbudowane',
      dossierIntro:
        'Dla każdego projektu: zadanie, co zostało w nim zbudowane i moja rola. Najedź na nazwę projektu w tekście, aby zobaczyć jego ekran.',
      builtIn: 'Zbudowane w środku',
      roleLabel: 'Moja rola',
      stackLabel: 'Stack',
      openLive: 'Otwórz projekt',
      previewHint: 'najedź, by podejrzeć',
      noPreview: 'Brak ekranu — ten projekt żyje w Telegramie',
      liveCount: 'projektów działa',
    },
    consent: {
      tag: 'ŻĄDANIE DOSTĘPU',
      title: 'Pliki cookie',
      text:
        'Strona używa tylko niezbędnych cookie, aby działać. Analitykę włączam wyłącznie za Twoją zgodą — żeby wiedzieć, które prace są oglądane.',
      acceptAll: 'Przyjmij wszystkie',
      essentialOnly: 'Tylko niezbędne',
      customize: 'Dostosuj',
      save: 'Zapisz wybór',
      necessaryLabel: 'Niezbędne',
      necessaryText: 'Wybór języka, zapis zgody, stan interfejsu. Bez nich strona nie działa.',
      analyticsLabel: 'Analityka',
      analyticsText: 'Anonimowe statystyki wizyt (Vercel Analytics). Ładowane tylko po zgodzie.',
      always: 'zawsze włączone',
      policyLink: 'Polityka prywatności i RODO',
      manage: 'Ustawienia cookie',
      decidedAt: 'Wybór zapisany',
    },
    privacy: {
      tag: 'WARSTWA PRAWNA',
      title: 'Prywatność, cookie i RODO',
      intro:
        'Krótko i bez prawniczej mgły: jakie dane do mnie trafiają, po co są potrzebne, jak długo je trzymam i jak je usunąć.',
      updated: 'Zaktualizowano',
      back: 'Na stronę główną',
      sections: [
        {
          h: 'Kto przetwarza dane',
          p: [
            'Administratorem danych jest BNSH Studio (działalność jednoosobowa, Polska). Kontakt: ewgeen239@gmail.com lub Telegram @ewgeess.',
            'Pracuję sam: Twoje dane nie trafiają do działu sprzedaży, podwykonawców ani sieci reklamowych, bo takich nie ma.',
          ],
        },
        {
          h: 'Jakie dane i po co',
          p: [
            'Formularz zgłoszenia: imię, kontakt (e-mail, telefon lub Telegram), typ projektu i opis zadania. Służą wyłącznie do odpowiedzi i propozycji formatu współpracy.',
            'Dane techniczne: anonimowe statystyki wizyt, jeśli wyrazisz zgodę na analitykę. Bez profilowania po IP i bez trackerów reklamowych.',
            'Podstawa prawna (art. 6 RODO): odpowiedź na zgłoszenie — ust. 1 lit. b (czynności przed umową), analityka — ust. 1 lit. a (zgoda), podstawowe bezpieczeństwo strony — ust. 1 lit. f (uzasadniony interes).',
          ],
        },
        {
          h: 'Jak długo przechowuję',
          p: [
            'Korespondencję w sprawie zgłoszenia — do 12 miesięcy od ostatniej wiadomości, potem usuwam.',
            'Zapis zgody na cookie — 12 miesięcy, następnie pytam ponownie.',
            'Statystyki — w formie anonimowej, bez powiązania z osobą.',
          ],
        },
        {
          h: 'Komu przekazuję',
          p: [
            'Hosting i dostarczanie strony — Vercel Inc. (w tym Vercel Analytics przy zgodzie).',
            'Dostarczanie e-maili ze zgłoszeniem — Resend.',
            'Oba działają na standardowych klauzulach umownych UE (SCC). Nikomu innemu danych nie przekazuję i nie sprzedaję.',
          ],
        },
        {
          h: 'Twoje prawa',
          p: [
            'Dostęp do danych, sprostowanie, usunięcie, ograniczenie przetwarzania, przenoszenie i sprzeciw.',
            'Zgodę możesz wycofać w każdej chwili — przyciskiem „Ustawienia cookie” poniżej lub mailem. Wycofanie nie wpływa na przetwarzanie sprzed wycofania.',
            'Skarga do organu nadzorczego: Prezes Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.',
          ],
        },
        {
          h: 'Bezpieczeństwo',
          p: [
            'Dane przesyłane są wyłącznie przez HTTPS. Dostęp do zgłoszeń mam tylko ja, z dwuetapowym uwierzytelnianiem na skrzynce.',
            'Dane nie są używane do automatycznego podejmowania decyzji ani profilowania.',
          ],
        },
      ],
      cookieTableTitle: 'Co leży w przeglądarce',
      cookieTable: [
        { name: 'bnsh-locale', purpose: 'Pamięta wybrany język', life: '12 miesięcy', group: 'Niezbędne' },
        { name: 'bnsh-consent', purpose: 'Przechowuje Twój wybór cookie', life: '12 miesięcy', group: 'Niezbędne' },
        { name: 'bnsh-boot', purpose: 'Ekran startowy raz na sesję', life: 'sesja', group: 'Niezbędne' },
        { name: 'Vercel Analytics', purpose: 'Anonimowe statystyki wizyt', life: 'sesja', group: 'Analityka' },
      ],
      manageTitle: 'Zmień decyzję',
      manageText: 'Wybór cookie możesz zmienić w każdej chwili — baner pojawi się ponownie.',
      manageButton: 'Otwórz ustawienia cookie',
    },
    island: { status: 'BNSH słucha', build: 'BNSH OS 3089 · pamięć lokalna', signIn: 'Zaloguj', cta: 'Omów projekt', menu: 'Menu' },
    hero3d: {
      badgeA: 'Prywatny nabór',
      badgeB: 'BNSH OS 3089 · pamięć lokalna',
      headline: ['BNSH to studio, które', 'widzi cały produkt.', 'Pyta, zanim zacznie.'],
      cardsOverline: 'Co biorę na siebie',
      scroll: 'Przewiń',
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
    murmur: { type: 'Restaurant site · Warsaw', description: 'An all-day restaurant on Chmielna: a cinematic hero, a living 150+ item menu with search, and table booking.' },
    'eleon-clinic': { type: 'Clinic + booking system', description: 'An aesthetic medicine clinic in Warsaw: a custom booking engine, a live doctors’ schedule and an admin panel.' },
    brozone: { type: 'Barbershop + booking', description: 'A Szczecin barbershop: four-step booking with barber and slot picking, a loyalty program and the BROZONE OS admin panel.' },
    'your-flowers': { type: 'Flower shop · delivery', description: 'A Szczecin florist: a bouquet catalog, picking by occasion, date and budget, a same-day delivery cut-off and a custom order builder.' },
    krasnovska: { type: 'Personal brand', description: 'A personal-brand site: studio, portfolio, services and a multilingual UI. Calm, premium presentation.' },
    technokomis: { title: 'TechnoKomis', type: 'Telegram bot · consignment', description: 'A bot that takes electronics on consignment: requests, pricing and notifications. Runs on a serverless webhook — no server of its own.' },
    sushi: { type: 'Sushi delivery · order online', description: 'Sushi delivery in Szczecin: menu and cart, promo codes, delivery pricing and a loyalty club. An order takes a couple of minutes.' },
    'vela-finance': { type: 'Web app', description: 'A personal finance dashboard: charts, categories, goals. Thoughtful UX and a light data interface.' },
    'nord-estate': { type: 'Real estate site', description: 'A property catalog with filters, cards and a viewing request. Rich typography and careful details.' },
    'atelier-kova': { type: 'Portfolio / personal brand', description: 'A product designer’s portfolio: gallery, brand story, contacts. Quiet luxury and lots of air.' },
    'pulse-analytics': { type: 'SaaS interface', description: 'A team analytics panel: real-time metrics, tables, loading and empty states.' },
    'form-studio': { type: 'Studio landing', description: 'A one-pager for a creative studio: strong hero, services, reviews, a clear call to action.' },
    'meridian-os': { type: 'Concept interface', description: 'An experimental workspace concept: bold composition, micro-interactions, motion details.' },
  },
  pl: {
    balance: { type: 'Strona baru · koktajle i shisha', description: 'Strona lounge baru w Szczecinie: klimatyczna oprawa, menu, rezerwacja online i cztery języki.' },
    murmur: { type: 'Strona restauracji · Warszawa', description: 'All-day restauracja na Chmielnej: filmowy hero, żywe menu na 150+ pozycji z wyszukiwarką i rezerwacja stolika.' },
    'eleon-clinic': { type: 'Klinika + system rezerwacji', description: 'Klinika medycyny estetycznej w Warszawie: własny silnik rezerwacji, grafik lekarzy na żywo i panel administratora.' },
    brozone: { type: 'Barber shop + rezerwacja', description: 'Barber shop w Szczecinie: rezerwacja w czterech krokach z wyborem barbera i terminu, program lojalnościowy i panel BROZONE OS.' },
    'your-flowers': { type: 'Kwiaciarnia · dostawa', description: 'Kwiaciarnia w Szczecinie: katalog bukietów, dobór pod okazję, datę i budżet, deadline dostawy tego samego dnia i kreator zamówienia.' },
    krasnovska: { type: 'Marka osobista', description: 'Strona marki osobistej: studio, portfolio, usługi i wielojęzyczność. Spokojna, premium prezentacja.' },
    technokomis: { title: 'TechnoKomis', type: 'Bot Telegram · komis', description: 'Bot przyjmujący elektronikę w komis: zgłoszenia, wycena i powiadomienia. Działa na webhooku serverless — bez własnego serwera.' },
    sushi: { type: 'Dostawa sushi · zamówienia online', description: 'Sushi z dostawą w Szczecinie: menu i koszyk, kody rabatowe, wyliczanie dostawy i klub lojalnościowy. Zamówienie zajmuje kilka minut.' },
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

// Dossiers: the detail layer under the works stage, by slug.
const dossiersText: Record<'en' | 'pl', Record<string, Dossier>> = {
  en: {
    balance: {
      summary:
        'A lounge bar in Szczecin: the site had to carry the mood of an evening there and take the booking load off the phone.',
      details: [
        'Cinematic hero with a mood video',
        'Cocktail and shisha menu by category',
        'Online table booking with a time picker',
        'Four languages for a mixed local crowd',
        'Map, opening hours and one-tap call',
      ],
      role: 'Design, build, i18n, deployment',
    },
    murmur: {
      summary:
        'An all-day restaurant on Chmielna in Warsaw: a showcase plus a living 150+ item menu the kitchen changes itself.',
      details: [
        '150+ item menu with search and filters',
        'Table booking and an event enquiry',
        'Separate cards: breakfast, lunch, bar',
        'Cinematic plating and interior shots',
        'Mobile speed tuned for street traffic',
      ],
      role: 'Structure, design, development',
    },
    'eleon-clinic': {
      summary:
        'An aesthetic medicine clinic in Warsaw: not a brochure but a working booking system with a doctors’ schedule.',
      details: [
        'Custom booking engine — no third-party service',
        'Live doctor and slot availability',
        'Admin panel: services, doctors, requests',
        'Procedure cards with prices and prep',
        'Confirmations and request notifications',
      ],
      role: 'UX scenarios, design, front end and booking logic',
    },
    brozone: {
      summary:
        'A Szczecin barbershop: the goal was a client booking themselves in four steps, with no back-and-forth chat.',
      details: [
        'Booking in 4 steps: service → barber → slot → confirm',
        'Loyalty program that counts visits',
        'BROZONE OS admin panel for shifts and slots',
        'Barber profiles with their free hours',
        'Multilingual for the city',
      ],
      role: 'Product, design, development, admin panel',
    },
    'your-flowers': {
      summary:
        'A florist in Szczecin: same-day delivery is the whole business, so the interface is built around the cut-off.',
      details: [
        'Bouquet picking by occasion, date and budget',
        'Same-day delivery cut-off with a countdown',
        'Order builder with a card and a time window',
        'Catalog with categories and availability',
        'Checkout without extra steps',
      ],
      role: 'UX, design, development, e-commerce logic',
    },
    krasnovska: {
      summary:
        'A personal-brand site: the task was to make an expert look premium and composed, with no noise.',
      details: [
        'Calm, premium typography',
        'Portfolio of work and a studio story',
        'Services block with clear formats',
        'Three languages with a remembered choice',
        'Photography first, lots of air between blocks',
      ],
      role: 'Design, build, i18n',
    },
    technokomis: {
      summary:
        'A Telegram bot that takes electronics on consignment: request, pricing and notifications — with no server of its own.',
      details: [
        'The whole request runs inside Telegram',
        'Commission and indicative price calculation',
        'Owner notified on every new request',
        'Serverless webhook — you pay per request',
        'Dialog state kept without losing context',
      ],
      role: 'Bot logic, integration, deployment',
    },
    sushi: {
      summary:
        'Sushi delivery in Szczecin: an order has to be placed in a couple of minutes on a phone, one-handed.',
      details: [
        'Menu and cart with instant add',
        'Promo codes and delivery pricing',
        'Loyalty club with bonuses per order',
        'Checkout with the fewest possible fields',
        'Layout tuned for one-handed ordering',
      ],
      role: 'Design, front end, cart and checkout',
    },
  },
  pl: {
    balance: {
      summary:
        'Lounge bar w Szczecinie: strona miała przenosić klimat wieczoru i zdjąć rezerwacje z telefonu.',
      details: [
        'Filmowy hero z klimatycznym wideo',
        'Menu koktajli i shishy w kategoriach',
        'Rezerwacja stolika online z wyborem godziny',
        'Cztery języki pod lokalną publikę',
        'Mapa, godziny otwarcia i szybki telefon',
      ],
      role: 'Design, kod, i18n, wdrożenie',
    },
    murmur: {
      summary:
        'All-day restauracja na Chmielnej w Warszawie: witryna plus żywe menu na 150+ pozycji, które kuchnia zmienia sama.',
      details: [
        'Menu na 150+ pozycji z wyszukiwarką i filtrami',
        'Rezerwacja stolika i zapytanie o event',
        'Osobne karty: śniadania, lunch, bar',
        'Filmowe zdjęcia dań i wnętrza',
        'Szybkość na mobile pod ruch z ulicy',
      ],
      role: 'Struktura, design, development',
    },
    'eleon-clinic': {
      summary:
        'Klinika medycyny estetycznej w Warszawie: nie wizytówka, a działający system rezerwacji z grafikiem lekarzy.',
      details: [
        'Własny silnik rezerwacji — bez zewnętrznych usług',
        'Dostępność lekarzy i terminów na żywo',
        'Panel admina: usługi, lekarze, zgłoszenia',
        'Karty procedur z cenami i przygotowaniem',
        'Potwierdzenia i powiadomienia o zgłoszeniu',
      ],
      role: 'Scenariusze UX, design, front i logika rezerwacji',
    },
    brozone: {
      summary:
        'Barber shop w Szczecinie: cel — klient rezerwuje sam, w czterech krokach, bez wymiany wiadomości.',
      details: [
        'Rezerwacja w 4 krokach: usługa → barber → termin → potwierdzenie',
        'Program lojalnościowy liczący wizyty',
        'Panel BROZONE OS do zmian i terminów',
        'Profile barberów i ich wolne godziny',
        'Wielojęzyczność pod miasto',
      ],
      role: 'Produkt, design, development, panel admina',
    },
    'your-flowers': {
      summary:
        'Kwiaciarnia w Szczecinie: dostawa tego samego dnia to cały biznes, więc interfejs stoi na deadlinie.',
      details: [
        'Dobór bukietu pod okazję, datę i budżet',
        'Deadline dostawy „dziś” z odliczaniem',
        'Kreator zamówienia z kartką i oknem czasowym',
        'Katalog z kategoriami i dostępnością',
        'Zamówienie bez zbędnych kroków',
      ],
      role: 'UX, design, development, logika e-commerce',
    },
    krasnovska: {
      summary:
        'Strona marki osobistej: zadaniem było, by ekspert wyglądał premium i zbiorczo, bez szumu.',
      details: [
        'Spokojna, premium typografia',
        'Portfolio prac i historia studia',
        'Blok usług z jasnymi formatami',
        'Trzy języki z zapamiętanym wyborem',
        'Zdjęcia na pierwszym planie, dużo powietrza',
      ],
      role: 'Design, kod, i18n',
    },
    technokomis: {
      summary:
        'Bot Telegram przyjmujący elektronikę w komis: zgłoszenie, wycena i powiadomienia — bez własnego serwera.',
      details: [
        'Całe zgłoszenie dzieje się w Telegramie',
        'Wyliczenie komisji i ceny wstępnej',
        'Powiadomienie właściciela o każdym zgłoszeniu',
        'Webhook serverless — płacisz za zapytania',
        'Stan dialogu utrzymany bez utraty kontekstu',
      ],
      role: 'Logika bota, integracja, wdrożenie',
    },
    sushi: {
      summary:
        'Dostawa sushi w Szczecinie: zamówienie musi powstać w kilka minut na telefonie, jedną ręką.',
      details: [
        'Menu i koszyk z natychmiastowym dodawaniem',
        'Kody rabatowe i wyliczanie dostawy',
        'Klub lojalnościowy z bonusami za zamówienia',
        'Checkout z minimalną liczbą pól',
        'Układ pod zamawianie jedną ręką',
      ],
      role: 'Design, front, koszyk i checkout',
    },
  },
};

export function getDossier(locale: Locale, slug: string): Dossier | undefined {
  if (locale === 'ru') return baseDossiers[slug];
  return dossiersText[locale][slug] ?? baseDossiers[slug];
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
