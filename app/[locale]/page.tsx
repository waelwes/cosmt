import { notFound } from 'next/navigation';
import { PageLayout } from '../../components/layout/PageLayout';
import { HeroSlider } from '../../components/sections/HeroSlider';
import { TrendingProducts } from '../../components/sections/TrendingProducts';
import { BestSellers } from '../../components/sections/BestSellers';
import { NewArrivals } from '../../components/sections/NewArrivals';
import { BrandSections } from '../../components/sections/BrandSections';
import { ProductShowcases } from '../../components/sections/ProductShowcases';
import { PromotionalBanners } from '../../components/sections/PromotionalBanners';
import { SinglePromotionalBanner } from '../../components/sections/SinglePromotionalBanner';
import { MixedPromotionalBanners } from '../../components/sections/MixedPromotionalBanners';

const SUPPORTED_LOCALES_ARRAY = ['en', 'ar', 'tr', 'de', 'fr', 'es'];

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!SUPPORTED_LOCALES_ARRAY.includes(locale)) {
    notFound();
  }

  return (
    <PageLayout>
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Promotional Banners (Categories) */}
      <PromotionalBanners />

      {/* Mixed Promotional Banners - 3 Banners */}
      <MixedPromotionalBanners
        banners={[
          {
            id: 1,
            image: '/images/hero/fino-cover.jpg',
            title: 'Special Offer',
            subtitle: 'Limited Time',
            description: 'Up to 50% off',
            link: '/categories',
            buttonText: 'Get Deal',
            size: 'medium'
          },
          {
            id: 2,
            image: '/images/PROM/GIRL.png',
            title: 'Beauty Tips',
            subtitle: 'Expert Advice',
            description: 'Learn from professionals',
            link: '/categories',
            buttonText: 'Read More',
            size: 'small'
          },

        ]}
      />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Promotional banner below Trending Products */}
      <SinglePromotionalBanner
        image="/images/PROM/TRENDING_BANNER.jpg"
        title="Trending Now — Limited Offer"
        subtitle="Best Picks"
        description="Hot deals on trending products"
        link="/categories"
        buttonText="Shop Trending"
        size="large"
      />

      {/* Best Sellers */}
      <BestSellers />
      {/* New Arrivals (placed directly after Best Sellers to match spacing) */}
      <NewArrivals />
      {/* New Arrivals (moved below to appear above Summer Sale) */}



      

      {/* Product Showcases */}
      <ProductShowcases />

      {/* New Arrivals (moved earlier) - removed duplicate here */}

      {/* Single Promotional Banner - Summer Sale */}
      <SinglePromotionalBanner
        image="/images/PROM/GIRL.png"
        title="Summer Sale"
        subtitle="Hot Deals"
        description="Save up to 60%"
        link="/categories"
        buttonText="Shop Sale"
        size="large"
      />

      {/* Brand Sections */}
      <BrandSections />
    </PageLayout>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES_ARRAY.map((locale) => ({
    locale,
  }));
}

// Enable ISR for better performance
export const revalidate = 3600; // 1 hour
