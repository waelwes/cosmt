import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function FaceWashPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="cleansers"
      productTypeSlug="face-wash"
      title="Face Wash"
      description="Daily face wash products for all skin types"
    />
  );
}
