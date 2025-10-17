import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function MicellarWaterPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="cleansers"
      productTypeSlug="micellar-water"
      title="Micellar Water"
      description="Gentle micellar water for effective cleansing"
    />
  );
}
