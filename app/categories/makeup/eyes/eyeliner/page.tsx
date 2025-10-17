import { ProductListingPage } from '@/components/pages/ProductListingPage';

export default function EyelinerPage() {
  return (
    <ProductListingPage
      categorySlug="makeup"
      subCategorySlug="eyes"
      productTypeSlug="eyeliner"
      title="Eyeliner"
      description="Eye liners and pencils for defined eyes"
    />
  );
}
