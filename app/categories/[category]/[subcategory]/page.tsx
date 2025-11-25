import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import { buildProductPath } from '@/utils/slug';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExpandableCategories } from '@/components/ui/ExpandableCategories';
import { ProductCard } from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string }> }): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();
  const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) return {};
  const subs = await categoryService.getSubcategoriesByCategory(category.id);
  const sub = subs.find(s => s.slug === subcategorySlug);
  if (!sub) return {};
  const title = sub.meta_title || `${sub.name} | ${category.name}`;
  const description = sub.meta_description || `Browse ${sub.name} in ${category.name}.`;
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

export default async function SubcategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;

  const categoryService: ICategoryService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createCategoryService();
  const productService: IProductService = ServiceContainer
    .getInstance()
    .getServiceFactory()
    .createProductService();

  try {
    const category = await categoryService.getCategoryBySlug(categorySlug);
    if (!category) {
      console.log('❌ Category not found:', categorySlug);
      return (
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Category not found</p>
            <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Go Home
            </a>
          </div>
        </div>
      );
    }
    
    console.log('✅ Category found:', category.name, 'ID:', category.id);
    
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    console.log('✅ Subcategories found:', subs.length);
    
    const sub = subs.find(s => s.slug === subcategorySlug);
    console.log('✅ Subcategory search result:', sub ? 'Found' : 'Not found', subcategorySlug);
    
    if (!sub) {
      // Check if this might be a 3rd level category that needs to be redirected
      // Look for any subcategory with this slug in the entire category tree
      const allSubcategories = await categoryService.getSubcategories();
      const foundSubcategory = allSubcategories.find(s => s.slug === subcategorySlug);
      
      if (foundSubcategory) {
        // This is a 3rd level category, redirect to the correct 3-level URL
        const parentCategory = await categoryService.getCategoryById(foundSubcategory.parent_id);
        if (parentCategory) {
          const grandParentCategory = await categoryService.getCategoryById(parentCategory.parent_id);
          if (grandParentCategory) {
            // Redirect to the correct 3-level URL
            const redirectUrl = `/categories/${grandParentCategory.slug}/${parentCategory.slug}/${foundSubcategory.slug}`;
            console.log('🔄 Redirecting to:', redirectUrl);
            
            return (
              <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Redirecting...</h1>
                  <p className="text-xl text-gray-600 mb-8">Redirecting to the correct category page</p>
                  <p className="text-sm text-gray-500 mb-4">From: /categories/{categorySlug}/{subcategorySlug}</p>
                  <p className="text-sm text-gray-500 mb-8">To: {redirectUrl}</p>
                  <script dangerouslySetInnerHTML={{
                    __html: `setTimeout(() => { window.location.href = '${redirectUrl}'; }, 1000);`
                  }} />
                  <a href={redirectUrl} 
                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Click here if not redirected automatically
                  </a>
                </div>
              </div>
            );
          }
        }
      }
      
      // If subcategory not found as direct child, return a 404 page
      return (
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Subcategory not found</p>
            <p className="text-sm text-gray-500 mb-8">
              The subcategory "{subcategorySlug}" was not found under "{categorySlug}".
            </p>
            <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Go Home
            </a>
          </div>
        </div>
      );
    }

    // Check if this is a top-level subcategory (no parent_id) or a child subcategory
    const isChildSubcategory = sub.parent_id !== null;
    const parentSubcategory = isChildSubcategory ? subs.find(s => s.id === sub.parent_id) : null;

    const products = await productService.getProductsBySubcategory(sub.id);
    
    // Get children of the current subcategory (3rd level categories)
    const childSubcategories = await categoryService.getSubcategoriesByCategory(sub.id);
    
    // For the sidebar, we want to show the children of the current subcategory
    const topLevelSubcategories = childSubcategories;
    const groupedChildren = {};

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
              <li><Link href={`/categories/${category.slug}`}>{category.name}</Link></li>
              <li>/</li>
              <li className="text-gray-900">{sub.name}</li>
            </ol>
          </nav>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{sub.name}</h1>
          <p className="text-gray-600">Explore our comprehensive range of {sub.name.toLowerCase()} products</p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ExpandableCategories 
                  topLevelSubcategories={topLevelSubcategories}
                  groupedChildren={groupedChildren}
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
                        categorySlug: product.categories?.slug, 
                        subcategorySlug: null, 
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
                        {sub.name}
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
  
  } catch (error) {
    console.error('❌ Error in subcategory page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">500</h1>
          <p className="text-xl text-gray-600 mb-8">Server Error</p>
          <p className="text-sm text-gray-500 mb-8">
            An error occurred while loading the page.
          </p>
          <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Go Home
          </a>
        </div>
      </div>
    );
  }
}


