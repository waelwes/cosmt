import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function ClayMasksPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="masks"
      productTypeSlug="clay-masks"
      title="Clay Masks"
      description="Purifying clay masks for deep cleansing"
    />
  );
}
