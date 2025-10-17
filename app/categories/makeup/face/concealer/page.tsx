import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function ConcealerPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="concealer"
      title="Concealer"
      description="Concealers and correctors for flawless coverage"
    />
  );
}
