import { Metadata } from 'next';
import { ProductListingPage } from '@/components/pages/ProductListingPage';
import { getCategoryBySlug } from '../../../../../data/categories';

export const metadata: Metadata = {
  title: 'Acne Serum - Acne Treatment & Blemish Control Serums | COSMT',
  description: 'Acne treatment serums with salicylic acid, benzoyl peroxide, and other acne-fighting ingredients. Clear blemishes and prevent breakouts.',
  keywords: 'acne serum, acne treatment, blemish control, salicylic acid, benzoyl peroxide, clear skin, breakout prevention',
  openGraph: {
    title: 'Acne Serum - Acne Treatment & Blemish Control Serums | COSMT',
    description: 'Acne treatment serums with salicylic acid, benzoyl peroxide, and other acne-fighting ingredients.',
    images: ['/images/acne-serum-og.jpg'],
  },
};

export default function AcneSerumPage() {
  const category = getCategoryBySlug('acne-serum');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <ProductListingPage category={category} />;
}
