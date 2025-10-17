import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function HighlighterPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="face"
      productTypeSlug="highlighter"
      title="Highlighter"
      description="Highlighting products for radiant glow"
    />
  );
}
