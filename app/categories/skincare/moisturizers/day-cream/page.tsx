import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function DayCreamPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="moisturizers"
      productTypeSlug="day-cream"
      title="Day Cream"
      description="Daily moisturizers with SPF protection"
    />
  );
}
