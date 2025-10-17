// Currency utility functions with real exchange rates
const exchangeRates: Record<string, number> = {
  USD: 1.0,      // Base currency
  TRY: 33.5,     // 1 USD = 33.5 TRY
  EUR: 0.92,     // 1 USD = 0.92 EUR
  GBP: 0.79,     // 1 USD = 0.79 GBP
  CAD: 1.35,     // 1 USD = 1.35 CAD
  AUD: 1.52      // 1 USD = 1.52 AUD
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

export const formatPrice = (amount: number, currency: string = 'USD', fromCurrency: string = 'USD'): string => {
  // Convert amount if currencies are different
  const convertedAmount = fromCurrency !== currency ? convertCurrency(amount, fromCurrency, currency) : amount;
  
  const currencyMap: Record<string, { symbol: string; position: 'before' | 'after' }> = {
    USD: { symbol: '$', position: 'before' },
    TRY: { symbol: '₺', position: 'before' },
    EUR: { symbol: '€', position: 'before' },
    GBP: { symbol: '£', position: 'before' },
    CAD: { symbol: 'C$', position: 'before' },
    AUD: { symbol: 'A$', position: 'before' }
  };

  const config = currencyMap[currency] || currencyMap.USD;
  const formattedAmount = convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (config.position === 'before') {
    return `${config.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${config.symbol}`;
  }
};

