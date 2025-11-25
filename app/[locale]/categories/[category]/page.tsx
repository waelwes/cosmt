import { ServiceContainer } from '../../../../lib/di/ServiceContainer';
import { ICategoryService } from '../../../../lib/factories/interfaces/ICategoryService';
import { IProductService } from '../../../../lib/factories/interfaces/IProductService';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildProductPath } from '../../../../utils/slug';
import { Header } from '../../../../components/layout/Header';
import { Footer } from '../../../../components/layout/Footer';
import { ExpandableSubcategories } from '../../../../components/category-layouts/ExpandableSubcategories';
import { ProductCard } from '../../../../components/ui/ProductCard';
import { ArrowDownUp, ListFilter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();
  const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) return {};
  const title = category.meta_title || `${category.name} | Categories`;
  const description = category.meta_description || `Explore ${category.name} products.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: categorySlug } = await params;
  
  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();

  const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) {
    return null;
  }

  // Get product service
  const productService: IProductService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createProductService();

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

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-4 sm:py-6 lg:py-10">
        <nav className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <ol className="flex space-x-1 sm:space-x-2">
            <li><Link href={`/${locale}`}>Home</Link></li>
            <li>{'>'}</li>
            <li><Link href={`/${locale}/categories`}>Categories</Link></li>
            <li>{'>'}</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>
        

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Categories Card - Separate */}
              {subcategories.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
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
              <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200 flex items-center">
                    <ListFilter className="w-5 h-5 mr-2 text-gray-900" />
                    Filters
                  </h3>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">Under $25</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">$25 - $50</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">$50 - $100</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                        <span className="ml-2 text-sm text-gray-600">Over $100</span>
                      </label>
                    </div>
                  </div>

                  {/* Brand - Dynamic from products */}
                  {(() => {
                    const uniqueBrands = Array.from(new Set(
                      products.map((p: any) => p.brand).filter(Boolean)
                    )).sort();
                    return uniqueBrands.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Brand</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {uniqueBrands.map((brand: string) => (
                            <label key={brand} className="flex items-center">
                              <input type="checkbox" className="rounded border-gray-300" style={{ accentColor: '#003d38' }} />
                              <span className="ml-2 text-sm text-gray-600">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Product Type - Show subcategories as product types */}
                  {subcategories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Product Type</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {subcategories.map((subcat: any) => (
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
                    Clear All Filters
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button className="lg:hidden mb-4 w-full bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">Filters & Categories</span>
              <ArrowDownUp className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Header Card */}
            <div className="mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-base lg:text-lg font-semibold text-gray-900">
                      {category.name}
                    </div>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{products.length}</span> products found
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <ArrowDownUp className="w-4 h-4 text-gray-600 hidden sm:block" />
                    <select className="flex-1 sm:flex-none !border-0 !shadow-none bg-gray-50 rounded-md px-3 py-2 text-sm focus:ring-0 focus:bg-white outline-none focus:outline-none">
                      <option value="popular">Popular Products</option>
                      <option value="new">New Arrivals</option>
                      <option value="bestsellers">Best Sellers</option>
                      <option value="price-asc">Increasing Price</option>
                      <option value="price-desc">Decreasing Price</option>
                      <option value="rated">Highly Rated</option>
                      <option value="scores">High Scores</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
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
