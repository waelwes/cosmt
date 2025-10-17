import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function PrimerPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="primer"
      title="Face Primer"
      description="Face primers for smooth makeup application"
    />
  );
}
