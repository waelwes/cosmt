import { IShippingProvider } from '../interfaces/IShippingProvider';
import { ShippingConfig, DHLConfig } from '../interfaces/IShippingConfig';
import { DHLProvider } from '../providers/DHLProvider';
import { YurticiProvider } from '../providers/YurticiProvider';
import { PTTProvider } from '../providers/PTTProvider';

export class ShippingFactory {
  /**
   * Create a shipping provider instance based on the provider name and configuration
   */
  static create(providerName: string, config: ShippingConfig): IShippingProvider {
    switch (providerName.toLowerCase()) {
      case 'dhl':
        return new DHLProvider(config as DHLConfig);
      case 'yurtici':
      case 'yurtici kargo':
        return new YurticiProvider(config);
      case 'ptt':
      case 'ptt kargo':
        return new PTTProvider(config);
      
      // Future providers can be added here
      // case 'fedex':
      //   return new FedExProvider(config as FedExConfig);
      // case 'aramex':
      //   return new AramexProvider(config as AramexConfig);
      
      default:
        throw new Error(`Unsupported shipping provider: ${providerName}`);
    }
  }

  /**
   * Get list of supported shipping providers
   */
  static getSupportedProviders(): string[] {
    return ['dhl', 'yurtici', 'ptt'];
  }

  /**
   * Check if a provider is supported
   */
  static isProviderSupported(providerName: string): boolean {
    return this.getSupportedProviders().includes(providerName.toLowerCase());
  }
}
