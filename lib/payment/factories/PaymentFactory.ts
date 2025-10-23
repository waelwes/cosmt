import { IPaymentProvider } from '../interfaces/IPaymentProvider';
import { PaymentConfig, PayTRConfig, VakifBankConfig, KuveytTurkConfig } from '../interfaces/IPaymentConfig';
import { PayTRProvider } from '../providers/PayTRProvider';
import { VakifBankProvider } from '../providers/VakifBankProvider';
import { KuveytTurkProvider } from '../providers/KuveytTurkProvider';

export class PaymentFactory {
  /**
   * Create a payment provider instance based on the provider name and configuration
   */
  static create(providerName: string, config: PaymentConfig): IPaymentProvider {
    switch (providerName.toLowerCase()) {
      case 'paytr':
        return new PayTRProvider(config as PayTRConfig);
      case 'vakifbank':
      case 'vakıfbank':
        return new VakifBankProvider(config as VakifBankConfig);
      case 'kuveytturk':
      case 'kuveyt türk':
        return new KuveytTurkProvider(config as KuveytTurkConfig);
      
      // Future providers can be added here
      // case 'stripe':
      //   return new StripeProvider(config as StripeConfig);
      // case 'paypal':
      //   return new PayPalProvider(config as PayPalConfig);
      
      default:
        throw new Error(`Unsupported payment provider: ${providerName}`);
    }
  }

  /**
   * Get list of supported payment providers
   */
  static getSupportedProviders(): string[] {
    return ['paytr', 'vakifbank', 'kuveytturk'];
  }

  /**
   * Check if a provider is supported
   */
  static isProviderSupported(providerName: string): boolean {
    return this.getSupportedProviders().includes(providerName.toLowerCase());
  }
}
