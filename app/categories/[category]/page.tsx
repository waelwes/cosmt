/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildProductPath } from '@/utils/slug';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExpandableCategories } from '@/components/ui/ExpandableCategories';
import { ProductCard } from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
    const categoryService: ICategoryService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createCategoryService();
    const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) return {};
  const catAny = category as any;
  const title = catAny.meta_title || `${category.name} | Categories`;
  const description = catAny.meta_description || `Explore ${category.name} products.`;
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

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  
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

  // Check if this category is actually a subcategory (has a parent)
  const catAny = category as any;
  const isSubcategory = catAny.parent_id !== null;
  
  let subcategories, products, topLevelSubcategories, groupedChildren;
  
  if (isSubcategory) {
    // If this is a subcategory, show its children (3rd level categories)
    subcategories = await categoryService.getSubcategoriesByCategory(category.id);
    const allCategoryIds = [category.id, ...subcategories.map(sub => sub.id)];
    products = await productService.getProductsByCategories(allCategoryIds);
    topLevelSubcategories = subcategories;
    groupedChildren = {};
  } else {
    // If this is a main category, show its direct children (subcategories)
    subcategories = await categoryService.getSubcategoriesByCategory(category.id);
    const allCategoryIds = [category.id, ...subcategories.map(sub => sub.id)];
    products = await productService.getProductsByCategories(allCategoryIds);
    topLevelSubcategories = subcategories;
    groupedChildren = {};
  }

    return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-10">
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li><Link href="/categories">Categories</Link></li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600">Explore our comprehensive range of {category.name.toLowerCase()} products</p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ExpandableCategories 
                  topLevelSubcategories={topLevelSubcategories as any}
                  groupedChildren={groupedChildren as any}
                  categorySlug={category.slug}
                />
              </div>

              {/* Products */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Products ({products.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {products.slice(0, 20).map((product: any) => (
                    <Link 
                      key={product.id} 
                      href={buildProductPath({ 
                        name: product.name, 
                        categorySlug: category.slug, 
                        subcategorySlug: product.categories?.slug, 
                        productSlug: product.slug, 
                        id: product.id 
                      })} 
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200"
                    >
                      <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {product.categories?.name}
                      </p>
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        ${product.price}
                      </p>
                    </Link>
                  ))}
                  {products.length > 20 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{products.length - 20} more products
                    </p>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Under $25</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">$25 - $50</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">$50 - $100</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Over $100</span>
                      </label>
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brand</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">L&apos;Oréal</span>
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

                  {/* Hair Type */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hair Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Dry Hair</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Oily Hair</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Damaged Hair</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Color-Treated</span>
                      </label>
                    </div>
                  </div>

                  {/* Hair Care Products - Only show for hair-care category */}
                  {category.slug === 'hair-care' && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Hair Care Products</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Care Spray</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Conditioner</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Lotion</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Mask</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Peeling</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Serum</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Tonic</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Oil</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Shampoo</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Set</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Bond Strengthener</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Care Foam</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Brush</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hairpin</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Blow Dryer Brush</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Keratin Lotion</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Cutting Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Crepe Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Massage Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Perm Paper</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Perm Lotion</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Perm Stabilizer</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Perm Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Pump</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Detangling Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Hair Clip</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Comb</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Bobby Pin</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Clasp</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Knob Net</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Bun Brush</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-2 text-sm text-gray-600">Mace Sponge</span>
                        </label>
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar Card */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                {/* Filter Bar Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{products.length}</span> products found
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale="en" // This will be dynamic based on the actual locale
                    showAddToCart={true}
                    showWishlist={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
