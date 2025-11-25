'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

const beautyTips = [
  {
    id: 1,
    title: '10 Essential Skincare Tips for Glowing Skin',
    excerpt: 'Discover the secrets to achieving radiant, healthy skin with these expert-approved tips.',
    image: '/api/placeholder/400/250',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Skincare'
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Foundation Shade',
    excerpt: 'Learn the professional techniques for finding your ideal foundation match.',
    image: '/api/placeholder/400/250',
    author: 'Maria Rodriguez',
    date: '2024-01-12',
    readTime: '3 min read',
    category: 'Makeup'
  },
  {
    id: 3,
    title: 'Hair Care Routine for Different Hair Types',
    excerpt: 'Customize your hair care routine based on your specific hair type and needs.',
    image: '/api/placeholder/400/250',
    author: 'Lisa Chen',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Hair Care'
  }
];

export const BeautyTips: React.FC = () => {
  const { isRTL } = useRTL();

  return (
    <div className="py-4 bg-white">
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'نصائح الجمال' : 'Beauty Tips & Tutorials'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'تعلمي أحدث تقنيات التجميل والعناية من خبراء الجمال'
              : 'Learn the latest beauty techniques and care tips from our experts'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beautyTips.map((tip) => (
            <article
              key={tip.id}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <div className="relative aspect-video">
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#003d38' }}>
                    {tip.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 mb-3 line-clamp-2" style={{ color: 'inherit' }}>
                  <style dangerouslySetInnerHTML={{__html: `
                    .group:hover h3 { color: #003d38 !important; }
                  `}} />
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {tip.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span className="mr-4">{tip.author}</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{tip.date}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{tip.readTime}</span>
                  <Link
                    href={`/blog/${tip.id}`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                  >
                    {isRTL ? 'اقرأ المزيد' : 'Read More'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
            style={{ backgroundColor: '#003d38' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
          >
            {isRTL ? 'عرض جميع المقالات' : 'View All Articles'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
