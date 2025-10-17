import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function SleepingMasksPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="masks"
      productTypeSlug="sleeping-masks"
      title="Sleeping Masks"
      description="Overnight treatment masks for skin repair"
    />
  );
}
