import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function LipGlossPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="lips"
      productTypeSlug="lip-gloss"
      title="Lip Gloss"
      description="Lip gloss and shine for glossy lips"
    />
  );
}
