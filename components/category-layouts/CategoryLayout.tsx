import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildProductPath } from '@/utils/slug';
import { ExpandableSubcategories } from './ExpandableSubcategories';
import { ArrowDownUp } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';

// Language-specific content
const categoriesContent = {
  en: {
    breadcrumbHome: 'Home',
    breadcrumbCategories: 'Categories',
    productsFound: 'products found',
    sortBy: 'Sort by:',
    popular: 'Popular Products',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    priceAsc: 'Increasing Price',
    priceDesc: 'Decreasing Price',
    rated: 'Highly Rated',
    scores: 'High Scores',
    categories: 'Categories',
    subcategories: 'subcategories',
    filters: 'Filters',
    priceRange: 'Price Range',
    under25: 'Under $25',
    price25to50: '$25 - $50',
    price50to100: '$50 - $100',
    over100: 'Over $100',
    brand: 'Brand',
    productType: 'Product Type',
    shampoo: 'Shampoo',
    conditioner: 'Conditioner',
    treatment: 'Treatment',
    styling: 'Styling',
    clearFilters: 'Clear All Filters',
    noImage: 'No Image'
  },
  ar: {
    breadcrumbHome: 'الرئيسية',
    breadcrumbCategories: 'الفئات',
    productsFound: 'منتج موجود',
    sortBy: 'ترتيب حسب:',
    popular: 'المنتجات الشائعة',
    newArrivals: 'الوافدات الجديدة',
    bestSellers: 'الأكثر مبيعاً',
    priceAsc: 'السعر تصاعدياً',
    priceDesc: 'السعر تنازلياً',
    rated: 'الأعلى تقييماً',
    scores: 'أعلى النقاط',
    categories: 'الفئات',
    subcategories: 'فئات فرعية',
    filters: 'المرشحات',
    priceRange: 'نطاق السعر',
    under25: 'أقل من 25$',
    price25to50: '25$ - 50$',
    price50to100: '50$ - 100$',
    over100: 'أكثر من 100$',
    brand: 'العلامة التجارية',
    productType: 'نوع المنتج',
    shampoo: 'شامبو',
    conditioner: 'بلسم',
    treatment: 'علاج',
    styling: 'تصفيف',
    clearFilters: 'مسح جميع المرشحات',
    noImage: 'لا توجد صورة'
  },
  tr: {
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbCategories: 'Kategoriler',
    productsFound: 'ürün bulundu',
    sortBy: 'Sırala:',
    popular: 'Popüler Ürünler',
    newArrivals: 'Yeni Gelenler',
    bestSellers: 'En Çok Satanlar',
    priceAsc: 'Artan Fiyat',
    priceDesc: 'Azalan Fiyat',
    rated: 'Yüksek Puanlı',
    scores: 'Yüksek Skorlu',
    categories: 'Kategoriler',
    subcategories: 'alt kategori',
    filters: 'Filtreler',
    priceRange: 'Fiyat Aralığı',
    under25: '25$ Altı',
    price25to50: '25$ - 50$',
    price50to100: '50$ - 100$',
    over100: '100$ Üzeri',
    brand: 'Marka',
    productType: 'Ürün Tipi',
    shampoo: 'Şampuan',
    conditioner: 'Saç Kremi',
    treatment: 'Tedavi',
    styling: 'Şekillendirme',
    clearFilters: 'Tüm Filtreleri Temizle',
    noImage: 'Resim Yok'
  },
  de: {
    breadcrumbHome: 'Startseite',
    breadcrumbCategories: 'Kategorien',
    productsFound: 'Produkte gefunden',
    sortBy: 'Sortieren nach:',
    popular: 'Beliebte Produkte',
    newArrivals: 'Neuankömmlinge',
    bestSellers: 'Bestseller',
    priceAsc: 'Preis aufsteigend',
    priceDesc: 'Preis absteigend',
    rated: 'Hoch bewertet',
    scores: 'Hohe Bewertungen',
    categories: 'Kategorien',
    subcategories: 'Unterkategorien',
    filters: 'Filter',
    priceRange: 'Preisbereich',
    under25: 'Unter 25$',
    price25to50: '25$ - 50$',
    price50to100: '50$ - 100$',
    over100: 'Über 100$',
    brand: 'Marke',
    productType: 'Produkttyp',
    shampoo: 'Shampoo',
    conditioner: 'Spülung',
    treatment: 'Behandlung',
    styling: 'Styling',
    clearFilters: 'Alle Filter löschen',
    noImage: 'Kein Bild'
  },
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbCategories: 'Catégories',
    productsFound: 'produits trouvés',
    sortBy: 'Trier par:',
    popular: 'Produits populaires',
    newArrivals: 'Nouveautés',
    bestSellers: 'Meilleures ventes',
    priceAsc: 'Prix croissant',
    priceDesc: 'Prix décroissant',
    rated: 'Mieux notés',
    scores: 'Scores élevés',
    categories: 'Catégories',
    subcategories: 'sous-catégories',
    filters: 'Filtres',
    priceRange: 'Gamme de prix',
    under25: 'Moins de 25$',
    price25to50: '25$ - 50$',
    price50to100: '50$ - 100$',
    over100: 'Plus de 100$',
    brand: 'Marque',
    productType: 'Type de produit',
    shampoo: 'Shampoing',
    conditioner: 'Après-shampoing',
    treatment: 'Traitement',
    styling: 'Coiffage',
    clearFilters: 'Effacer tous les filtres',
    noImage: 'Aucune image'
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbCategories: 'Categorías',
    productsFound: 'productos encontrados',
    sortBy: 'Ordenar por:',
    popular: 'Productos populares',
    newArrivals: 'Nuevos productos',
    bestSellers: 'Más vendidos',
    priceAsc: 'Precio ascendente',
    priceDesc: 'Precio descendente',
    rated: 'Mejor valorados',
    scores: 'Puntuaciones altas',
    categories: 'Categorías',
    subcategories: 'subcategorías',
    filters: 'Filtros',
    priceRange: 'Rango de precios',
    under25: 'Menos de $25',
    price25to50: '$25 - $50',
    price50to100: '$50 - $100',
    over100: 'Más de $100',
    brand: 'Marca',
    productType: 'Tipo de producto',
    shampoo: 'Champú',
    conditioner: 'Acondicionador',
    treatment: 'Tratamiento',
    styling: 'Peinado',
    clearFilters: 'Limpiar todos los filtros',
    noImage: 'Sin imagen'
  }
};

interface CategoryLayoutProps {
  categorySlug: string;
  locale: string;
}

export async function CategoryLayout({ categorySlug, locale }: CategoryLayoutProps) {
  const content = categoriesContent[locale as keyof typeof categoriesContent] || categoriesContent.en;
  
  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();

  const productService: IProductService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createProductService();

  // Get the specific category
  const category = await categoryService.getCategoryBySlug(categorySlug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Category not found</p>
          <Link href={`/${locale}`} className="text-white px-6 py-3 rounded-lg transition-colors inline-block hover:bg-[#002a25]" style={{ backgroundColor: '#003d38' }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Get subcategories for this category
  const subcategories = await categoryService.getSubcategoriesByCategory(category.id);
  const subcategoryIds = subcategories.map(sub => sub.id);
  
  // Get child categories (3rd level) for all subcategories
  const childCategoriesPromises = subcategoryIds.map(id => 
    categoryService.getSubcategoriesByCategory(id)
  );
  const childCategoriesArrays = await Promise.all(childCategoriesPromises);
  const childCategories = childCategoriesArrays.flat();
  const childCategoryIds = childCategories.map(child => child.id);
  
  // Get products for this category, its subcategories, and all child categories
  const allCategoryIds = [category.id, ...subcategoryIds, ...childCategoryIds];
  const rawProducts = await productService.getProductsByCategories(allCategoryIds);
  
  // Transform products to match ProductCard expectations
  const products = rawProducts.map((product: any) => ({
    ...product,
    // Map child_categories to subcategories for ProductCard compatibility
    subcategories: product.child_categories ? {
      id: product.child_categories.id,
      name: product.child_categories.name,
      slug: product.child_categories.slug
    } : undefined,
    // Ensure price is a number (ProductCard will format it)
    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
    // Map is_best_seller to isBestSeller
    isBestSeller: product.is_best_seller || false,
    isOnSale: product.is_on_sale || false,
  }));
  
  // Extract unique brands from products for dynamic brand filter
  const uniqueBrands = Array.from(new Set(
    products.map((p: any) => p.brand).filter(Boolean)
  )).sort();

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-10">
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li><Link href={`/${locale}`}>{content.breadcrumbHome}</Link></li>
            <li>/</li>
            <li><Link href={`/${locale}/categories`}>{content.breadcrumbCategories}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>
        
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
            {/* Categories Card - Separate */}
            {subcategories.length > 0 && (
                <div className="bg-white p-6">
                <ExpandableSubcategories
                  categorySlug={categorySlug}
                  subcategories={subcategories}
                  childCategories={childCategories}
                  products={products}
                  locale={locale}
                />
              </div>
            )}

            {/* Filters Card - Separate */}
              <div className="bg-white p-6">
              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">{content.filters}</h3>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{content.priceRange}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.under25}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.price25to50}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.price50to100}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.over100}</span>
                      </label>
                    </div>
                  </div>

                  {/* Brand - Dynamic from products */}
                  {uniqueBrands.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{content.brand}</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {uniqueBrands.map((brand: string) => (
                          <label key={brand} className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                            <span className="ml-2 text-sm text-gray-600">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Type - Show only subcategories as product types */}
                  {subcategories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{content.productType}</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {subcategories
                          .filter((subcat: any) => {
                            // Only show these specific subcategories
                            const allowedSubcategories = [
                              'Shampoo',
                              'Hair conditioner',
                              'Hair Care Oils',
                              'Hair Serum',
                              'Hair Mask',
                              'Shapers',
                              'Hair Equipment',
                              'Hairbrush and Comb',
                              'Hair Dye Care',
                              'Bond Intensive Care',
                              'Keratin and Straightening Treatment',
                              'Perm Products',
                              'Hairdressing Equipment'
                            ];
                            return allowedSubcategories.includes(subcat.name);
                          })
                          .sort((a: any, b: any) => {
                            // Sort by the order in the allowed list
                            const allowedSubcategories = [
                              'Shampoo',
                              'Hair conditioner',
                              'Hair Care Oils',
                              'Hair Serum',
                              'Hair Mask',
                              'Shapers',
                              'Hair Equipment',
                              'Hairbrush and Comb',
                              'Hair Dye Care',
                              'Bond Intensive Care',
                              'Keratin and Straightening Treatment',
                              'Perm Products',
                              'Hairdressing Equipment'
                            ];
                            const indexA = allowedSubcategories.indexOf(a.name);
                            const indexB = allowedSubcategories.indexOf(b.name);
                            return indexA - indexB;
                          })
                          .map((subcat: any) => (
                            <label key={subcat.id} className="flex items-center">
                              <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                              <span className="ml-2 text-sm text-gray-600">{subcat.name}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    {content.clearFilters}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Card */}
            <div className="mb-6">
              <div className="bg-white p-6 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{products.length}</span> {content.productsFound}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ArrowDownUp className="w-4 h-4 text-gray-600" />
                    <select className="!border-0 !shadow-none bg-gray-50 rounded-md px-3 py-1 text-sm focus:ring-0 focus:bg-white outline-none focus:outline-none">
                      <option value="popular">{content.popular}</option>
                      <option value="new">{content.newArrivals}</option>
                      <option value="bestsellers">{content.bestSellers}</option>
                      <option value="price-asc">{content.priceAsc}</option>
                      <option value="price-desc">{content.priceDesc}</option>
                      <option value="rated">{content.rated}</option>
                      <option value="scores">{content.scores}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    showAddToCart={true}
                    showWishlist={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
