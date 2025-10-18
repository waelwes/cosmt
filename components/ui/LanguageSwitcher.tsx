'use client';

import React from 'react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
] as const;

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useRTL();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 
          hover:bg-gray-50 transition-colors duration-200
          ${isRTL ? 'space-x-reverse' : ''}
        `}
        aria-label="Select language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`
            absolute z-20 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200
            ${isRTL ? 'left-0' : 'right-0'}
          `}>
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50
                    transition-colors duration-200
                    ${language === lang.code ? 'bg-gray-100' : ''}
                    ${isRTL ? 'space-x-reverse' : ''}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <div className="w-2 h-2 bg-cosmt-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
