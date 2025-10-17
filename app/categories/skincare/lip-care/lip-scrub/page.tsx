import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipScrubPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="lip-care"
      productTypeSlug="lip-scrub"
      title="Lip Scrub"
      description="Exfoliating lip scrubs for smooth lips"
    />
  );
}
