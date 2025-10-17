'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { currencies, defaultCurrency, formatCurrency, convertCurrency, getCurrencyByCountry, CurrencyConfig } from '../config/currency';

interface CurrencyContextType {
  currentCurrency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (amount: number, currency?: string) => string;
  convertPrice: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getCurrencyConfig: (currency?: string) => CurrencyConfig;
  supportedCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<string>(defaultCurrency);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currentCurrency);
  }, [currentCurrency]);

  const setCurrency = (currency: string) => {
    if (currencies[currency]) {
      setCurrentCurrency(currency);
    }
  };

  const formatPrice = (amount: number, currency?: string) => {
    return formatCurrency(amount, currency || currentCurrency);
  };

  const convertPrice = (amount: number, fromCurrency: string, toCurrency: string) => {
    return convertCurrency(amount, fromCurrency, toCurrency);
  };

  const getCurrencyConfig = (currency?: string) => {
    return currencies[currency || currentCurrency] || currencies[defaultCurrency];
  };

  const supportedCurrencies = Object.values(currencies);

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    formatPrice,
    convertPrice,
    getCurrencyConfig,
    supportedCurrencies
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
