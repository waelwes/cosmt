'use client';

import { PageLayout } from '../components/layout/PageLayout';
import { HeroSlider } from '../components/sections/HeroSlider';
import { CategoryShowcase } from '../components/sections/CategoryShowcase';
import { BrandSections } from '../components/sections/BrandSections';
import { ProductShowcases } from '../components/sections/ProductShowcases';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { useRTL } from '../contexts/UnifiedLanguageContext';

export default function Home() {
  const { isRTL } = useRTL();

  return (
    <PageLayout>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <HeroSlider />
        <CategoryShowcase />
        <BrandSections />
        <ProductShowcases />
        <ScrollToTop />
      </div>
    </PageLayout>
  );
}
