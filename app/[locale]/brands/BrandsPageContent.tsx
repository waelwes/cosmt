'use client';

import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowDownUp, ListFilter } from 'lucide-react';
import { useState, useEffect } from 'react';
import FourDotLoader from '@/components/ui/FourDotLoader';

interface BrandsPageContentProps {
  locale: string;
  content: any;
}

export default function BrandsPageContent({ locale, content }: BrandsPageContentProps) {
  const [uniqueBrands, setUniqueBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();

        const rawProducts = await productService.getProducts();

        // Extract unique brands with their product counts and categories
        const brandMap = new Map();

        rawProducts.forEach((product: any) => {
          if (product.brand) {
            if (!brandMap.has(product.brand)) {
              brandMap.set(product.brand, {
                name: product.brand,
                productCount: 0,
                categories: new Set(),
                image: product.brand_image || product.image,
                description: product.brand_description || ''
              });
            }
            const brand = brandMap.get(product.brand);
            brand.productCount += 1;
            if (product.category_name) {
              brand.categories.add(product.category_name);
            }
          }
        });

        // Convert to array and sort alphabetically
        const brandsArray = Array.from(brandMap.values())
          .map(brand => ({
            ...brand,
            categories: Array.from(brand.categories)
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setUniqueBrands(brandsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error loading brands data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      <Header />
      <div className="cosmt-container py-4 sm:py-6 lg:py-10">
        <nav className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <ol className="flex space-x-1 sm:space-x-2">
            <li><Link href={`/${locale}`}>{content.breadcrumbHome}</Link></li>
            <li>{'>'}</li>
            <li className="text-gray-900">{content.breadcrumbBrands}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Filters Card */}
              <div className="bg-white p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200 flex items-center">
                      <ListFilter className="w-5 h-5 mr-2 text-gray-900" />
                      {content.filters}
                    </h3>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{content.category}</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {categories.map((category: any) => (
                            <label key={category.id} className="flex items-center">
                              <input type="checkbox" style={{ accentColor: '#003d38' }} />
                              <span className="ml-2 text-sm text-gray-600">{category.name}</span>
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
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <ArrowDownUp className="w-4 h-4 text-gray-600" />
            </button>

            {/* Header Card */}
            <div className="mb-6">
              <div className="bg-white p-4 lg:p-6 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-base lg:text-lg font-semibold text-gray-900">
                      {content.allBrands}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{uniqueBrands.length}</span> {content.brandsFound}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <ArrowDownUp className="w-4 h-4 text-gray-600 hidden sm:block" />
                    <select className="flex-1 sm:flex-none !border-0 !shadow-none px-3 py-2 text-sm focus:ring-0 focus:bg-white outline-none focus:outline-none">
                      <option value="popular">{content.popular}</option>
                      <option value="alphabetical">{content.alphabetical}</option>
                      <option value="featured">{content.featured}</option>
                      <option value="new">{content.newBrands}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-300 p-6 animate-pulse">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : uniqueBrands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {uniqueBrands.map((brand: any) => (
                  <div key={brand.name} className="bg-white border border-gray-300 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Brand Logo/Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {brand.image ? (
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Brand Name */}
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {brand.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                        </p>
                      </div>

                      {/* View Products Button */}
                      <Link
                        href={`/${locale}/categories?brand=${encodeURIComponent(brand.name)}`}
                        className="w-full text-center py-2 px-4 text-xs font-medium transition-colors duration-200 rounded"
                        style={{
                          backgroundColor: '#003d38',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                      >
                        {content.viewProducts}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center">
                <p className="text-gray-500 text-lg">No brands found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
