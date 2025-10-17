'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', rate: '1.00' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', country: 'Turkey', rate: '33.50' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', rate: '0.92' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', rate: '0.79' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada', rate: '1.35' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', rate: '1.52' }
];

export function SimpleCurrencySelector() {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [isOpen, setIsOpen] = useState(false);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currentCurrency);
  }, [currentCurrency]);

  const currentConfig = currencies.find(c => c.code === currentCurrency) || currencies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{currentConfig.symbol} {currentConfig.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg  border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Select Currency
              </div>
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrentCurrency(currency.code);
                    setIsOpen(false);
                    // Trigger a page refresh to update all prices
                    window.location.reload();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentCurrency === currency.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency.symbol}</span>
                    <div>
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-xs text-gray-500">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currency.country} • 1 USD = {currency.rate} {currency.code}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">
                All prices will be converted using real exchange rates
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
