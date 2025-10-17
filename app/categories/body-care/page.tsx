import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Body Care Products - Luxurious Body Care & Wellness | COSMT',
  description: 'Luxurious body care products including body wash, lotions, scrubs, and oils. Pamper your skin with premium body care essentials.',
  keywords: 'body care, body wash, body lotion, body scrub, body oil, hand care, foot care, deodorant, intimate care',
  openGraph: {
    title: 'Body Care Products - Luxurious Body Care & Wellness | COSMT',
    description: 'Luxurious body care products including body wash, lotions, scrubs, and oils.',
    images: ['/images/body-care-og.jpg'],
  },
};

export default function BodyCarePage() {
  const category = getCategoryBySlug('body-care');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
