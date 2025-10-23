import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES } from '../../utils/detectLocale';
import { PageLayout } from '../../components/layout/PageLayout';
import { HeroSlider } from '../../components/sections/HeroSlider';
import { TrendingProducts } from '../../components/sections/TrendingProducts';

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

  const localeConfig = SUPPORTED_LOCALES[locale];

  return (
    <PageLayout>
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Localization Debug Info - Remove in production */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 m-4 rounded-lg">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>🌍 <strong>Current Locale:</strong> {locale} ({localeConfig.name}) • 💰 <strong>Currency:</strong> {localeConfig.currency} • 🏳️ <strong>Country:</strong> {localeConfig.country}</p>
          <p className="mt-1">Click the globe icon in the banner to change language</p>
        </div>
      </div>
    </PageLayout>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES_ARRAY.map((locale) => ({
    locale,
  }));
}

// Enable ISR for better performance
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static'; // Force static generation