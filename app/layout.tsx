import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { siteConfig } from '@/lib/site';
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s · BNSH Studio',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: 'BNSH Studio' }],
  creator: 'BNSH Studio',
  keywords: [
    'BNSH',
    'BNSH Studio',
    'создание сайтов',
    'веб-разработка',
    'лендинг',
    'веб-приложение',
    'портфолио',
    'web design',
    'Next.js',
    'Польша',
    'Europe',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BNSH Studio — премиальные сайты и веб-приложения',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Favicon is served automatically from app/icon.svg (Next file convention).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contacts.email,
    areaServed: ['PL', 'EU'],
    knowsAbout: ['Web Development', 'Web Design', 'UI/UX', 'Landing Pages', 'Web Applications'],
    slogan: siteConfig.tagline,
  };

  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
