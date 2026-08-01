/**
 * All editorial content lives here so it's easy to update without touching UI.
 * Icons are stored as string keys and resolved in components via the icon map.
 */

export type IconName =
  | 'globe'
  | 'rocket'
  | 'user'
  | 'appWindow'
  | 'penTool'
  | 'refresh'
  | 'search'
  | 'sparkles'
  | 'gauge'
  | 'messageSquare'
  | 'layers'
  | 'smartphone'
  | 'shieldCheck'
  | 'clock';

/* ------------------------------------------------------------------ */
/* Selected works                                                      */
/* ------------------------------------------------------------------ */

export type WorkCategory = 'websites' | 'apps' | 'landing' | 'concepts';

export const workFilters: { id: 'all' | WorkCategory; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'websites', label: 'Websites' },
  { id: 'apps', label: 'Apps' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'concepts', label: 'Concepts' },
];

export type Work = {
  slug: string;
  title: string;
  type: string;
  category: WorkCategory;
  year: string;
  description: string;
  stack: string[];
  // Gradient pair used for the placeholder showcase. Replace card media with
  // real screenshots by dropping images in /public and swapping the visual.
  accent: [string, string];
  href?: string;
  live?: boolean; // real, published project (vs template placeholder)
  image?: string; // real screenshot in /public (overrides the gradient visual)
};

export const works: Work[] = [
  {
    slug: 'balance',
    title: 'Balance',
    type: 'Сайт бара · коктейли и кальян',
    category: 'websites',
    year: '2025',
    description:
      'Сайт лаунж-бара в Щецине: атмосферный визуал, меню, онлайн-бронирование и четыре языка.',
    stack: ['Next.js', 'Tailwind', 'i18n'],
    accent: ['#2a1412', '#E8654B'],
    href: 'https://www.balancecocktails.pl',
    live: true,
    image: '/works/balance.jpg',
  },
  {
    slug: 'krasnovska',
    title: 'Krasnovska',
    type: 'Персональный бренд',
    category: 'websites',
    year: '2025',
    description:
      'Сайт личного бренда: студия, портфолио, услуги и мультиязычность. Спокойная премиальная подача.',
    stack: ['Next.js', 'i18n', 'Tailwind'],
    accent: ['#241420', '#E08CB0'],
    href: 'https://krasnovska.vercel.app/ru',
    live: true,
    image: '/works/krasnovska.jpg',
  },
  {
    slug: 'brozone',
    title: 'Brozone barber',
    type: 'Персональный бренд',
    category: 'websites',
    year: '2026',
    description:
      'Сайт барбершопа. Утонченно, гармонично, и дорого.',
    stack: ['Next.js', 'i18n', 'Tailwind'],
    accent: ['#241420', '#E08CB0'],
    href: 'https://brozonetest1.vercel.app/',
    live: true,
    image: '/works/Brozone.jpg',
  },
  {
    slug: 'sushi',
    title: 'Sushi Smok',
    type: 'Сайт бара · коктейли и кальян',
    category: 'websites',
    year: '2026',
    description:
      'Сайт со вкусом, каждый свай каждая анимация завораживает. Клиент получает удовольствие не только от вкуса.',
    stack: ['Next.js', 'Tailwind', 'i18n'],
    accent: ['#2a1412', '#E8654B'],
    href: 'https://sushismok.vercel.app/',
    live: true,
    image: '/works/sushi.jpg',
  },
  {
    slug: 'vela-finance',
    title: 'Vela Finance',
    type: 'Веб-приложение',
    category: 'apps',
    year: '2025',
    description:
      'Дашборд личных финансов: графики, категории, цели. Продуманная UX-структура и лёгкий интерфейс под данные.',
    stack: ['React', 'TypeScript', 'Charts'],
    accent: ['#0f2f2a', '#3ED0A6'],
  },
  {
    slug: 'nord-estate',
    title: 'Nord Estate',
    type: 'Сайт недвижимости',
    category: 'websites',
    year: '2024',
    description:
      'Каталог объектов с фильтрами, карточками и заявкой на просмотр. Дорогая типографика и аккуратные детали.',
    stack: ['Next.js', 'Tailwind'],
    accent: ['#22232a', '#B9BAC0'],
  },
  {
    slug: 'atelier-kova',
    title: 'Atelier Kova',
    type: 'Портфолио / личный бренд',
    category: 'websites',
    year: '2024',
    description:
      'Портфолио дизайнера-предметника: галерея работ, история бренда, контакты. Тихая роскошь и много воздуха.',
    stack: ['Next.js', 'GSAP'],
    accent: ['#2a1420', '#E08CB0'],
  },
  {
    slug: 'pulse-analytics',
    title: 'Pulse Analytics',
    type: 'SaaS-интерфейс',
    category: 'apps',
    year: '2025',
    description:
      'Аналитическая панель для команды: метрики в реальном времени, таблицы, состояния загрузки и пустых данных.',
    stack: ['React', 'TypeScript', 'Design System'],
    accent: ['#141c3a', '#7C8CFF'],
  },
  {
    slug: 'form-studio',
    title: 'Form Studio',
    type: 'Лендинг студии',
    category: 'landing',
    year: '2024',
    description:
      'Одностраничник для творческой студии: сильный hero, услуги, отзывы, чёткий призыв к действию.',
    stack: ['Next.js', 'Framer Motion'],
    accent: ['#2a2410', '#D8BC86'],
  },
  {
    slug: 'meridian-os',
    title: 'Meridian OS',
    type: 'Концепт-интерфейс',
    category: 'concepts',
    year: '2025',
    description:
      'Экспериментальный концепт рабочего пространства: смелая композиция, микровзаимодействия, motion-детали.',
    stack: ['Concept', 'Motion', 'UI/UX'],
    accent: ['#101010', '#8A8B92'],
  },
];

/* ------------------------------------------------------------------ */
/* What I do                                                           */
/* ------------------------------------------------------------------ */

export type Service = {
  icon: IconName;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: 'globe',
    title: 'Сайты под бизнес',
    description:
      'Многостраничные сайты для компаний и локального бизнеса — с понятной структурой и аккуратным дизайном.',
  },
  {
    icon: 'rocket',
    title: 'Лендинги под заявки',
    description:
      'Одностраничники, которые ведут посетителя к цели: заявке, звонку или покупке.',
  },
  {
    icon: 'user',
    title: 'Портфолио и личные бренды',
    description:
      'Персональные сайты для экспертов и авторов — чтобы бренд выглядел дорого и убедительно.',
  },
  {
    icon: 'appWindow',
    title: 'Веб-приложения',
    description:
      'Интерфейсы с логикой: дашборды, кабинеты, инструменты. Продуманный UX под реальные сценарии.',
  },
  {
    icon: 'penTool',
    title: 'UI/UX прототипы',
    description:
      'Структура и визуальное направление до разработки — чтобы согласовать идею быстро и без лишних правок.',
  },
  {
    icon: 'refresh',
    title: 'Редизайн старых сайтов',
    description:
      'Обновляю устаревшие сайты: современный вид, скорость, адаптив и удобство без потери сути.',
  },
  {
    icon: 'search',
    title: 'Запуск и базовое SEO',
    description:
      'Готовлю сайт к публикации: домен, метаданные, sitemap, скорость и базовая поисковая оптимизация.',
  },
];

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export type Plan = {
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  featured?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: 'Landing Start',
    audience: 'Для простого лендинга или страницы услуги',
    price: 'от 1200 zł',
    priceNote: 'ориентир',
    features: [
      'Проработанная структура и оффер',
      'Индивидуальный дизайн',
      'Адаптив под телефон и desktop',
      'Форма заявки',
      'Базовое SEO',
    ],
  },
  {
    name: 'Business Site',
    audience: 'Для компании, эксперта или локального бизнеса',
    price: 'от 2800 zł',
    priceNote: 'ориентир',
    featured: true,
    features: [
      'Несколько секций или страниц',
      'Портфолио / услуги / о компании',
      'Контакты и карта',
      'Адаптив и аккуратная анимация',
      'SEO-подготовка к запуску',
    ],
  },
  {
    name: 'Premium Digital Product',
    audience: 'Для веб-приложения, личного бренда или нестандартного проекта',
    price: 'индивидуально',
    priceNote: 'по задаче',
    features: [
      'UX-структура и сценарии',
      'Дизайн-система',
      'Сложные интерфейсы и состояния',
      'Продуманные анимации',
      'Интеграции под задачу',
    ],
  },
];

export const pricingNote =
  'Финальная цена зависит от задачи, объёма, контента и сроков. После короткого обсуждения предложу точную смету и формат.';

/* ------------------------------------------------------------------ */
/* Advantages                                                          */
/* ------------------------------------------------------------------ */

export type Advantage = { icon: IconName; title: string; text: string };

export const advantages: Advantage[] = [
  {
    icon: 'user',
    title: 'Личное участие',
    text: 'Веду проект сам — от идеи до запуска. Общаетесь напрямую с тем, кто делает.',
  },
  {
    icon: 'sparkles',
    title: 'Современный уровень',
    text: 'Актуальный визуал и детали, которые считываются как «дорого».',
  },
  {
    icon: 'layers',
    title: 'Понятная структура работы',
    text: 'Ясные этапы и сроки. Вы всегда знаете, что происходит с проектом.',
  },
  {
    icon: 'smartphone',
    title: 'Адаптив под все экраны',
    text: 'Одинаково аккуратно на телефоне, планшете и desktop.',
  },
  {
    icon: 'penTool',
    title: 'Анимация без перегруза',
    text: 'Плавные, спокойные переходы, которые помогают, а не отвлекают.',
  },
  {
    icon: 'rocket',
    title: 'Быстрый запуск',
    text: 'Первая рабочая версия — быстро, без бесконечных согласований.',
  },
  {
    icon: 'messageSquare',
    title: 'Помощь с текстами',
    text: 'Помогу с формулировками и позиционированием, чтобы сайт продавал пользу.',
  },
  {
    icon: 'search',
    title: 'Базовое SEO',
    text: 'Готовлю сайт к индексации: метаданные, скорость, семантика.',
  },
];

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export type Step = { n: string; title: string; text: string };

export const steps: Step[] = [
  {
    n: '01',
    title: 'Знакомство',
    text: 'Короткий созвон или переписка — расскажите о задаче и что уже есть.',
  },
  {
    n: '02',
    title: 'Цель сайта',
    text: 'Определяем, для чего сайт и какое действие должен совершить посетитель.',
  },
  {
    n: '03',
    title: 'Структура и направление',
    text: 'Собираю структуру и визуальное направление, согласуем до дизайна.',
  },
  {
    n: '04',
    title: 'Дизайн и разработка',
    text: 'Делаю дизайн и сразу собираю рабочую версию на современном стеке.',
  },
  {
    n: '05',
    title: 'Правки',
    text: 'Проходим правки по кругам — вносим корректировки до нужного результата.',
  },
  {
    n: '06',
    title: 'Запуск',
    text: 'Публикую сайт, подключаю домен и базовое SEO. Готово к показу клиентам.',
  },
];

/* ------------------------------------------------------------------ */
/* Contact form — project type options                                */
/* ------------------------------------------------------------------ */

export const projectTypes = [
  'Лендинг',
  'Сайт для бизнеса',
  'Портфолио / личный бренд',
  'Веб-приложение',
  'Редизайн',
  'Другое',
] as const;
