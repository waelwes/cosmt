import { Metadata } from 'next';
import { ProductListingPage } from '@/components/pages/ProductListingPage';
import { getCategoryBySlug } from '../../../../../data/categories';

export const metadata: Metadata = {
  title: 'Brightening Serum - Vitamin C & Brightening Face Serums | COSMT',
  description: 'Brightening serums with Vitamin C and other brightening ingredients. Reduce dark spots, even skin tone, and achieve radiant, glowing skin.',
  keywords: 'brightening serum, vitamin c serum, dark spot treatment, skin brightening, even skin tone, radiant skin',
  openGraph: {
    title: 'Brightening Serum - Vitamin C & Brightening Face Serums | COSMT',
    description: 'Brightening serums with Vitamin C and other brightening ingredients.',
    images: ['/images/brightening-serum-og.jpg'],
  },
};

export default function BrighteningSerumPage() {
  const category = getCategoryBySlug('brightening-serum');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <ProductListingPage category={category} />;
}
