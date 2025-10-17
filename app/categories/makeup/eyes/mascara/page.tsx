import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function MascaraPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="eyes"
      productTypeSlug="mascara"
      title="Mascara"
      description="Mascara and lash products for dramatic eyes"
    />
  );
}
