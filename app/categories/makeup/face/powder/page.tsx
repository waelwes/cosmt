import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function PowderPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="powder"
      title="Powder"
      description="Setting and finishing powders for long-lasting makeup"
    />
  );
}
