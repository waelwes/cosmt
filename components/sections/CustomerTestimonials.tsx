'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, NY',
    rating: 5,
    comment: 'Amazing quality products! The foundation I bought matches my skin perfectly and lasts all day. Highly recommend!',
    avatar: '/api/placeholder/60/60',
    product: 'Premium Foundation'
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    location: 'Los Angeles, CA',
    rating: 5,
    comment: 'Fast shipping and excellent customer service. The skincare routine I got has transformed my skin completely.',
    avatar: '/api/placeholder/60/60',
    product: 'Anti-Aging Serum'
  },
  {
    id: 3,
    name: 'Lisa Chen',
    location: 'Chicago, IL',
    rating: 5,
    comment: 'Love the variety of brands available. Found my new favorite lipstick shade and the quality is outstanding.',
    avatar: '/api/placeholder/60/60',
    product: 'Matte Lipstick'
  },
  {
    id: 4,
    name: 'Emily Davis',
    location: 'Miami, FL',
    rating: 5,
    comment: 'The hair care products are incredible! My hair has never looked better. Will definitely order again.',
    avatar: '/api/placeholder/60/60',
    product: 'Hair Care Set'
  }
];

export const CustomerTestimonials: React.FC = () => {
  const { isRTL } = useRTL();

  return (
    <div className="py-4 bg-white">
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'آراء عملائنا' : 'What Our Customers Say'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشفي تجارب عملائنا مع منتجاتنا وخدماتنا'
              : 'Discover what our customers say about our products and services'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-green-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 text-sm leading-relaxed pl-4">
                  "{testimonial.comment}"
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-xs text-green-600 font-medium">{testimonial.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isRTL ? 'انضمي إلى آلاف العملاء السعداء' : 'Join Thousands of Happy Customers'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isRTL 
                ? 'اكتشفي لماذا يثق بنا آلاف العملاء في جميع أنحاء العالم'
                : 'Discover why thousands of customers worldwide trust us for their beauty needs'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">{isRTL ? 'عميل سعيد' : 'Happy Customers'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">4.9/5</div>
                <div className="text-sm text-gray-600">{isRTL ? 'تقييم العملاء' : 'Customer Rating'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">{isRTL ? 'منتج' : 'Products'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">{isRTL ? 'دعم العملاء' : 'Customer Support'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
