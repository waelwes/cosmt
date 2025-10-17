import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipMaskPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="lip-care"
      productTypeSlug="lip-mask"
      title="Lip Mask"
      description="Intensive lip treatments for overnight repair"
    />
  );
}
