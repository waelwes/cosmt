import { Header } from '../components/layout/Header';
import { HeroSlider } from '../components/sections/HeroSlider';
import { CategoryShowcase } from '../components/sections/CategoryShowcase';
import { BrandSections } from '../components/sections/BrandSections';
import { ProductShowcases } from '../components/sections/ProductShowcases';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
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
