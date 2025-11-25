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
import { ProductCard } from '../../../../../components/ui/ProductCard';
import { } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string; segments: string[] }> }): Promise<Metadata> {
  const { locale, category: categorySlug, segments } = await params;
  const categoryService: ICategoryService = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
  const productService: IProductService = ServiceContainer.getInstance().getServiceFactory().createProductService();

  const category = await categoryService.getCategoryBySlug(categorySlug);
  if (!category) return {};
  
  // Handle 2 segments: [slug]
  if (segments.length === 1) {
    const slug = segments[0];
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    const subcategory = subs.find(s => s.slug === slug);
    
    if (subcategory) {
      const title = subcategory.meta_title || `${subcategory.name} | ${category.name}`;
      const description = subcategory.meta_description || `Browse ${subcategory.name} in ${category.name}.`;
      return { title, description, openGraph: { title, description, type: 'website' } };
    }

    const allProducts = await productService.getProductsByCategories([category.id, ...subs.map(s => s.id)]);
    const normalized = decodeURIComponent(slug).toLowerCase();
    const product = allProducts.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
    
    if (product) {
      const title = product.meta_title || `${product.name} | ${category.name}`;
      const description = product.meta_description || product.description || `Shop ${product.name} in ${category.name}.`;
      return { title, description, openGraph: { title, description, type: 'website' } };
    }
  }
  
  // Handle 3 segments: [subcategory, slug]
  if (segments.length === 2) {
    const [subcategorySlug, productSlug] = segments;
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    const subcategory = subs.find(s => s.slug === subcategorySlug);
    
    if (subcategory) {
      const products = await productService.getProductsBySubcategory(subcategory.id);
      const normalized = decodeURIComponent(productSlug).toLowerCase();
      const product = products.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
      
      if (product) {
        const title = product.meta_title || `${product.name} | ${subcategory.name} | ${category.name}`;
        const description = product.meta_description || product.description || `Shop ${product.name} in ${subcategory.name} at ${category.name}.`;
        return { title, description, openGraph: { title, description, type: 'website' } };
      }
    }
  }

  return {};
}

export default async function CategorySegmentsPage({ params }: { params: Promise<{ locale: string; category: string; segments: string[] }> }) {
  const { locale, category: categorySlug, segments } = await params;
  console.log('🔍 CategorySegmentsPage hit:', { locale, category: categorySlug, segments });
  const categoryService: ICategoryService = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
  const productService: IProductService = ServiceContainer.getInstance().getServiceFactory().createProductService();

  // Find the category
  const category = await categoryService.getCategoryBySlug(categorySlug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Category not found</p>
          <Link href={`/${locale}`} className="text-white px-6 py-3 rounded-lg transition-colors hover:bg-[#002a25]" style={{ backgroundColor: '#003d38' }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle 2 segments: [slug] - could be subcategory or product
  if (segments.length === 1) {
    const slug = segments[0];
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    
    // Check if slug is a subcategory
    const subcategory = subs.find(s => s.slug === slug);
    
    if (subcategory) {
      // This is a subcategory page
      const products = await productService.getProductsBySubcategory(subcategory.id);
      const allSubs = await categoryService.getSubcategoriesByCategory(category.id);
      const topLevelSubcategories = allSubs.filter(sub => sub.parent_id === null);
      const childSubcategories = allSubs.filter(sub => sub.parent_id !== null);
      
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
                <li><Link href={`/${locale}`}>Home</Link></li>
                <li>/</li>
                <li><Link href={`/${locale}/categories`}>Categories</Link></li>
                <li>/</li>
                <li><Link href={`/${locale}/categories/${category.slug}`}>{category.name}</Link></li>
                <li>/</li>
                <li className="text-gray-900">{subcategory.name}</li>
              </ol>
            </nav>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{subcategory.name}</h1>
              <p className="text-gray-600">Explore our comprehensive range of {subcategory.name.toLowerCase()} products</p>
            </div>

            <div className="flex gap-8">
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-4">
                  <div className="bg-white p-6">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <img src="/Category.svg" alt="Category" className="w-5 h-5 mr-2" />
                        Categories
                      </h3>
                      <ExpandableCategories 
                        topLevelSubcategories={topLevelSubcategories}
                        groupedChildren={groupedChildren}
                        categorySlug={category.slug}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
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
                    <p className="text-gray-500 text-lg">No products found in this subcategory.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    // Check if slug is a product
    const allCategoryIds = [category.id, ...subs.map(s => s.id)];
    const allProducts = await productService.getProductsByCategories(allCategoryIds);
    const normalized = decodeURIComponent(slug).toLowerCase();
    const product = allProducts.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
    
    if (product) {
      const productSubcategory = product.subcategories || product.child_categories;
      return <ProductDetailPage product={product as any} category={category as any} subcategory={productSubcategory as any} />;
    }
  }

  // Handle 3 segments: [subcategory, slug] - should be a product
  if (segments.length === 2) {
    const [subcategorySlug, productSlug] = segments;
    const subs = await categoryService.getSubcategoriesByCategory(category.id);
    const subcategory = subs.find(s => s.slug === subcategorySlug);
    
    if (subcategory) {
      const products = await productService.getProductsBySubcategory(subcategory.id);
      const normalized = decodeURIComponent(productSlug).toLowerCase();
      const product = products.find(p => (p.slug || generateSlug(p.name || '')).toLowerCase() === normalized);
      
      if (product) {
        return <ProductDetailPage product={product as any} category={category as any} subcategory={subcategory as any} />;
      }
    }
  }

  // If we reach here, it's not found
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fbfbfb'}}>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link href={`/${locale}`} className="text-white px-6 py-3 rounded-lg transition-colors hover:bg-[#002a25]" style={{ backgroundColor: '#003d38' }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
