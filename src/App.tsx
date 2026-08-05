import { useSectionArrowNav } from '@/hooks/useSectionArrowNav';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useI18n } from '@/providers/I18nProvider';
import { AuroraBackground } from '@/components/effects/AuroraBackground';
import { CursorGlow } from '@/components/effects/CursorGlow';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { About } from '@/sections/About';
import { Certificates } from '@/sections/Certificates';
import { Contact } from '@/sections/Contact';
import { Hero } from '@/sections/Hero';
import { Journey } from '@/sections/Journey';
import { Process } from '@/sections/Process';
import { Projects } from '@/sections/Projects';
import { Services } from '@/sections/Services';
import { Skills } from '@/sections/Skills';

export default function App() {
  const { isRTL } = useI18n();
  useSmoothScroll();
  useSectionArrowNav(isRTL);

  return (
    <>
      {/* Ambient layers — all fixed, none interactive. */}
      <AuroraBackground />
      <CursorGlow />
      <ScrollProgress />

      <Header />

      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Journey />
        <Projects />
        <Certificates />
        <Process />
        <Contact />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
