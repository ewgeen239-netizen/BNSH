import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SelectedWorks } from '@/components/SelectedWorks';
import { WhatIDo } from '@/components/WhatIDo';
import { About } from '@/components/About';
import { Pricing } from '@/components/Pricing';
import { Advantages } from '@/components/Advantages';
import { Process } from '@/components/Process';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <SelectedWorks />
        <WhatIDo />
        <About />
        <Pricing />
        <Advantages />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
