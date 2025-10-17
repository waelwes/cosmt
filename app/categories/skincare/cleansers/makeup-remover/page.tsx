import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function MakeupRemoverPage() {
  return (
    <ProductListingPage
      categorySlug="skincare"
      subCategorySlug="cleansers"
      productTypeSlug="makeup-remover"
      title="Makeup Remover"
      description="Effective makeup removal products for all skin types"
    />
  );
}
