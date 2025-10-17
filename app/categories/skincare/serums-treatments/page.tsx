import { Metadata } from 'next';
import { SubCategoryPage } from '@/components/pages/SubCategoryPage';
import { getCategoryBySlug } from '../../../../data/categories';

export const metadata: Metadata = {
  title: 'Serums & Treatments - Targeted Skincare Solutions | COSMT',
  description: 'Targeted skincare serums and treatments including brightening, anti-aging, and acne serums. Professional-grade formulas for specific skin concerns.',
  keywords: 'skincare serums, face treatments, brightening serum, anti-aging serum, acne treatment, targeted skincare',
  openGraph: {
    title: 'Serums & Treatments - Targeted Skincare Solutions | COSMT',
    description: 'Targeted skincare serums and treatments for specific skin concerns.',
    images: ['/images/serums-treatments-og.jpg'],
  },
};

export default function SerumstreatmentsPage() {
  return (
    <SubCategoryPage
      categorySlug="skincare"
      subCategorySlug="serums-treatments"
      title="Serums & Treatments"
      description="Targeted skincare serums and treatments for specific skin concerns"
    />
  );
}
