import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function NightCreamPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="moisturizers"
      productTypeSlug="night-cream"
      title="Night Cream"
      description="Rich night moisturizers for overnight repair"
    />
  );
}
