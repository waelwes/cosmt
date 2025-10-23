// Currency configuration for multi-country support
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  exchangeRate: number; // Rate relative to USD
  decimalPlaces: number;
  position: 'before' | 'after';
}

export const currencies: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    exchangeRate: 1.0,
    decimalPlaces: 2,
    position: 'before'
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    country: 'Turkey',
    exchangeRate: 33.5, // Approximate rate
    decimalPlaces: 2,
    position: 'before'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    exchangeRate: 0.92,
    decimalPlaces: 2,
    position: 'before'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    exchangeRate: 0.79,
    decimalPlaces: 2,
    position: 'before'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    country: 'Canada',
    exchangeRate: 1.35,
    decimalPlaces: 2,
    position: 'before'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    exchangeRate: 1.52,
    decimalPlaces: 2,
    position: 'before'
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    exchangeRate: 3.75,
    decimalPlaces: 2,
    position: 'before'
  }
};

export const defaultCurrency = 'USD';

// Helper functions
export const formatCurrency = (amount: number, currencyCode: string = defaultCurrency): string => {
  const currency = currencies[currencyCode] || currencies[defaultCurrency];
  const formattedAmount = amount.toFixed(currency.decimalPlaces);
  
  if (currency.position === 'before') {
    return `${currency.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currency.symbol}`;
  }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = currencies[fromCurrency]?.exchangeRate || 1;
  const toRate = currencies[toCurrency]?.exchangeRate || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

export const getCurrencyByCountry = (country: string): CurrencyConfig => {
  const countryCurrencyMap: Record<string, string> = {
    'Turkey': 'TRY',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR',
    'Spain': 'EUR',
    'Netherlands': 'EUR',
    'Saudi Arabia': 'SAR'
  };
  
  const currencyCode = countryCurrencyMap[country] || defaultCurrency;
  return currencies[currencyCode];
};

// Supported countries for shipping
export const supportedCountries = [
  { name: 'United States', code: 'US', currency: 'USD' },
  { name: 'Turkey', code: 'TR', currency: 'TRY' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
  { name: 'Canada', code: 'CA', currency: 'CAD' },
  { name: 'Australia', code: 'AU', currency: 'AUD' },
  { name: 'Germany', code: 'DE', currency: 'EUR' },
  { name: 'France', code: 'FR', currency: 'EUR' },
  { name: 'Italy', code: 'IT', currency: 'EUR' },
  { name: 'Spain', code: 'ES', currency: 'EUR' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR' },
  { name: 'Saudi Arabia', code: 'SA', currency: 'SAR' }
];
