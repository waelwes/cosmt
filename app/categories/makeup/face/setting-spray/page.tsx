import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function SettingSprayPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="setting-spray"
      title="Setting Spray"
      description="Makeup setting sprays for long-lasting wear"
    />
  );
}
