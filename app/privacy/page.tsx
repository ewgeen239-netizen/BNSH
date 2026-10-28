import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PrivacyContent } from '@/components/PrivacyContent';

export const metadata: Metadata = {
  title: 'Приватность, cookie и RODO',
  description:
    'Какие данные собирает сайт BNSH Studio, зачем они нужны, сколько хранятся и как их удалить. Политика cookie и права по GDPR/RODO.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <PrivacyContent />
      <Footer />
    </>
  );
}
