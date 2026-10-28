import { IslandHeader } from '@/components/hero/IslandHeader';
import { Hero3D } from '@/components/hero/Hero3D';
import { SelectedWorks } from '@/components/SelectedWorks';
import { WorkDossier } from '@/components/WorkDossier';
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
      <IslandHeader />
      <main id="main">
        <Hero3D />
        {/* Everything below scrolls over the fixed 3D scene, so it carries its
            own opaque background and sits above it. */}
        <div className="relative z-30 bg-ink-950">
          <SelectedWorks />
          <WorkDossier />
          <WhatIDo />
          <About />
          <Pricing />
          <Advantages />
          <Process />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
