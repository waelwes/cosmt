'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations } from '../lib/translations';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
];

export function useLanguageSwitch() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Get current language info
  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];

  // Initialize language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language') || 'en';
      console.log('useLanguageSwitch: Loading saved language:', savedLanguage);
      setCurrentLanguage(savedLanguage);
      setMounted(true);
    }
  }, []);

  // Update DOM when language changes - SINGLE SOURCE OF TRUTH
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      console.log('useLanguageSwitch: Updating DOM for language:', currentLanguage, 'direction:', currentLang.direction);
      
      // THIS is the single place that touches the DOM
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = currentLang.direction;
      document.body.dir = currentLang.direction;
      
      // Use classList for better performance and reliability
      document.body.classList.remove('ltr', 'rtl');
      document.body.classList.add(currentLang.direction);
      
      // Save to localStorage
      localStorage.setItem('preferred-language', currentLanguage);
      
      console.log('useLanguageSwitch: DOM updated successfully', {
        htmlDir: document.documentElement.dir,
        bodyDir: document.body.dir,
        bodyClass: document.body.className,
        currentLanguage: currentLanguage
      });
    }
  }, [currentLanguage, currentLang.direction, mounted]);

  // Language change function
  const changeLanguage = useCallback((languageCode: string) => {
    console.log('useLanguageSwitch: Changing language to:', languageCode);
    setCurrentLanguage(languageCode);
  }, []);

  return {
    currentLanguage,
    direction: currentLang.direction,
    languages: LANGUAGES,
    changeLanguage,
    mounted,
    t: translations[currentLanguage as keyof typeof translations] || translations.en
  };
}
