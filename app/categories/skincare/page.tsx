import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Skincare Products - Professional Beauty & Cosmetics | COSMT',
  description: 'Discover premium skincare products including cleansers, serums, moisturizers, and treatments. Professional-grade beauty products for healthy, radiant skin.',
  keywords: 'skincare, beauty products, cleansers, serums, moisturizers, anti-aging, brightening, acne treatment, professional skincare',
  openGraph: {
    title: 'Skincare Products - Professional Beauty & Cosmetics | COSMT',
    description: 'Discover premium skincare products including cleansers, serums, moisturizers, and treatments.',
    images: ['/images/skincare-og.jpg'],
  },
};

export default function SkincarePage() {
  const category = getCategoryBySlug('skincare');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
