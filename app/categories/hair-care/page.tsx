import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Hair Care Products - Professional Hair Styling & Treatment | COSMT',
  description: 'Professional hair care products including shampoos, conditioners, treatments, and styling products. Achieve healthy, beautiful hair with expert-curated products.',
  keywords: 'hair care, shampoo, conditioner, hair treatment, hair styling, professional hair products, hair masks, hair oils',
  openGraph: {
    title: 'Hair Care Products - Professional Hair Styling & Treatment | COSMT',
    description: 'Professional hair care products including shampoos, conditioners, treatments, and styling products.',
    images: ['/images/hair-care-og.jpg'],
  },
};

export default function HairCarePage() {
  const category = getCategoryBySlug('hair-care');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
