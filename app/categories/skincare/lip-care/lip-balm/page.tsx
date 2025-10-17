import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipBalmPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="lip-care"
      productTypeSlug="lip-balm"
      title="Lip Balm"
      description="Moisturizing lip balms for daily care"
    />
  );
}
