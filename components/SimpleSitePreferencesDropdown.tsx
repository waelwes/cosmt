'use client';

import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/UnifiedLanguageContext';
import { useLocale } from '@/contexts/LocaleProvider';

interface LocaleContextType {
  locale: string;
  country: string;
  currency: string;
  updateLocale: (locale: string, country: string, currency: string) => void;
}

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'en', currency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', language: 'en', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'en', currency: 'GBP' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', language: 'en', currency: 'AUD' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'de', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'fr', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'es', currency: 'EUR' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', language: 'it', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', language: 'nl', currency: 'EUR' },
  { code: 'TR', name: 'Turkey (Türkiye)', flag: '🇹🇷', language: 'tr', currency: 'TRY' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', language: 'ar', currency: 'SAR' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', language: 'ar', currency: 'AED' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', language: 'ja', currency: 'JPY' },
  { code: 'CN', name: 'China', flag: '🇨🇳', language: 'zh', currency: 'CNY' },
  { code: 'IN', name: 'India', flag: '🇮🇳', language: 'hi', currency: 'INR' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', language: 'pt', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', language: 'es', currency: 'MXN' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', language: 'ru', currency: 'RUB' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', language: 'ko', currency: 'KRW' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', language: 'de', currency: 'CHF' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

interface SimpleSitePreferencesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleSitePreferencesDropdown({ isOpen, onClose }: SimpleSitePreferencesDropdownProps) {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const localeContext = useLocale();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Sync with locale context
  useEffect(() => {
    if (localeContext && (localeContext as LocaleContextType).locale) {
      setSelectedLanguage((localeContext as LocaleContextType).locale || currentLanguage);
      setSelectedCountry((localeContext as LocaleContextType).country || 'US');
      setSelectedCurrency((localeContext as LocaleContextType).currency || 'USD');
    }
  }, [localeContext, currentLanguage]);

  // Handle country change - Auto-set language/currency for major countries, but allow free changes after
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    
    // Auto-set language and currency for major countries
    const countryDefaults: Record<string, { language: string; currency: string }> = {
      'TR': { language: 'tr', currency: 'TRY' },
      'US': { language: 'en', currency: 'USD' },
      'SA': { language: 'ar', currency: 'SAR' },
      'DE': { language: 'de', currency: 'EUR' },
      'FR': { language: 'fr', currency: 'EUR' },
      'ES': { language: 'es', currency: 'EUR' },
      'IT': { language: 'it', currency: 'EUR' },
      'NL': { language: 'nl', currency: 'EUR' },
      'JP': { language: 'ja', currency: 'JPY' },
      'CN': { language: 'zh', currency: 'CNY' },
      'IN': { language: 'hi', currency: 'INR' },
      'BR': { language: 'pt', currency: 'BRL' },
      'RU': { language: 'ru', currency: 'RUB' },
      'KR': { language: 'ko', currency: 'KRW' },
    };
    
    const defaults = countryDefaults[countryCode];
    if (defaults) {
      setSelectedLanguage(defaults.language);
      setSelectedCurrency(defaults.currency);
    }
    // For other countries, don't auto-change - let user choose freely
  };

  // Handle language change - NO automatic changes to country/currency
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Don't automatically change country or currency - let user choose freely
  };

  // Handle currency change - NO automatic changes
  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Don't automatically change anything - let user choose freely
  };

  // Save preferences
  const handleSave = () => {
    // Update both language context and locale provider
    setCurrentLanguage(selectedLanguage as 'en' | 'ar' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'ja' | 'zh' | 'hi' | 'pt' | 'ru' | 'ko');
    if (localeContext && (localeContext as LocaleContextType).updateLocale) {
      // Only redirect if country changed, not for language/currency only changes
      const shouldRedirect = selectedCountry !== (localeContext as LocaleContextType).country;
      (localeContext as LocaleContextType).updateLocale(selectedLanguage, selectedCountry, selectedCurrency, shouldRedirect);
    }
    // Close dropdown after saving
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div 
      className="fixed right-4 top-20 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[9999]"
      data-dropdown="site-preferences"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Site Preferences</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Country Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country
          </label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
