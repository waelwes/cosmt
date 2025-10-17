import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Beauty Supplements - Hair, Skin & Nails Vitamins | COSMT',
  description: 'Beauty supplements for hair, skin, and nails including collagen, biotin, hyaluronic acid, and anti-aging capsules.',
  keywords: 'beauty supplements, hair vitamins, skin vitamins, collagen, biotin, hyaluronic acid, anti-aging, wellness',
  openGraph: {
    title: 'Beauty Supplements - Hair, Skin & Nails Vitamins | COSMT',
    description: 'Beauty supplements for hair, skin, and nails including collagen, biotin, and hyaluronic acid.',
    images: ['/images/supplements-og.jpg'],
  },
};

export default function SupplementsPage() {
  const category = getCategoryBySlug('supplements');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
