import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildProductPath } from '@/utils/slug';

// Language-specific content
const categoriesContent = {
  en: {
    title: 'Categories | Cosmat',
    description: 'Browse all product categories.',
    breadcrumbHome: 'Home',
    breadcrumbCategories: 'Categories',
    allProducts: 'All Products',
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
    title: 'الفئات | كوزمت',
    description: 'تصفح جميع فئات المنتجات.',
    breadcrumbHome: 'الرئيسية',
    breadcrumbCategories: 'الفئات',
    allProducts: 'جميع المنتجات',
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
    title: 'Kategoriler | Cosmat',
    description: 'Tüm ürün kategorilerini inceleyin.',
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbCategories: 'Kategoriler',
    allProducts: 'Tüm Ürünler',
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
    title: 'Kategorien | Cosmat',
    description: 'Durchsuchen Sie alle Produktkategorien.',
    breadcrumbHome: 'Startseite',
    breadcrumbCategories: 'Kategorien',
    allProducts: 'Alle Produkte',
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
    title: 'Catégories | Cosmat',
    description: 'Parcourez toutes les catégories de produits.',
    breadcrumbHome: 'Accueil',
    breadcrumbCategories: 'Catégories',
    allProducts: 'Tous les produits',
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
    title: 'Categorías | Cosmat',
    description: 'Explora todas las categorías de productos.',
    breadcrumbHome: 'Inicio',
    breadcrumbCategories: 'Categorías',
    allProducts: 'Todos los productos',
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

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const content = categoriesContent[locale as keyof typeof categoriesContent] || categoriesContent.en;
  
  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website'
    }
  };
}

export default async function CategoriesIndexPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const content = categoriesContent[locale as keyof typeof categoriesContent] || categoriesContent.en;
  
  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();

  const productService: IProductService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createProductService();

  const categories = await categoryService.getCategoriesWithSubcategories();
  const allProducts = await productService.getProducts();

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-10">
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li><Link href={`/${locale}`}>{content.breadcrumbHome}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{content.breadcrumbCategories}</li>
          </ol>
        </nav>
        
         {/* Header Card */}
         <div className="mb-8">
           <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
             <div className="flex items-center justify-between w-full">
               <div className="flex items-center space-x-2">
                 <div className="text-2xl font-semibold text-gray-900">
                   {content.allProducts}
                 </div>
               </div>
               
               <div className="text-sm text-gray-600">
                 <span className="font-medium">{allProducts.length}</span> {content.productsFound}
               </div>
               
               <div className="flex items-center space-x-2">
                 <span className="text-sm text-gray-600">{content.sortBy}</span>
                 <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
        
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.categories}</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {categories.map((category: any) => (
                    <Link 
                      key={category.id} 
                      href={`/${locale}/categories/${category.slug}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200"
                    >
                      <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 mb-1">
                        {category.name}
                      </h4>
                      {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {category.subcategories.length} {content.subcategories}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.filters}</h3>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{content.priceRange}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.under25}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.price25to50}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.price50to100}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.over100}</span>
                      </label>
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{content.brand}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">L'Oréal</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Pantene</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Head & Shoulders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Garnier</span>
                      </label>
                    </div>
                  </div>

                  {/* Product Type */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{content.productType}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.shampoo}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.conditioner}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.treatment}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">{content.styling}</span>
                      </label>
                    </div>
                  </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product: any) => (
            <Link 
              key={product.id} 
              href={buildProductPath({ 
                name: product.name, 
                categorySlug: product.categories?.slug, 
                subcategorySlug: null, 
                productSlug: product.slug, 
                id: product.id 
              })} 
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-all duration-200"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">{content.noImage}</div>
              )}
            </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {product.categories?.name}
              </p>
              <p className="text-lg font-semibold text-green-600">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
