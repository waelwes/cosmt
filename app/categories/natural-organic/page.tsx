import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Natural & Organic Beauty - Clean Beauty Products | COSMT',
  description: 'Natural and organic beauty products including organic skincare, natural oils, herbal soaps, and vegan cosmetics.',
  keywords: 'natural beauty, organic skincare, clean beauty, vegan products, natural oils, herbal soaps, essential oils',
  openGraph: {
    title: 'Natural & Organic Beauty - Clean Beauty Products | COSMT',
    description: 'Natural and organic beauty products including organic skincare, natural oils, and vegan cosmetics.',
    images: ['/images/natural-organic-og.jpg'],
  },
};

export default function NaturalOrganicPage() {
  const category = getCategoryBySlug('natural-organic');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
