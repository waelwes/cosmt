'use client';

import { useState } from 'react';
import { Globe, Settings } from 'lucide-react';
import { useLanguageSwitch } from '../../hooks/useLanguageSwitch';
import SimpleDropdown from '../layout/SimpleDropdown';

export default function LanguageSwitcher() {
  const { currentLanguage, direction, languages, changeLanguage, mounted } = useLanguageSwitch();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <Globe className="w-5 h-5 text-gray-500" />
        <span className="ml-2 text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="mr-2">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <span className="ml-2 text-xs bg-cosmt-primary text-white px-2 py-1 rounded">
          {direction.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                  currentLanguage === language.code 
                    ? 'bg-cosmt-primary text-white' 
                    : 'text-gray-700 dark:text-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                  {language.direction.toUpperCase()}
                </span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-white">✓</span>
                )}
              </button>
            ))}
            
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
            
            {/* Site Preferences Button */}
            <button
              onClick={() => {
                setShowPreferences(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-100"
            >
              <Settings className="w-4 h-4 mr-3" />
              <span className="font-medium">Site Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* Site Preferences Dropdown */}
      <SimpleDropdown
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
}
