import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMainCategories } from '../../data/categories';
import { PageLayout } from '../../components/layout/PageLayout';

export const metadata: Metadata = {
  title: 'All Categories - Beauty & Cosmetics Products | COSMT',
  description: 'Browse all beauty and cosmetics categories including skincare, hair care, makeup, fragrance, and more. Find your perfect products.',
  keywords: 'beauty categories, cosmetics, skincare, hair care, makeup, fragrance, body care, mens grooming, supplements',
  openGraph: {
    title: 'All Categories - Beauty & Cosmetics Products | COSMT',
    description: 'Browse all beauty and cosmetics categories including skincare, hair care, makeup, and fragrance.',
    images: ['/images/categories-og.jpg'],
  },
};

export default function CategoriesPage() {
  const mainCategories = getMainCategories();

  return (
    <PageLayout>
      {/* Page Header */}
      <div className="bg-gray-50 py-16">
        <div className="cosmt-container text-center">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-2xl mx-auto">
            Discover our complete range of beauty and cosmetics products organized by category. 
            Find exactly what you're looking for with our professional-grade selection.
          </p>
        </div>
      </div>

      <div className="cosmt-container py-16">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden mb-4 border border-gray-200 group-hover:border-green-600 transition-colors duration-200">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
              </div>
              <div className="text-center">
                <h3 className="text-cosmt-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 mb-2">
                  {category.name}
                </h3>
                <p className="text-cosmt-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-cosmt-xs text-gray-500">
                  <span className="group-hover:text-green-600 transition-colors duration-200">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-20 text-center">
          <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-cosmt-base text-gray-600 mb-8 max-w-2xl mx-auto">
            Use our advanced search to find specific products, or browse our bestsellers and new arrivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Search Products
            </Link>
            <Link
              href="/bestsellers"
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              View Bestsellers
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
