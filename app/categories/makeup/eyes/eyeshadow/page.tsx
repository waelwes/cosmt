import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function EyeshadowPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="eyes"
      productTypeSlug="eyeshadow"
      title="Eyeshadow"
      description="Eye shadow palettes and singles for creative looks"
    />
  );
}
