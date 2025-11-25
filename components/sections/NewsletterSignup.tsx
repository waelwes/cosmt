'use client';

import React, { useState } from 'react';
import { Mail, Gift, Shield, CheckCircle } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

export const NewsletterSignup: React.FC = () => {
  const { isRTL } = useRTL();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // Here you would typically send the email to your backend
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: isRTL ? 'عروض حصرية' : 'Exclusive Offers',
      description: isRTL ? 'احصلي على خصومات خاصة وعروض لا تتوفر للجميع' : 'Get special discounts and offers not available to everyone'
    },
    {
      icon: Mail,
      title: isRTL ? 'أحدث المنتجات' : 'Latest Products',
      description: isRTL ? 'كوني أول من يعرف عن المنتجات الجديدة' : 'Be the first to know about new products'
    },
    {
      icon: Shield,
      title: isRTL ? 'نصائح الخبراء' : 'Expert Tips',
      description: isRTL ? 'احصلي على نصائح التجميل من خبراء الجمال' : 'Get beauty tips from our expert team'
    }
  ];

  if (isSubscribed) {
    return (
      <div className="py-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="cosmt-container">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {isRTL ? 'تم الاشتراك بنجاح!' : 'Successfully Subscribed!'}
            </h2>
            <p className="text-green-100 text-lg">
              {isRTL 
                ? 'شكراً لك! ستتلقين رسائلنا الإخبارية قريباً'
                : 'Thank you! You\'ll receive our newsletter soon'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 bg-gradient-to-r from-green-600 to-green-700">
      <div className="cosmt-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`${isRTL ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isRTL ? 'ابق على اطلاع' : 'Stay in the Loop'}
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              {isRTL 
                ? 'اشتركي في نشرتنا الإخبارية واحصلي على أحدث العروض ونصائح الجمال'
                : 'Subscribe to our newsletter and get the latest offers and beauty tips'
              }
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <benefit.icon className="w-6 h-6 text-green-200 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-green-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Newsletter Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
              </h3>
              <p className="text-gray-600">
                {isRTL 
                  ? 'احصلي على 10% خصم على طلبك الأول'
                  : 'Get 10% off your first order'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'عنوان البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#003d38' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
              >
                {isRTL ? 'اشترك واحصل على الخصم' : 'Subscribe & Get Discount'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                {isRTL 
                  ? 'بالاشتراك، فإنك توافق على سياسة الخصوصية وشروط الخدمة'
                  : 'By subscribing, you agree to our Privacy Policy and Terms of Service'
                }
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
