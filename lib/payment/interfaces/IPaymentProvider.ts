export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerIp: string;
  billingAddress?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  successUrl: string;
  cancelUrl: string;
  description?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentUrl: string;
  amount: number;
  currency: string;
  orderId: string;
  expiresAt: string;
  provider: string;
  providerData?: any;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  orderId: string;
  provider: string;
  providerData?: any;
  updatedAt: string;
}

export interface IPaymentProvider {
  createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse>;
  validateConfig(): Promise<boolean>;
  getProviderName(): string;
  getSupportedCurrencies(): string[];
  getSupportedCountries(): string[];
}
