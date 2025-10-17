import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Mom & Baby Care - Gentle Care Products | COSMT',
  description: 'Gentle care products for mothers and babies including baby lotion, shampoo, stretch mark cream, and nursing products.',
  keywords: 'mom baby care, baby products, baby lotion, baby shampoo, stretch mark cream, nursing cream, gentle care',
  openGraph: {
    title: 'Mom & Baby Care - Gentle Care Products | COSMT',
    description: 'Gentle care products for mothers and babies including baby lotion, shampoo, and stretch mark cream.',
    images: ['/images/mom-baby-og.jpg'],
  },
};

export default function MomBabyPage() {
  const category = getCategoryBySlug('mom-baby-care');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
