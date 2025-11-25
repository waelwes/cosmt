import { notFound } from 'next/navigation';
import { PageLayout } from '../../components/layout/PageLayout';
import { HeroSlider } from '../../components/sections/HeroSlider';
import { TrendingProducts } from '../../components/sections/TrendingProducts';
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
          {
            id: 3,
            image: '/images/hero/fino-cover.jpg',
            title: 'New Arrivals',
            subtitle: 'Latest Products',
            description: 'Fresh beauty essentials',
            link: '/categories',
            buttonText: 'Shop Now',
            size: 'medium'
          }
        ]}
      />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Promotional Banner 2 - Best Sellers */}
      <SinglePromotionalBanner
        image="/images/PROM/GIRL.png"
        title="Best Sellers"
        subtitle="Top Rated"
        description="Customer favorites"
        link="/categories"
        buttonText="Shop Now"
        size="medium"
      />

      {/* Mixed Promotional Banners - 3 Banners */}
      <MixedPromotionalBanners
        banners={[
          {
            id: 1,
            image: '/images/hero/fino-cover.jpg',
            title: 'Makeup',
            subtitle: 'Trending Now',
            description: 'Latest makeup trends',
            link: '/categories',
            buttonText: 'Explore',
            size: 'small'
          },
          {
            id: 2,
            image: '/images/hero/fino-cover.jpg',
            title: 'Premium Products',
            subtitle: 'Luxury Collection',
            description: 'High-end beauty essentials',
            link: '/categories',
            buttonText: 'Discover',
            size: 'medium'
          },
          {
            id: 3,
            image: '/images/PROM/GIRL.png',
            title: 'Skincare',
            subtitle: 'Daily Routine',
            description: 'Essential care products',
            link: '/categories',
            buttonText: 'Shop Now',
            size: 'small'
          }
        ]}
      />

      {/* Product Showcases */}
      <ProductShowcases />

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
// In development, use shorter revalidation for faster updates
// In production, use longer revalidation for better performance
export const revalidate = process.env.NODE_ENV === 'development' ? 60 : 3600; // 1 minute in dev, 1 hour in prod
export const dynamic = process.env.NODE_ENV === 'development' ? 'auto' : 'force-static'; // Auto in dev, static in prod
