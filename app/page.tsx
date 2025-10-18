'use client';

import { Header } from '../components/layout/Header';
import { HeroSlider } from '../components/sections/HeroSlider';
import { CategoryShowcase } from '../components/sections/CategoryShowcase';
import { BrandSections } from '../components/sections/BrandSections';
import { ProductShowcases } from '../components/sections/ProductShowcases';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { useRTL } from '../contexts/UnifiedLanguageContext';

export default function Home() {
  const { isRTL } = useRTL();

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main>
        <HeroSlider />
        <CategoryShowcase />
        <BrandSections />
        <ProductShowcases />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
