'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserLocale, savePreferences, isFirstVisit, SUPPORTED_LOCALES } from '../utils/detectLocale';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [country, setCountry] = useState('US');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // Initialize locale on mount
  useEffect(() => {
    const initializeLocale = async () => {
      try {
        setIsLoading(true);
        
        // Check if user has manually selected a locale preference
        const savedLocale = localStorage.getItem('cosmt-manual-locale');
        const savedCountry = localStorage.getItem('cosmt-manual-country');
        const savedCurrency = localStorage.getItem('cosmt-manual-currency');
        
        if (savedLocale && savedCountry && savedCurrency) {
          // User has made a manual selection, respect it
          console.log('Using saved manual locale preference:', savedLocale);
          setLocale(savedLocale);
          setCountry(savedCountry);
          setCurrency(savedCurrency);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
        
        // Only auto-detect if no manual preference exists
        const userLocale = await getUserLocale();
        
        // Update state
        setLocale(userLocale.locale);
        setCountry(userLocale.country);
        setCurrency(userLocale.currency);
        
        // Check if current path matches the detected locale
        const expectedPath = userLocale.path;
        const currentPath = pathname;
        
        // If we're on the root path and have a detected locale, redirect
        if (currentPath === '/' && expectedPath !== '/') {
          router.replace(expectedPath);
        }
        // If we're on a localized path that doesn't match our locale, redirect
        else if (currentPath.startsWith('/') && currentPath !== '/' && !currentPath.startsWith(expectedPath)) {
          const newPath = currentPath.replace(/^\/[a-z]{2}/, expectedPath);
          router.replace(newPath);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize locale:', error);
        // Fallback to English instead of Turkish
        setLocale('en');
        setCountry('US');
        setCurrency('USD');
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocale();
  }, [router, pathname]);

  // Update locale with optional redirect
  const updateLocale = async (newLocale, newCountry, newCurrency, shouldRedirect = true) => {
    try {
      // Update state
      setLocale(newLocale);
      setCountry(newCountry);
      setCurrency(newCurrency);
      
      // Save preferences (both in localStorage and cookies)
      savePreferences({
        locale: newLocale,
        country: newCountry,
        currency: newCurrency,
      });
      
      // Save manual selection to prevent auto-detection override
      localStorage.setItem('cosmt-manual-locale', newLocale);
      localStorage.setItem('cosmt-manual-country', newCountry);
      localStorage.setItem('cosmt-manual-currency', newCurrency);
      
      console.log('Manual locale selection saved:', { newLocale, newCountry, newCurrency });
      
      // Only redirect if shouldRedirect is true
      if (shouldRedirect) {
        // Get new path
        const newPath = SUPPORTED_LOCALES[newLocale]?.path || '/en';
        
        // Update current path to new locale
        const currentPath = pathname;
        let targetPath;
        
        if (currentPath === '/') {
          targetPath = newPath;
        } else {
          // Replace current locale in path with new locale
          targetPath = currentPath.replace(/^\/[a-z]{2}/, newPath);
        }
        
        // Navigate to new path
        router.push(targetPath);
      }
      
    } catch (error) {
      console.error('Failed to update locale:', error);
    }
  };

  // Get current locale info
  const getCurrentLocale = () => {
    return {
      locale,
      country,
      currency,
      path: SUPPORTED_LOCALES[locale]?.path || '/en',
      name: SUPPORTED_LOCALES[locale]?.name || 'English',
      flag: SUPPORTED_LOCALES[locale]?.flag || '🇺🇸',
    };
  };

  // Check if current path matches locale
  const isPathMatchingLocale = () => {
    const currentPath = pathname;
    const expectedPath = SUPPORTED_LOCALES[locale]?.path || '/en';
    
    if (currentPath === '/' && expectedPath === '/en') return true;
    return currentPath.startsWith(expectedPath);
  };

  const value = {
    // State
    locale,
    country,
    currency,
    isLoading,
    isInitialized,
    
    // Actions
    updateLocale,
    getCurrentLocale,
    isPathMatchingLocale,
    
    // Utils
    isFirstVisit: isFirstVisit(),
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
