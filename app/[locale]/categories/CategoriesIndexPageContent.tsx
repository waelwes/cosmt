'use client';

import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowDownUp, ListFilter } from 'lucide-react';
import { ExpandableMainCategories } from '@/components/ui/ExpandableMainCategories';
import { useState, useEffect } from 'react';
import FourDotLoader from '@/components/ui/FourDotLoader';

interface CategoriesIndexPageContentProps {
  locale: string;
  content: any;
}

export default function CategoriesIndexPageContent({ locale, content }: CategoriesIndexPageContentProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();

        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();

        const categoriesData = await categoryService.getCategoriesWithSubcategories();
        const rawProducts = await productService.getProducts();

        // Transform products to match ProductCard expectations
        const transformedProducts = rawProducts.map((product: any) => ({
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
        const brands = Array.from(new Set(
          transformedProducts.map((p: any) => p.brand).filter(Boolean)
        )).sort();

        setCategories(categoriesData);
        setAllProducts(transformedProducts);
        setUniqueBrands(brands);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShowMore = async () => {
    setShowMoreLoading(true);
    // Add a small delay for better UX
    setTimeout(() => {
      setVisibleProducts(prev => prev + 12);
      setShowMoreLoading(false);
    }, 500);
  };

  const displayedProducts = allProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < allProducts.length;

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-4 sm:py-6 lg:py-10">
        <nav className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <ol className="flex space-x-1 sm:space-x-2">
            <li><Link href={`/${locale}`}>{content.breadcrumbHome}</Link></li>
            <li>{'>'}</li>
            <li className="text-gray-900">{content.breadcrumbCategories}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
            {/* Categories Card - Separate */}
            {categories.length > 0 && (
                <div className="bg-white p-6">
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
                  <ExpandableMainCategories
                    categories={categories}
                    locale={locale}
                    subcategoriesText={content.subcategories}
                    categoriesTitle={content.categories}
                  />
                </div>
              </div>
            )}

            {/* Filters Card - Separate */}
              <div className="bg-white p-6">
              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200 flex items-center">
                    <ListFilter className="w-5 h-5 mr-2 text-gray-900" />
                    {content.filters}
                  </h3>

                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{content.priceRange}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.under25}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.price25to50}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">{content.price50to100}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" style={{ accentColor: '#003d38' }} />
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
                            <input type="checkbox" style={{ accentColor: '#003d38' }} />
                            <span className="ml-2 text-sm text-gray-600">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <button className="w-full text-gray-700 py-2 px-4 text-sm font-medium transition-colors">
                    {content.clearFilters}
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button className="lg:hidden mb-4 w-full bg-white p-4 flex items-center justify-between transition-colors">
              <span className="text-sm font-medium text-gray-700">Filters & Categories</span>
              <ArrowDownUp className="w-4 h-4 text-gray-600" />
            </button>

            {/* Header Card */}
            <div className="mb-6">
              <div className="bg-white p-4 lg:p-6 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-base lg:text-lg font-semibold text-gray-900">
                      {content.allProducts}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{allProducts.length}</span> {content.productsFound}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <ArrowDownUp className="w-4 h-4 text-gray-600 hidden sm:block" />
                    <select className="flex-1 sm:flex-none !border-0 !shadow-none px-3 py-2 text-sm focus:ring-0 focus:bg-white outline-none focus:outline-none">
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

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-300 pt-0 px-0 pb-4 animate-pulse">
                    <div className="relative aspect-square bg-gray-200 mb-4"></div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-end">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-4 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {displayedProducts.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      showAddToCart={true}
                      showWishlist={true}
                    />
                  ))}
                </div>

                {hasMoreProducts && (
                  <div className="mt-8 flex justify-center">
                    {showMoreLoading ? (
                      <FourDotLoader />
                    ) : (
                      <button
                        onClick={handleShowMore}
                        className="w-full py-3 text-white font-medium transition-colors duration-200 !rounded-none"
                        style={{
                          backgroundColor: '#003d38',
                          borderRadius: '0px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                      >
                        <span>Show More</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 text-center">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
