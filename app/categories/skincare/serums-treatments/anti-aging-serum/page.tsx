import { Metadata } from 'next';
import { ProductListingPage } from '@/components/pages/ProductListingPage';
import { getCategoryBySlug } from '../../../../../data/categories';

export const metadata: Metadata = {
  title: 'Anti-Aging Serum - Retinol & Anti-Aging Face Serums | COSMT',
  description: 'Anti-aging serums with retinol, peptides, and other anti-aging ingredients. Reduce fine lines, wrinkles, and signs of aging for youthful skin.',
  keywords: 'anti-aging serum, retinol serum, anti-wrinkle, peptides, youthful skin, fine lines, wrinkle treatment',
  openGraph: {
    title: 'Anti-Aging Serum - Retinol & Anti-Aging Face Serums | COSMT',
    description: 'Anti-aging serums with retinol, peptides, and other anti-aging ingredients.',
    images: ['/images/anti-aging-serum-og.jpg'],
  },
};

export default function AntiAgingSerumPage() {
  const category = getCategoryBySlug('anti-aging-serum');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <ProductListingPage category={category} />;
}
