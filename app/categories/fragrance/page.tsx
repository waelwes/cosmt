import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Fragrance & Perfume - Signature Scents & Essential Oils | COSMT',
  description: 'Discover signature fragrances for women, men, and unisex. Premium perfumes, body sprays, and essential oils for every occasion.',
  keywords: 'fragrance, perfume, cologne, body spray, essential oils, signature scent, women perfume, men perfume, unisex fragrance',
  openGraph: {
    title: 'Fragrance & Perfume - Signature Scents & Essential Oils | COSMT',
    description: 'Discover signature fragrances for women, men, and unisex. Premium perfumes and essential oils.',
    images: ['/images/fragrance-og.jpg'],
  },
};

export default function FragrancePage() {
  const category = getCategoryBySlug('fragrance');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
