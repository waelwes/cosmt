'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { MultiLanguageLogo } from '../ui/MultiLanguageLogo';

const footerLinks = {
  shop: [
    // Shop links cleared - ready for new structure
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Track Your Order', href: '/track' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  connect: [
    { name: 'Beauty Blog', href: '/blog' },
    { name: 'Beauty Tips', href: '/tips' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Community', href: '/community' },
    { name: 'Influencer Program', href: '/influencers' },
  ],
};

export const Footer: React.FC = () => {
  const { isRTL, language, isArabic } = useRTL();

  const getTranslation = (text: string) => {
    const { language } = useRTL();
    
    if (isArabic) {
      const arabicTranslations: { [key: string]: string } = {
        'Contact Us': 'اتصل بنا',
        'Shipping Info': 'معلومات الشحن',
        'Returns & Exchanges': 'الإرجاع والاستبدال',
        'Size Guide': 'دليل المقاسات',
        'FAQ': 'الأسئلة الشائعة',
        'Track Your Order': 'تتبع طلبك',
        'About Us': 'من نحن',
        'Careers': 'الوظائف',
        'Press': 'الصحافة',
        'Sustainability': 'الاستدامة',
        'Privacy Policy': 'سياسة الخصوصية',
        'Terms of Service': 'شروط الخدمة',
        'Beauty Blog': 'مدونة الجمال',
        'Beauty Tips': 'نصائح الجمال',
        'Tutorials': 'الدروس',
        'Reviews': 'المراجعات',
        'Community': 'المجتمع',
        'Influencer Program': 'برنامج المؤثرين'
      };
      return arabicTranslations[text] || text;
    }
    
    if (language === 'tr') {
      const turkishTranslations: { [key: string]: string } = {
        'Contact Us': 'İletişim',
        'Shipping Info': 'Kargo Bilgileri',
        'Returns & Exchanges': 'İade ve Değişim',
        'Size Guide': 'Beden Rehberi',
        'FAQ': 'Sık Sorulan Sorular',
        'Track Your Order': 'Siparişinizi Takip Edin',
        'About Us': 'Hakkımızda',
        'Careers': 'Kariyer',
        'Press': 'Basın',
        'Sustainability': 'Sürdürülebilirlik',
        'Privacy Policy': 'Gizlilik Politikası',
        'Terms of Service': 'Hizmet Şartları',
        'Beauty Blog': 'Güzellik Blogu',
        'Beauty Tips': 'Güzellik İpuçları',
        'Tutorials': 'Eğitimler',
        'Reviews': 'Değerlendirmeler',
        'Community': 'Topluluk',
        'Influencer Program': 'Etkileyici Programı'
      };
      return turkishTranslations[text] || text;
    }
    
    return text; // English (default)
  };


  return (
    <footer className="cosmt-footer" dir="ltr">

      {/* Main Footer Content */}
      <div className="py-8">
        <div className="cosmt-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
            {/* Logo Column */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <MultiLanguageLogo
                  size="lg"
                  className="h-8 w-auto mb-4"
                />
                <p className="text-cosmt-sm text-gray-400 leading-relaxed">
                  {isArabic 
                    ? 'وجهتك الموثوقة لمنتجات الجمال المتميزة ومستحضرات التجميل عالية الجودة.'
                    : language === 'tr'
                    ? 'Premium güzellik ürünleri ve profesyonel kalitede kozmetikler için güvenilir destinasyonunuz.'
                    : 'Your trusted destination for premium beauty products and professional-grade cosmetics.'
                  }
                </p>
              </div>

              {/* Follow Us */}
              <div className="mt-6">
                <h5 className="text-cosmt-sm font-semibold mb-4">
                  {isArabic ? 'تابعنا' : 
                   language === 'tr' ? 'Bizi Takip Edin' : 
                   'Follow Us'}
                </h5>
                <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Phone className="w-4 h-4" style={{ color: '#00833F' }} />
                  <span className="text-cosmt-sm text-gray-300">1-800-BEAUTY</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Mail className="w-4 h-4" style={{ color: '#00833F' }} />
                  <span className="text-cosmt-sm text-gray-300">info@cosmt.com</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <MapPin className="w-4 h-4" style={{ color: '#00833F' }} />
                    <span className="text-cosmt-sm text-gray-300">
                      {isArabic ? 'نيويورك، نيويورك' : 
                       language === 'tr' ? 'New York, NY' : 
                       'New York, NY'}
                    </span>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div>
                <h4 className="text-cosmt-lg font-semibold mb-6">
                  {isArabic ? 'تسوق' : 
                   language === 'tr' ? 'Alışveriş' : 
                   'Shop'}
                </h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {getTranslation(link.name)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
                <h4 className="text-cosmt-lg font-semibold mb-6">
                  {isArabic ? 'الدعم' : 
                   language === 'tr' ? 'Destek' : 
                   'Support'}
                </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {getTranslation(link.name)}
                    </a>
                  </li>
                ))}
              </ul>

            </div>

            {/* Company Column */}
            <div>
                <h4 className="text-cosmt-lg font-semibold mb-6">
                  {isArabic ? 'الشركة' : 
                   language === 'tr' ? 'Şirket' : 
                   'Company'}
                </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {getTranslation(link.name)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div>
                <h4 className="text-cosmt-lg font-semibold mb-6">
                  {isArabic ? 'تواصل معنا' : 
                   language === 'tr' ? 'Bağlantı' : 
                   'Connect'}
                </h4>
              <ul className="space-y-3">
                {footerLinks.connect.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {getTranslation(link.name)}
                    </a>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="cosmt-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left flex items-center space-x-4">
              <Image
                src="http://localhost:3000/images/logos/COSMT.png"
                alt="COSMT Logo"
                width={60}
                height={20}
                className="h-4 w-auto opacity-80"
                unoptimized={true}
              />
              <p className="text-gray-400 text-cosmt-sm">
                © 2024 COSMT. All rights reserved. | Made with ❤️ for beauty lovers
              </p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <img
                src="/api/placeholder/120/40"
                alt="Payment methods"
                className="h-8 opacity-60"
              />
              <div className="flex items-center space-x-2 text-cosmt-sm text-gray-400">
                <span>Secure</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
