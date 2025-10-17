import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function EyebrowProductsPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="eyes"
      productTypeSlug="eyebrow-products"
      title="Eyebrow Products"
      description="Brow shaping and coloring products"
    />
  );
}
