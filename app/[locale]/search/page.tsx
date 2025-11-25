'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearch } from '../../../contexts/SearchContext';
import { useCart } from '../../../contexts/CartContextNew';
import { useProductDisplay } from '../../../hooks/useProductDisplay';
import { Star, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PageLayout } from '../../../components/layout/PageLayout';

// Language-specific content
const searchContent = {
  en: {
    title: 'Search Results',
    searchPlaceholder: 'Search products, brands, and more...',
    searchButton: 'Search',
    filters: 'Filters',
    searchFilters: 'Search Filters',
    category: 'Category',
    brand: 'Brand',
    priceRange: 'Price Range',
    sortBy: 'Sort By',
    relevance: 'Relevance',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    rating: 'Rating',
    newest: 'Newest',
    clearFilters: 'Clear Filters',
    productsFound: 'products found',
    noProducts: 'No products found',
    tryAdjusting: 'Try adjusting your search terms or filters',
    new: 'New',
    bestSeller: 'Best Seller',
    addToCart: 'Add to Cart',
    reviews: 'reviews',
    categories: ['Hair Care', 'Skincare', 'Body Care', 'Makeup', 'Fragrance'],
    brands: ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase']
  },
  ar: {
    title: 'نتائج البحث',
    searchPlaceholder: 'ابحث عن المنتجات والعلامات التجارية والمزيد...',
    searchButton: 'بحث',
    filters: 'المرشحات',
    searchFilters: 'مرشحات البحث',
    category: 'الفئة',
    brand: 'العلامة التجارية',
    priceRange: 'نطاق السعر',
    sortBy: 'ترتيب حسب',
    relevance: 'الصلة',
    priceLow: 'السعر: من الأقل للأعلى',
    priceHigh: 'السعر: من الأعلى للأقل',
    rating: 'التقييم',
    newest: 'الأحدث',
    clearFilters: 'مسح المرشحات',
    productsFound: 'منتج موجود',
    noProducts: 'لم يتم العثور على منتجات',
    tryAdjusting: 'حاول تعديل مصطلحات البحث أو المرشحات',
    new: 'جديد',
    bestSeller: 'الأكثر مبيعاً',
    addToCart: 'أضف للسلة',
    reviews: 'تقييم',
    categories: ['العناية بالشعر', 'العناية بالبشرة', 'العناية بالجسم', 'المكياج', 'العطور'],
    brands: ['أفيدا', 'دافينز', 'أوريب', 'بامبل آند بامبل', 'كيراستاس']
  },
  tr: {
    title: 'Arama Sonuçları',
    searchPlaceholder: 'Ürünler, markalar ve daha fazlasını arayın...',
    searchButton: 'Ara',
    filters: 'Filtreler',
    searchFilters: 'Arama Filtreleri',
    category: 'Kategori',
    brand: 'Marka',
    priceRange: 'Fiyat Aralığı',
    sortBy: 'Sırala',
    relevance: 'İlgililik',
    priceLow: 'Fiyat: Düşükten Yükseğe',
    priceHigh: 'Fiyat: Yüksekten Düşüğe',
    rating: 'Değerlendirme',
    newest: 'En Yeni',
    clearFilters: 'Filtreleri Temizle',
    productsFound: 'ürün bulundu',
    noProducts: 'Ürün bulunamadı',
    tryAdjusting: 'Arama terimlerinizi veya filtrelerinizi ayarlamayı deneyin',
    new: 'Yeni',
    bestSeller: 'En Çok Satan',
    addToCart: 'Sepete Ekle',
    reviews: 'değerlendirme',
    categories: ['Saç Bakımı', 'Cilt Bakımı', 'Vücut Bakımı', 'Makyaj', 'Parfüm'],
    brands: ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase']
  },
  de: {
    title: 'Suchergebnisse',
    searchPlaceholder: 'Produkte, Marken und mehr suchen...',
    searchButton: 'Suchen',
    filters: 'Filter',
    searchFilters: 'Suchfilter',
    category: 'Kategorie',
    brand: 'Marke',
    priceRange: 'Preisbereich',
    sortBy: 'Sortieren nach',
    relevance: 'Relevanz',
    priceLow: 'Preis: Niedrig zu Hoch',
    priceHigh: 'Preis: Hoch zu Niedrig',
    rating: 'Bewertung',
    newest: 'Neueste',
    clearFilters: 'Filter löschen',
    productsFound: 'Produkte gefunden',
    noProducts: 'Keine Produkte gefunden',
    tryAdjusting: 'Versuchen Sie, Ihre Suchbegriffe oder Filter anzupassen',
    new: 'Neu',
    bestSeller: 'Bestseller',
    addToCart: 'In den Warenkorb',
    reviews: 'Bewertungen',
    categories: ['Haarpflege', 'Hautpflege', 'Körperpflege', 'Make-up', 'Parfüm'],
    brands: ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase']
  },
  fr: {
    title: 'Résultats de recherche',
    searchPlaceholder: 'Rechercher des produits, marques et plus...',
    searchButton: 'Rechercher',
    filters: 'Filtres',
    searchFilters: 'Filtres de recherche',
    category: 'Catégorie',
    brand: 'Marque',
    priceRange: 'Gamme de prix',
    sortBy: 'Trier par',
    relevance: 'Pertinence',
    priceLow: 'Prix: Bas à Élevé',
    priceHigh: 'Prix: Élevé à Bas',
    rating: 'Note',
    newest: 'Plus récent',
    clearFilters: 'Effacer les filtres',
    productsFound: 'produits trouvés',
    noProducts: 'Aucun produit trouvé',
    tryAdjusting: 'Essayez d\'ajuster vos termes de recherche ou filtres',
    new: 'Nouveau',
    bestSeller: 'Meilleure vente',
    addToCart: 'Ajouter au panier',
    reviews: 'avis',
    categories: ['Soins capillaires', 'Soins de la peau', 'Soins du corps', 'Maquillage', 'Parfum'],
    brands: ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase']
  },
  es: {
    title: 'Resultados de búsqueda',
    searchPlaceholder: 'Buscar productos, marcas y más...',
    searchButton: 'Buscar',
    filters: 'Filtros',
    searchFilters: 'Filtros de búsqueda',
    category: 'Categoría',
    brand: 'Marca',
    priceRange: 'Rango de precios',
    sortBy: 'Ordenar por',
    relevance: 'Relevancia',
    priceLow: 'Precio: Bajo a Alto',
    priceHigh: 'Precio: Alto a Bajo',
    rating: 'Calificación',
    newest: 'Más reciente',
    clearFilters: 'Limpiar filtros',
    productsFound: 'productos encontrados',
    noProducts: 'No se encontraron productos',
    tryAdjusting: 'Intenta ajustar tus términos de búsqueda o filtros',
    new: 'Nuevo',
    bestSeller: 'Más vendido',
    addToCart: 'Agregar al carrito',
    reviews: 'reseñas',
    categories: ['Cuidado del cabello', 'Cuidado de la piel', 'Cuidado del cuerpo', 'Maquillaje', 'Perfume'],
    brands: ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase']
  }
};

export default function SearchPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const content = searchContent[locale as keyof typeof searchContent] || searchContent.en;

  const { searchQuery, setSearchQuery, getFilteredResults, filters, setFilters, clearFilters } = useSearch();
  const { addToCart } = useCart();
  const { convertProductsForDisplay } = useProductDisplay();
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [displayResults, setDisplayResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const results = getFilteredResults;

  // Convert products for display with translations
  useEffect(() => {
    const convertProducts = async () => {
      setIsLoading(true);
      try {
        const converted = await convertProductsForDisplay(results);
        setDisplayResults(converted);
      } catch (error) {
        console.error('Error converting products:', error);
        setDisplayResults(results);
      } finally {
        setIsLoading(false);
      }
    };

    convertProducts();
  }, [results, convertProductsForDisplay]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      description: product.description,
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#fbfbfb' }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="cosmt-container py-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 hover:border-green-300 transition-colors duration-200 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">{content.filters}</span>
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder={content.searchPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 text-base focus:outline-none focus:ring-2 transition-colors duration-200 rounded-lg"
                  style={{ '--tw-ring-color': '#003d38' } as React.CSSProperties}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#003d38';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 61, 56, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 text-white transition-colors duration-200 rounded-lg font-medium"
                  style={{ backgroundColor: '#003d38' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                >
                  {content.searchButton}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="cosmt-container py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <SlidersHorizontal className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{content.searchFilters}</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="px-6 py-4">

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">{content.category}</h4>
                    <div className="space-y-3">
                      {content.categories.map((category) => (
                        <label key={category} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={(e) => setFilters({ category: e.target.value })}
                            className="w-4 h-4 border-gray-300"
                            style={{ accentColor: '#003d38' }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="mb-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">{content.brand}</h4>
                    <div className="space-y-3">
                      {content.brands.map((brand) => (
                        <label key={brand} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200 cursor-pointer">
                          <input
                            type="radio"
                            name="brand"
                            value={brand}
                            checked={filters.brand === brand}
                            onChange={(e) => setFilters({ brand: e.target.value })}
                            className="w-4 h-4 border-gray-300"
                            style={{ accentColor: '#003d38' }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">{content.priceRange}</h4>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-600 font-medium">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="mb-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">{content.sortBy}</h4>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 rounded-lg transition-colors duration-200"
                      style={{ '--tw-ring-color': '#003d38' } as React.CSSProperties}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#003d38';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 61, 56, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      <option value="relevance">{content.relevance}</option>
                      <option value="price-low">{content.priceLow}</option>
                      <option value="price-high">{content.priceHigh}</option>
                      <option value="rating">{content.rating}</option>
                      <option value="newest">{content.newest}</option>
                    </select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-300 transition-colors duration-200 text-sm font-medium rounded-lg"
                  >
                    {content.clearFilters}
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg text-gray-600">
                  {results.length} {content.productsFound}
                </p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500 mb-4">{content.noProducts}</p>
                  <p className="text-base text-gray-400">
                    {content.tryAdjusting}
                  </p>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Translating products...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayResults.map((product, index) => (
                    <div key={`${product.id}-${index}`} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4 rounded-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col space-y-1">
                          {product.isNew && (
                            <span className="px-2 py-1 text-white text-xs font-medium rounded" style={{ backgroundColor: '#003d38' }}>
                              {content.new}
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded">
                              {content.bestSeller}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full text-white"
                            style={{ backgroundColor: '#003d38' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                          >
                            {content.addToCart}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{product.brand}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-600 transition-colors duration-200">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {product.reviews} {content.reviews}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
