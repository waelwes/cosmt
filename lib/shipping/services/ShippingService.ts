import { IShippingProvider } from '../interfaces/IShippingProvider';
import { ShippingOrder, ShippingRate, ShipmentResponse, TrackingResponse } from '../interfaces/IShippingProvider';
import { ShippingFactory } from '../factories/ShippingFactory';
import { ShippingConfig } from '../interfaces/IShippingConfig';
import EmailService from '../../services/EmailService';

export class ShippingService {
  private provider: IShippingProvider;

  constructor(providerName: string, config: ShippingConfig) {
    this.provider = ShippingFactory.create(providerName, config);
  }

  /**
   * Calculate shipping rates for an order
   */
  async getRates(order: ShippingOrder): Promise<ShippingRate[]> {
    try {
      return await this.provider.calculateRate(order);
    } catch (error) {
      console.error('ShippingService: Error calculating rates', error);
      throw error;
    }
  }

  /**
   * Create a shipment
   */
  async createShipment(order: ShippingOrder): Promise<ShipmentResponse> {
    try {
      const result = await this.provider.createShipment(order);
      
      // Send tracking email to customer
      await this.sendTrackingEmail(order, result);
      
      return result;
    } catch (error) {
      console.error('ShippingService: Error creating shipment', error);
      throw error;
    }
  }

  /**
   * Track a shipment
   */
  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      return await this.provider.trackShipment(trackingNumber);
    } catch (error) {
      console.error('ShippingService: Error tracking shipment', error);
      throw error;
    }
  }

  /**
   * Validate provider configuration
   */
  async validateProvider(): Promise<boolean> {
    try {
      return await this.provider.validateConfig();
    } catch (error) {
      console.error('ShippingService: Error validating provider', error);
      return false;
    }
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return this.provider.getProviderName();
  }

  /**
   * Get supported providers
   */
  static getSupportedProviders(): string[] {
    return ShippingFactory.getSupportedProviders();
  }

  /**
   * Check if provider is supported
   */
  static isProviderSupported(providerName: string): boolean {
    return ShippingFactory.isProviderSupported(providerName);
  }

  /**
   * Send tracking email to customer
   */
  private async sendTrackingEmail(order: ShippingOrder, shipment: ShipmentResponse): Promise<void> {
    try {
      const emailService = EmailService.getInstance();
      
      const trackingData = {
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        dhlTrackingNumber: shipment.trackingNumber,
        estimatedDelivery: shipment.estimatedDelivery || 'Not available',
        orderItems: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: order.shippingAddress.name,
          address1: order.shippingAddress.address1,
          address2: order.shippingAddress.address2,
          city: order.shippingAddress.city,
          postalCode: order.shippingAddress.postalCode,
          country: order.shippingAddress.country
        }
      };

      await emailService.sendDHLTrackingNotification(trackingData);
      console.log(`Tracking email sent to ${order.customerEmail} for order ${order.orderNumber}`);
    } catch (error) {
      console.error('Error sending tracking email:', error);
      // Don't throw error to avoid breaking the shipment creation process
    }
  }
}
