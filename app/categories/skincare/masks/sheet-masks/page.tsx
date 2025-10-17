import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function SheetMasksPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="masks"
      productTypeSlug="sheet-masks"
      title="Sheet Masks"
      description="Hydrating sheet masks for instant skin boost"
    />
  );
}
