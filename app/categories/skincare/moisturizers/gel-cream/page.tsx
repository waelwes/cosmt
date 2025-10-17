import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function GelCreamPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="moisturizers"
      productTypeSlug="gel-cream"
      title="Gel Cream"
      description="Lightweight gel moisturizers for oily and combination skin"
    />
  );
}
