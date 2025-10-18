'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface RTLContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  isArabic: boolean;
  isEnglish: boolean;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

interface RTLProviderProps {
  children: ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  // Default values - will be overridden by LanguageProvider
  const value: RTLContextType = {
    language: 'en',
    direction: 'ltr',
    setLanguage: () => {},
    isRTL: false,
    isArabic: false,
    isEnglish: true,
  };

  return (
    <RTLContext.Provider value={value}>
      {children}
    </RTLContext.Provider>
  );
}

export function useRTL() {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
}

// Component to sync RTL context with Language context
export function RTLContextSync({ 
  language, 
  direction, 
  setLanguage 
}: { 
  language: Language; 
  direction: Direction; 
  setLanguage: (lang: Language) => void; 
}) {
  const value: RTLContextType = {
    language,
    direction,
    setLanguage,
    isRTL: direction === 'rtl',
    isArabic: language === 'ar',
    isEnglish: language === 'en',
  };

  return (
    <RTLContext.Provider value={value}>
      {null}
    </RTLContext.Provider>
  );
}
