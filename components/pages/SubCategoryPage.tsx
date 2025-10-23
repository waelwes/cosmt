'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Product } from '../../lib/types/Product';
import { useProductsByCategory } from '../../hooks/useStorefrontData';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { IProductService } from '../../lib/factories/interfaces/IProductService';
import { ICategoryService } from '../../lib/factories/interfaces/ICategoryService';
import { buildProductPath } from '../../utils/slug';
import { PageLayout } from '../layout/PageLayout';
import { LogoLoading } from '../ui/LogoLoading';
import { CategoryFilterWrapper } from '../ui/CategoryFilterWrapper';
import { CategoryFilterMobileWrapper } from '../ui/CategoryFilterMobileWrapper';
import { Menu } from 'lucide-react';

interface SubCategoryPageProps {
  categorySlug: string;
  subCategorySlug: string;
  title: string;
  description: string;
}

export const SubCategoryPage: React.FC<SubCategoryPageProps> = ({
  categorySlug,
  subCategorySlug,
  title,
  description,
}) => {
  const [subCategories, setSubCategories] = useState<Array<{ id: string; name: string; slug: string; description: string; image: string; productCount: number }>>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🔍 SubCategoryPage: Fetching data for category:', categorySlug, 'subcategory:', subCategorySlug);
        
        // Get category service to fetch actual category name
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();

        // Get category by slug to get the actual name
        console.log('🔍 SubCategoryPage: Getting category by slug:', categorySlug);
        const category = await categoryService.getCategoryBySlug(categorySlug);
        if (category) {
          console.log('✅ SubCategoryPage: Category found:', category.name);
          setCategoryName(category.name);
        } else {
          console.log('❌ SubCategoryPage: Category not found for slug:', categorySlug);
          setCategoryName(categorySlug); // Fallback to slug
        }

        // Get subcategories for this category
        console.log('🔍 SubCategoryPage: Getting subcategories for category ID:', category?.id || 0);
        const subcategories = await categoryService.getSubcategoriesByCategory(category?.id || 0);
        console.log('🔍 SubCategoryPage: Found subcategories:', subcategories.length);
        
        setSubCategories(subcategories.map(sub => ({
          id: sub.id.toString(),
          name: sub.name,
          slug: sub.slug,
          description: sub.description || '',
          image: sub.image || '',
          productCount: 0 // We can calculate this later if needed
        })));

        // Get featured products from the resolved subcategory using Abstract Factory
        const activeSub = subcategories.find((s) => s.slug === subCategorySlug);
        console.log('🔍 SubCategoryPage: Getting products for subcategory:', activeSub?.id, activeSub?.slug);
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();

        let products: Product[] = [];
        if (activeSub?.id) {
          products = await productService.getProductsBySubcategory(activeSub.id);
        } else if (category?.id) {
          // Fallback: fetch by category if subcategory not found
          products = await productService.getProductsByCategory(category.id);
        }
        console.log('🔍 SubCategoryPage: Found products:', products.length);
        setFeaturedProducts(products.slice(0, 6));
      } catch (error: unknown) {
        console.error('❌ SubCategoryPage: Error fetching data:', {
          categorySlug,
          subCategorySlug,
          error
        });
        setSubCategories([]);
        setFeaturedProducts([]);
        setCategoryName(categorySlug); // Fallback to slug if error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subCategorySlug]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryName || 'Hair Care', href: `/categories/${categorySlug}` },
    { label: title },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="cosmt-container py-8">
          <div className="flex items-center justify-center h-64">
            <LogoLoading 
              size="lg" 
              className="text-center"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="cosmt-container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-3xl">{description}</p>
        </div>

        <div className="flex gap-8">
          {/* Category Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <CategoryFilterWrapper currentCategory={categorySlug} />
          </div>

          {/* Mobile Category Filter */}
          <CategoryFilterMobileWrapper
            currentCategory={categorySlug}
            isOpen={showCategoryFilter}
            onClose={() => setShowCategoryFilter(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Category Filter Button */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setShowCategoryFilter(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm">Browse Categories</span>
              </button>
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-cosmt-xl font-semibold text-gray-900 mb-4">
                Explore {title}
              </h2>
              <p className="text-cosmt-base text-gray-600">
                Use the category filter on the left to explore all related products and subcategories. 
                Find exactly what you're looking for with our organized product system.
              </p>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-cosmt-2xl font-bold text-gray-900">Featured Products</h2>
                  <Link href={`/categories/${categorySlug}/${subCategorySlug}`}>
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-green-600 text-white text-cosmt-xs px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="absolute top-3 right-3 bg-gray-800 text-white text-cosmt-xs px-2 py-1 rounded">
                            BEST SELLER
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-cosmt-base font-semibold text-gray-900 mb-1 line-clamp-2">
                          <Link href={buildProductPath({ name: product.name, categorySlug: product.categories?.slug, subcategorySlug: product.subcategories?.slug, productSlug: product.slug, id: product.id })} className="hover:text-green-600 transition-colors duration-200">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-cosmt-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                            {product.original_price && (
                              <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : product.original_price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <h2 className="text-cosmt-xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-cosmt-base text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find specific products, or browse our complete category selection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Search Products
                </Link>
                <Link
                  href="/categories"
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
