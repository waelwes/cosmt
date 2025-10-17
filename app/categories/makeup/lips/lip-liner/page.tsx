import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipLinerPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="lips"
      productTypeSlug="lip-liner"
      title="Lip Liner"
      description="Lip liners and pencils for defined lips"
    />
  );
}
