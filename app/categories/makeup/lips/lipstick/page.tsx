import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipstickPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="lips"
      productTypeSlug="lipstick"
      title="Lipstick"
      description="Lipstick and lip color for bold and beautiful lips"
    />
  );
}
