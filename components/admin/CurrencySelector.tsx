'use client';

import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ChevronDown, Globe } from 'lucide-react';

export function CurrencySelector() {
  const { currentCurrency, setCurrency, supportedCurrencies, getCurrencyConfig } = useCurrency();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentConfig = getCurrencyConfig();

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
              {supportedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrency(currency.code);
                    setIsOpen(false);
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
                    {currency.country}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">
                All prices will be converted to your selected currency
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
