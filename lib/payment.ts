// Turkish Payment Gateway Integration using official iyzipay SDK
import * as Iyzipay from 'iyzipay';

export interface PaymentConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  items: PaymentItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      city: string;
      country: string;
      address: string;
      zipCode: string;
    };
  };
  billingAddress: {
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  shippingAddress: {
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  callbackUrl: string;
  returnUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  error?: string;
  message?: string;
}

// iyzico Payment Gateway using official SDK
export class IyzicoPayment {
  private iyzipay: any;

  constructor(config: PaymentConfig) {
    this.iyzipay = new Iyzipay({
      apiKey: config.apiKey,
      secretKey: config.secretKey,
      uri: config.baseUrl
    });
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: request.orderId,
        price: request.amount.toFixed(2),
        paidPrice: request.amount.toFixed(2),
        currency: request.currency,
        installment: 1,
        basketId: request.orderId,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: request.callbackUrl,
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
          id: request.customer.email,
          name: request.customer.firstName,
          surname: request.customer.lastName,
          gsmNumber: request.customer.phone,
          email: request.customer.email,
          identityNumber: '11111111111', // This should be collected from user
          lastLoginDate: new Date().toISOString(),
          registrationDate: new Date().toISOString(),
          registrationAddress: request.customer.address.address,
          ip: '127.0.0.1', // This should be the actual user IP
          city: request.customer.address.city,
          country: request.customer.address.country,
          zipCode: request.customer.address.zipCode,
        },
        shippingAddress: {
          contactName: `${request.customer.firstName} ${request.customer.lastName}`,
          city: request.shippingAddress.city,
          country: request.shippingAddress.country,
          address: request.shippingAddress.address,
          zipCode: request.shippingAddress.zipCode,
        },
        billingAddress: {
          contactName: `${request.customer.firstName} ${request.customer.lastName}`,
          city: request.billingAddress.city,
          country: request.billingAddress.country,
          address: request.billingAddress.address,
          zipCode: request.billingAddress.zipCode,
        },
        basketItems: request.items.map((item, index) => ({
          id: item.id,
          name: item.name,
          category1: item.category,
          category2: 'General',
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: (item.price * item.quantity).toFixed(2),
        })),
      };

      // Create payment using official iyzipay SDK
      const response = await new Promise((resolve, reject) => {
        this.iyzipay.threedsPayment.create(paymentRequest, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (response.status === 'success') {
        return {
          success: true,
          paymentId: response.paymentId,
          redirectUrl: response.paymentPageUrl,
          message: 'Payment initialized successfully'
        };
      } else {
        return {
          success: false,
          error: response.errorMessage || 'Payment initialization failed',
          message: 'Unable to process payment at this time'
        };
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        error: 'Payment initialization failed',
        message: 'Unable to process payment at this time'
      };
    }
  }

  async verifyPayment(paymentId: string, token: string): Promise<PaymentResponse> {
    try {
      const verifyRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: paymentId,
        paymentId: paymentId,
        conversationData: token,
      };

      const response = await new Promise((resolve, reject) => {
        this.iyzipay.threedsPayment.retrieve(verifyRequest, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (response.status === 'success') {
        return {
          success: true,
          paymentId: response.paymentId,
          message: 'Payment verified successfully'
        };
      } else {
        return {
          success: false,
          error: response.errorMessage || 'Payment verification failed',
          message: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        success: false,
        error: 'Payment verification failed',
        message: 'Unable to verify payment'
      };
    }
  }
}

// PayU Turkey Payment Gateway
export class PayUTurkeyPayment {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentData = {
        merchant: this.config.merchantId,
        orderRef: request.orderId,
        orderDate: new Date().toISOString(),
        orderPName: request.items.map(item => item.name).join(', '),
        orderPCode: request.items.map(item => item.id).join(','),
        orderPInfo: request.items.map(item => `${item.name} x${item.quantity}`).join(', '),
        orderPGroup: 'General',
        orderPPrice: request.items.map(item => item.price * item.quantity),
        orderPQuantity: request.items.map(item => item.quantity),
        orderPAmount: request.amount,
        orderCurrency: request.currency,
        orderShipping: 0,
        orderDiscount: 0,
        orderTotal: request.amount,
        orderVAT: 0,
        orderInstallment: 1,
        orderHash: this.generatePayUHash(request),
        buyerName: `${request.customer.firstName} ${request.customer.lastName}`,
        buyerEmail: request.customer.email,
        buyerPhone: request.customer.phone,
        buyerAddress: request.customer.address.address,
        buyerCity: request.customer.address.city,
        buyerCountry: request.customer.address.country,
        buyerZip: request.customer.address.zipCode,
        billName: `${request.customer.firstName} ${request.customer.lastName}`,
        billEmail: request.customer.email,
        billPhone: request.customer.phone,
        billAddress: request.billingAddress.address,
        billCity: request.billingAddress.city,
        billCountry: request.billingAddress.country,
        billZip: request.billingAddress.zipCode,
        shipName: `${request.customer.firstName} ${request.customer.lastName}`,
        shipEmail: request.customer.email,
        shipPhone: request.customer.phone,
        shipAddress: request.shippingAddress.address,
        shipCity: request.shippingAddress.city,
        shipCountry: request.shippingAddress.country,
        shipZip: request.shippingAddress.zipCode,
        testOrder: this.config.environment === 'sandbox',
        returnUrl: request.returnUrl,
        notifyUrl: request.callbackUrl,
      };

      // Simulate PayU API call
      const response = await this.simulatePayUPayment(paymentData);

      return {
        success: true,
        paymentId: response.paymentId,
        redirectUrl: response.paymentUrl,
        message: 'Payment initialized successfully'
      };
    } catch (error) {
      console.error('PayU payment creation failed:', error);
      return {
        success: false,
        error: 'Payment initialization failed',
        message: 'Unable to process payment at this time'
      };
    }
  }

  private generatePayUHash(request: PaymentRequest): string {
    // In a real implementation, you would generate a proper hash
    // using the secret key and request data
    return `payu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulatePayUPayment(data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      paymentId: `payu_${Date.now()}`,
      paymentUrl: `${this.config.baseUrl}/payment?ref=${data.orderRef}`,
      status: 'success'
    };
  }
}

// Payment Factory
export class PaymentFactory {
  static createPaymentGateway(provider: 'iyzico' | 'payu', config: PaymentConfig) {
    switch (provider) {
      case 'iyzico':
        return new IyzicoPayment(config);
      case 'payu':
        return new PayUTurkeyPayment(config);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}

// Default configurations
export const PAYMENT_CONFIGS = {
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
  payu: {
    sandbox: {
      apiKey: process.env.PAYU_API_KEY || 'sandbox_api_key',
      secretKey: process.env.PAYU_SECRET_KEY || 'sandbox_secret_key',
      baseUrl: 'https://sandbox.payu.com.tr',
      merchantId: process.env.PAYU_MERCHANT_ID || 'sandbox_merchant_id',
      environment: 'sandbox' as const,
    },
    production: {
      apiKey: process.env.PAYU_API_KEY || '',
      secretKey: process.env.PAYU_SECRET_KEY || '',
      baseUrl: 'https://secure.payu.com.tr',
      merchantId: process.env.PAYU_MERCHANT_ID || '',
      environment: 'production' as const,
    }
  }
};
