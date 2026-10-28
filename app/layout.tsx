import type { Metadata, Viewport } from 'next';
import { Inter, Unbounded, JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/lib/site';
import { LanguageProvider } from '@/lib/i18n';
import { ConsentProvider } from '@/lib/consent';
import { ScrollTop } from '@/components/ScrollTop';
import { BootSequence } from '@/components/BootSequence';
import { HudFrame } from '@/components/HudFrame';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsGate } from '@/components/AnalyticsGate';
import './globals.css';

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

// Geometric display face with Cyrillic — the 3089 wordmark voice.
const display = Unbounded({
  weight: ['400', '700', '800'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
});

// Every label, readout and HUD caption on the site is set in this.
const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#04060A',
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
    <html lang="ru" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        {/* Disable native scroll restoration before first paint so a refresh
            always starts at the top instead of the previous position. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}",
          }}
        />
        <ScrollTop />
        <ConsentProvider>
          <LanguageProvider>
            <BootSequence />
            <HudFrame />
            {children}
            <CookieConsent />
          </LanguageProvider>
          <AnalyticsGate />
        </ConsentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
