'use client';

import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLocale } from '../contexts/LocaleProvider';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'en', currency: 'USD' },
  { code: 'TR', name: 'Turkey (Türkiye)', flag: '🇹🇷', language: 'tr', currency: 'TRY' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', language: 'ar', currency: 'SAR' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'de', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'fr', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'es', currency: 'EUR' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
];

interface SitePreferencesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitePreferencesDropdown({ isOpen, onClose }: SitePreferencesDropdownProps) {
  const { updateLocale, getCurrentLocale } = useLocale();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Initialize with current locale
  useEffect(() => {
    if (isOpen) {
      const current = getCurrentLocale();
      setSelectedCountry(current.country);
      setSelectedLanguage(current.locale);
      setSelectedCurrency(current.currency);
    }
  }, [isOpen, getCurrentLocale]);

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(countryCode);
      setSelectedLanguage(country.language);
      setSelectedCurrency(country.currency);
    }
  };

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  // Handle currency change
  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
  };

  // Save preferences
  const handleSave = () => {
    // Only redirect if country changed, not for language/currency only changes
    const current = getCurrentLocale();
    const shouldRedirect = selectedCountry !== current.country;
    updateLocale(selectedLanguage, selectedCountry, selectedCurrency, shouldRedirect);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
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
