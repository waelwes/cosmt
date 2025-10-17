import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Men\'s Grooming - Complete Grooming Solutions for Men | COSMT',
  description: 'Complete men\'s grooming products including face wash, moisturizers, shaving products, beard care, and styling essentials.',
  keywords: 'mens grooming, face wash, moisturizer, shaving, beard care, hair styling, deodorant, mens skincare',
  openGraph: {
    title: 'Men\'s Grooming - Complete Grooming Solutions for Men | COSMT',
    description: 'Complete men\'s grooming products including face wash, moisturizers, shaving products.',
    images: ['/images/mens-grooming-og.jpg'],
  },
};

export default function MensGroomingPage() {
  const category = getCategoryBySlug('mens-grooming');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
