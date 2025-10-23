import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildProductPath } from '@/utils/slug';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categories | Cosmat',
  description: 'Browse all product categories.',
  openGraph: {
    title: 'Categories | Cosmat',
    description: 'Browse all product categories.',
    type: 'website'
  }
};

export default async function CategoriesIndexPage() {
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
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900">Categories</li>
          </ol>
        </nav>
        
         {/* Header Card */}
         <div className="mb-8">
           <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
             <div className="flex items-center justify-between w-full">
               <div className="flex items-center space-x-2">
                 <div className="text-2xl font-semibold text-gray-900">
                   All Products
                 </div>
               </div>
               
               <div className="text-sm text-gray-600">
                 <span className="font-medium">{allProducts.length}</span> products found
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
        
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {categories.map((category: any) => (
                    <Link 
                      key={category.id} 
                      href={`/categories/${category.slug}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200"
                    >
                      <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 mb-1">
                        {category.name}
                      </h4>
                      {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {category.subcategories.length} subcategories
                        </p>
                      )}
                    </Link>
                  ))}
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

                  {/* Product Type */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Product Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Shampoo</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Conditioner</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Treatment</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Styling</span>
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
                  <div className="text-gray-400 text-sm">No Image</div>
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


