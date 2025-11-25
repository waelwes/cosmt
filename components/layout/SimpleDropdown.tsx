'use client';

import React, { useState, useEffect } from 'react';

interface SimpleDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'en', currency: 'USD' },
  { code: 'TR', name: 'Turkey (Türkiye)', flag: '🇹🇷', language: 'tr', currency: 'TRY' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'en', currency: 'GBP' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', language: 'en', currency: 'CAD' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'de', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'fr', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'es', currency: 'EUR' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', language: 'ar', currency: 'SAR' },
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
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
];

export default function SimpleDropdown({ isOpen, onClose }: SimpleDropdownProps) {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    if (isOpen) {
      // Load saved preferences from localStorage
      const savedCountry = localStorage.getItem('preferred-country') || 'US';
      const savedLanguage = localStorage.getItem('preferred-language') || 'en';
      const savedCurrency = localStorage.getItem('preferred-currency') || 'USD';
      
      setSelectedCountry(savedCountry);
      setSelectedLanguage(savedLanguage);
      setSelectedCurrency(savedCurrency);
    }
  }, [isOpen]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    
    // Find the selected country
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      // Auto-update language and currency based on country
      setSelectedLanguage(country.language);
      setSelectedCurrency(country.currency);
    }
  };

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem('preferred-country', selectedCountry);
    localStorage.setItem('preferred-language', selectedLanguage);
    localStorage.setItem('preferred-currency', selectedCurrency);
    
    // Dispatch events to update contexts without page reload
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: selectedLanguage } 
    }));
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: selectedCurrency } 
    }));
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-[9999]">
        <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Site Preferences
        </h3>
        
        <div className="space-y-4">
          {/* Country */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">
              Select Country
              <span className="text-xs text-gray-400 ml-1">(auto-updates language & currency)</span>
            </h4>
            <select 
              value={selectedCountry} 
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">
              Select Language
            </h4>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">
              Select Currency
            </h4>
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white rounded"
            style={{ backgroundColor: '#003d38' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
