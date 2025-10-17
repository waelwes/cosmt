import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function BlushBronzerPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="blush-bronzer"
      title="Blush & Bronzer"
      description="Cheek color products for natural glow"
    />
  );
}
