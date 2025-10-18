'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface Language {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
];

interface Translations {
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  search: string;
  filter: string;
  sort: string;
  refresh: string;
  export: string;
  import: string;
  
  // Navigation
  dashboard: string;
  products: string;
  orders: string;
  customers: string;
  analytics: string;
  marketing: string;
  content: string;
  settings: string;
  support: string;
  apps: string;
  
  // Categories
  skincare: string;
  bodyCare: string;
  hairCare: string;
  makeup: string;
  fragrance: string;
  mensGrooming: string;
  supplements: string;
  toolsDevices: string;
  naturalOrganic: string;
  momBabyCare: string;
  
  // Product sections
  bestSellers: string;
  newArrivals: string;
  addToCart: string;
  
  // Common UI
  allCategories: string;
  sale: string;
}

const translations: Record<string, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    analytics: 'Analytics',
    marketing: 'Marketing',
    content: 'Content',
    settings: 'Settings',
    support: 'Support',
    apps: 'Apps',
    
    // Categories
    skincare: 'Skincare',
    bodyCare: 'Body Care',
    hairCare: 'Hair Care',
    makeup: 'Makeup',
    fragrance: 'Fragrance',
    mensGrooming: 'Men\'s Grooming',
    supplements: 'Supplements',
    toolsDevices: 'Tools & Devices',
    naturalOrganic: 'Natural & Organic',
    momBabyCare: 'Mom & Baby Care',
    
    // Product sections
    bestSellers: 'Best Sellers',
    newArrivals: 'New Arrivals',
    addToCart: 'Add to Cart',
    
    // Common UI
    allCategories: 'All Categories',
    sale: 'Sale',
  },
  
  ar: {
    // Common
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    refresh: 'تحديث',
    export: 'تصدير',
    import: 'استيراد',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    orders: 'الطلبات',
    customers: 'العملاء',
    analytics: 'التحليلات',
    marketing: 'التسويق',
    content: 'المحتوى',
    settings: 'الإعدادات',
    support: 'الدعم',
    apps: 'التطبيقات',
    
    // Categories
    skincare: 'العناية بالبشرة',
    bodyCare: 'العناية بالجسم',
    hairCare: 'العناية بالشعر',
    makeup: 'المكياج',
    fragrance: 'العطور',
    mensGrooming: 'عناية الرجال',
    supplements: 'المكملات الغذائية',
    toolsDevices: 'الأدوات والأجهزة',
    naturalOrganic: 'طبيعي وعضوي',
    momBabyCare: 'عناية الأم والطفل',
    
    // Product sections
    bestSellers: 'الأكثر مبيعاً',
    newArrivals: 'وصل حديثاً',
    addToCart: 'أضف للسلة',
    
    // Common UI
    allCategories: 'جميع الفئات',
    sale: 'تخفيضات',
  }
};

interface UnifiedLanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  languages: Language[];
  t: Translations;
  direction: 'ltr' | 'rtl';
  // RTL specific
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  isArabic: boolean;
  isEnglish: boolean;
}

export const UnifiedLanguageContext = createContext<UnifiedLanguageContextType | undefined>(undefined);

export function UnifiedLanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    console.log('UnifiedLanguageProvider: Loading saved language:', savedLanguage);
    setCurrentLanguage(savedLanguage);
  }, []);

  // Save to localStorage when language changes
  useEffect(() => {
    if (mounted) {
      console.log('UnifiedLanguageProvider: Saving language to localStorage:', currentLanguage);
      localStorage.setItem('preferred-language', currentLanguage);
    }
  }, [currentLanguage, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const t = translations[currentLanguage] || translations.en;
  
  const language = currentLanguage as Language;
  const direction = currentLang.direction;
  const isRTL = direction === 'rtl';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <UnifiedLanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      languages,
      t,
      direction,
      language,
      setLanguage,
      isRTL,
      isArabic,
      isEnglish,
    }}>
      {children}
    </UnifiedLanguageContext.Provider>
  );
}

export function useUnifiedLanguage() {
  const context = useContext(UnifiedLanguageContext);
  if (context === undefined) {
    throw new Error('useUnifiedLanguage must be used within a UnifiedLanguageProvider');
  }
  return context;
}

// Backward compatibility hooks
export function useLanguage() {
  const context = useContext(UnifiedLanguageContext);
  if (context === undefined) {
    // Return default values if context is not available
    return {
      currentLanguage: 'en',
      setCurrentLanguage: () => {},
      languages: [
        { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
      ],
      t: translations.en,
      direction: 'ltr' as const
    };
  }
  const { currentLanguage, setCurrentLanguage, languages, t, direction } = context;
  return { currentLanguage, setCurrentLanguage, languages, t, direction };
}

export function useRTL() {
  const context = useContext(UnifiedLanguageContext);
  if (context === undefined) {
    // Return default values if context is not available
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      direction: 'ltr' as Direction,
      isRTL: false,
      isArabic: false,
      isEnglish: true
    };
  }
  const { language, setLanguage, direction, isRTL, isArabic, isEnglish } = context;
  return { language, setLanguage, direction, isRTL, isArabic, isEnglish };
}
