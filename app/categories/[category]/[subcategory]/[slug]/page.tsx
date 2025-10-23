import { ServiceContainer } from '../../../../../lib/di/ServiceContainer';
import { ICategoryService } from '../../../../../lib/factories/interfaces/ICategoryService';
import { IProductService } from '../../../../../lib/factories/interfaces/IProductService';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildProductPath, generateSlug } from '../../../../../utils/slug';
import ProductDetailPage from '../../../../../components/pages/ProductDetailPage';
import { Header } from '../../../../../components/layout/Header';
import { Footer } from '../../../../../components/layout/Footer';
import { ExpandableCategories } from '../../../../../components/ui/ExpandableCategories';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string; slug: string }> }): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug, slug } = await params;
  const categoryService: ICategoryService = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
  const productService: IProductService = ServiceContainer.getInstance().getServiceFactory().createProductService();

  const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) return {};
  
  const subs = await categoryService.getSubcategoriesByCategory(category.id);
  const subcategory = subs.find(s => s.slug === subcategorySlug);
  if (!subcategory) return {};

  // Check if this is a child subcategory
  const childSubcategory = subs.find(s => s.slug === slug && s.parent_id === subcategory.id);
  if (childSubcategory) {
    const title = childSubcategory.meta_title || `${childSubcategory.name} | ${subcategory.name} | ${category.name}`;
    const description = childSubcategory.meta_description || `Browse ${childSubcategory.name} under ${subcategory.name} in ${category.name}.`;
    return { title, description, openGraph: { title, description, type: 'website' } };
  }

  // Check if this is a product
  const products = await productService.getProductsBySubcategory(subcategory.id);
  const normalized = decodeURIComponent(slug).toLowerCase();
  const product = products.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
  
  if (product) {
    const title = product.meta_title || `${product.name} | ${subcategory.name} | ${category.name}`;
    const description = product.meta_description || product.description || `Shop ${product.name} in ${subcategory.name} at ${category.name}.`;
    return { title, description, openGraph: { title, description, type: 'website' } };
  }

  return {};
}

export default async function DynamicSlugPage({ params }: { params: Promise<{ category: string; subcategory: string; slug: string }> }) {
  const { category: categorySlug, subcategory: subcategorySlug, slug } = await params;
  const categoryService: ICategoryService = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
  const productService: IProductService = ServiceContainer.getInstance().getServiceFactory().createProductService();

  // With the new recursive structure, we need to handle the case where
  // the URL might be /categories/face-cream/deep-hydrating-moisturizer
  // but face-cream is actually a subcategory, not a main category
  
  // First, try to find the category by slug
  let category = await categoryService.getCategoryBySlug(categorySlug);
  let subcategory = null;
  let childSubcategory = null;
  
  if (category && category.parent_id === null) {
    // This is a main category, so subcategorySlug should be a subcategory
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    subcategory = subs.find(s => s.slug === subcategorySlug);
    
    if (subcategory) {
      // Look for child subcategory
      const childSubs = await categoryService.getSubcategoriesByCategory(subcategory.id);
      childSubcategory = childSubs.find(s => s.slug === slug);
    }
  } else if (category && category.parent_id !== null) {
    // The "category" is actually a subcategory, so we need to find its parent
    const parentCategory = await categoryService.getCategoryBySlug(category.parent_id.toString());
    if (parentCategory) {
      // Now subcategorySlug is actually the child subcategory
      const subs = await categoryService.getSubcategoriesByCategory(parentCategory.id);
      subcategory = category; // The original category is the subcategory
      childSubcategory = subs.find(s => s.slug === subcategorySlug && s.parent_id === category.id);
    }
  }
  
  if (!category || !subcategory) {
    // If we still can't find the category/subcategory, return a 404 page
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

  // Check if this is a child subcategory
  if (childSubcategory) {
    const products = await productService.getProductsBySubcategory(childSubcategory.id);
    
    // Get all subcategories for the main category to build the sidebar
    const allSubs = await categoryService.getSubcategoriesByCategory(category.id);
    
    // Group subcategories: top-level (no parent) and child subcategories
    const topLevelSubcategories = allSubs.filter(sub => sub.parent_id === null);
    const childSubcategories = allSubs.filter(sub => sub.parent_id !== null);
    
    // Group child subcategories by their parent
    const groupedChildren = childSubcategories.reduce((acc, child) => {
      const parent = allSubs.find(sub => sub.id === child.parent_id);
      if (parent) {
        if (!acc[parent.id]) {
          acc[parent.id] = { parent, children: [] };
        }
        acc[parent.id].children.push(child);
      }
      return acc;
    }, {} as Record<number, { parent: any; children: any[] }>);
    
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
              <li><Link href={`/categories/${category.slug}/${subcategory.slug}`}>{subcategory.name}</Link></li>
              <li>/</li>
              <li className="text-gray-900">{childSubcategory.name}</li>
            </ol>
          </nav>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{childSubcategory.name}</h1>
            <p className="text-gray-600">Explore our comprehensive range of {childSubcategory.name.toLowerCase()} products</p>
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
                          {childSubcategory.name}
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: any) => (
                    <Link 
                      key={product.id} 
                      href={buildProductPath({ 
                        name: product.name, 
                        categorySlug: product.categories?.slug, 
                        subcategorySlug: product.subcategories?.slug, 
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
                          <div className="text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.categories?.name} / {product.subcategories?.name}
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
        </div>
        <Footer />
      </div>
    );
  }

  // Check if this is a product
  const products = await productService.getProductsBySubcategory(subcategory.id);
  const normalized = decodeURIComponent(slug).toLowerCase();
  const product = products.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
  
  if (product) {
    return <ProductDetailPage product={product as any} category={category as any} subcategory={subcategory as any} />;
  }

  // If we reach here, it's neither a child subcategory nor a product
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}
