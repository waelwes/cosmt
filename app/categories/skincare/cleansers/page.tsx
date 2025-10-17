import { Metadata } from 'next';
import { SubCategoryPage } from '@/components/pages/SubCategoryPage';
import { getCategoryBySlug } from '../../../../data/categories';

export const metadata: Metadata = {
  title: 'Face Cleansers - Gentle Daily Cleansing Products | COSMT',
  description: 'Gentle face cleansers including face wash, makeup remover, and micellar water. Professional cleansing products for all skin types.',
  keywords: 'face cleansers, face wash, makeup remover, micellar water, gentle cleansing, daily cleanser, skincare routine',
  openGraph: {
    title: 'Face Cleansers - Gentle Daily Cleansing Products | COSMT',
    description: 'Gentle face cleansers including face wash, makeup remover, and micellar water.',
    images: ['/images/cleansers-og.jpg'],
  },
};

export default function CleansersPage() {
  return (
    <SubCategoryPage
      categorySlug="skincare"
      subCategorySlug="cleansers"
      title="Face Cleansers"
      description="Gentle face cleansers including face wash, makeup remover, and micellar water"
    />
  );
}
