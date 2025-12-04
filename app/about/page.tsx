
import { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '../../components/layout/PageLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About COSMT - Professional Beauty & Cosmetics Brand',
  description: 'Learn about COSMT\'s mission to provide professional-grade beauty and cosmetics products. Discover our story, values, and commitment to quality.',
  keywords: 'about COSMT, beauty brand, cosmetics company, professional beauty, quality products, brand story',
  openGraph: {
    title: 'About COSMT - Professional Beauty & Cosmetics Brand',
    description: 'Learn about COSMT\'s mission to provide professional-grade beauty and cosmetics products.',
    images: ['/images/about-og.jpg'],
  },
};

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27ddf263e05d?w=1200&h=400&fit=crop&crop=center"
          alt="About COSMT"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-cosmt-4xl font-bold mb-4">About COSMT</h1>
            <p className="text-cosmt-lg max-w-2xl mx-auto">
              Professional Beauty & Cosmetics for Every Skin Type
            </p>
          </div>
        </div>
      </div>

      <div className="cosmt-container py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-cosmt-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-cosmt-lg text-gray-600 leading-relaxed mb-6">
            COSMT was founded with a simple yet powerful mission: to make professional-grade beauty
            and cosmetics accessible to everyone. We believe that everyone deserves access to high-quality
            products that enhance their natural beauty and boost their confidence.
          </p>
          <p className="text-cosmt-lg text-gray-600 leading-relaxed">
            Our carefully curated selection features products from trusted brands like AVEDA and DAVINES,
            ensuring that every item meets our strict standards for quality, effectiveness, and safety.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">Quality First</h3>
            <p className="text-gray-600">
              Every product is carefully selected for its quality, effectiveness, and safety standards.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">Customer Care</h3>
            <p className="text-gray-600">
              We&apos;re committed to providing exceptional customer service and support every step of the way.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We stay ahead of beauty trends and continuously expand our product range.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-4">
            Ready to Discover Your Perfect Products?
          </h2>
          <p className="text-cosmt-lg text-gray-600 mb-6">
            Browse our extensive collection of professional beauty and cosmetics products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/categories"
              className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Shop All Categories
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
