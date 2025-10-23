'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  currency: string;
  flag: string;
}

interface CountryRegionSelectorProps {
  selectedCountry?: Country | null;
  onCountryChange: (country: Country) => void;
  className?: string;
  placeholder?: string;
}

const countries: Country[] = [
  { name: 'United States', code: 'US', currency: 'USD', flag: '🇺🇸' },
  { name: 'Turkey (Türkiye)', code: 'TR', currency: 'TRY', flag: '🇹🇷' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', currency: 'AUD', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', currency: 'EUR', flag: '🇩🇪' },
  { name: 'France', code: 'FR', currency: 'EUR', flag: '🇫🇷' },
  { name: 'Italy', code: 'IT', currency: 'EUR', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', currency: 'EUR', flag: '🇪🇸' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR', flag: '🇳🇱' },
];

export default function CountryRegionSelector({
  selectedCountry,
  onCountryChange,
  className = '',
  placeholder = 'Select Country / Region'
}: CountryRegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <div className="flex items-center">
          {selectedCountry ? (
            <>
              <span className="text-lg mr-2">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {placeholder}
              </span>
            </>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-64 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            {/* Country list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                      selectedCountry?.code === country.code
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="text-lg mr-3">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {country.code} • {country.currency}
                      </div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
