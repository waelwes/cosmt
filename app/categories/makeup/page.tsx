import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Makeup Products - Professional Cosmetics & Beauty | COSMT',
  description: 'Professional makeup products for face, eyes, and lips. High-quality cosmetics including foundation, eyeshadow, lipstick, and beauty tools.',
  keywords: 'makeup, cosmetics, foundation, eyeshadow, lipstick, mascara, professional makeup, beauty tools, brushes',
  openGraph: {
    title: 'Makeup Products - Professional Cosmetics & Beauty | COSMT',
    description: 'Professional makeup products for face, eyes, and lips. High-quality cosmetics and beauty tools.',
    images: ['/images/makeup-og.jpg'],
  },
};

export default function MakeupPage() {
  const category = getCategoryBySlug('makeup');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
