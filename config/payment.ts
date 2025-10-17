// Payment Configuration for Turkish Payment Gateways
export const paymentConfig = {
  // iyzico Configuration
  iyzico: {
    sandbox: {
      apiKey: process.env.IYZICO_API_KEY || 'sandbox_api_key',
      secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox_secret_key',
      baseUrl: 'https://sandbox-api.iyzipay.com',
      merchantId: process.env.IYZICO_MERCHANT_ID || 'sandbox_merchant_id',
      environment: 'sandbox' as const,
    },
    production: {
      apiKey: process.env.IYZICO_API_KEY || '',
      secretKey: process.env.IYZICO_SECRET_KEY || '',
      baseUrl: 'https://api.iyzipay.com',
      merchantId: process.env.IYZICO_MERCHANT_ID || '',
      environment: 'production' as const,
    }
  },
  
  // Environment settings
  environment: process.env.PAYMENT_ENVIRONMENT || 'sandbox',
  
  // Payment URLs
  urls: {
    callback: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:3000/api/payment/callback',
    return: process.env.PAYMENT_RETURN_URL || 'http://localhost:3000/checkout/success',
    cancel: process.env.PAYMENT_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
  },
  
  // Currency settings
  currency: 'TRY' as const,
  
  // Installment options
  installments: [1, 2, 3, 6, 9, 12],
  
  // Payment methods
  paymentMethods: ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'],
};

// Get current configuration based on environment
export function getPaymentConfig() {
  const env = paymentConfig.environment;
  return {
    ...paymentConfig.iyzico[env],
    urls: paymentConfig.urls,
    currency: paymentConfig.currency,
    installments: paymentConfig.installments,
    paymentMethods: paymentConfig.paymentMethods,
  };
}
