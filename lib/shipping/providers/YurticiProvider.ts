import { IShippingProvider } from '../interfaces/IShippingProvider';
import { ShippingConfig } from '../interfaces/IShippingConfig';
import { ShippingOrder, ShippingRate, ShipmentResponse, TrackingResponse } from '../interfaces/IShippingProvider';

export class YurticiProvider implements IShippingProvider {
  private config: ShippingConfig;
  private apiUrl: string;
  private apiKey: string;
  private customerId: string;

  constructor(config: ShippingConfig) {
    this.config = config;
    this.apiUrl = config.apiEndpoint || 'https://api.yurticikargo.com.tr';
    this.apiKey = config.apiKey || '';
    this.customerId = config.customerId || '';
  }

  async calculateRate(order: ShippingOrder): Promise<ShippingRate[]> {
    try {
      // Yurtiçi Kargo rate calculation
      const rates: ShippingRate[] = [];

      // Calculate based on weight and destination
      const weight = this.calculateTotalWeight(order);
      const destination = order.to.countryCode;
      
      // Yurtiçi Kargo service types
      const services = [
        {
          name: 'Yurtiçi Kargo Standart',
          code: 'YURTICI_STANDART',
          basePrice: this.calculateBasePrice(weight, destination),
          estimatedDays: this.getEstimatedDays(destination, 'standard')
        },
        {
          name: 'Yurtiçi Kargo Express',
          code: 'YURTICI_EXPRESS',
          basePrice: this.calculateBasePrice(weight, destination) * 1.5,
          estimatedDays: this.getEstimatedDays(destination, 'express')
        },
        {
          name: 'Yurtiçi Kargo Ekonomik',
          code: 'YURTICI_ECONOMIC',
          basePrice: this.calculateBasePrice(weight, destination) * 0.8,
          estimatedDays: this.getEstimatedDays(destination, 'economic')
        }
      ];

      for (const service of services) {
        rates.push({
          service: service.name,
          serviceCode: service.code,
          price: service.basePrice,
          currency: order.currency || 'TRY',
          estimatedDays: service.estimatedDays,
          description: `${service.name} - ${service.estimatedDays} iş günü`,
          features: this.getServiceFeatures(service.code)
        });
      }

      return rates;
    } catch (error) {
      console.error('Yurtiçi Kargo rate calculation error:', error);
      throw new Error('Failed to calculate Yurtiçi Kargo rates');
    }
  }

  async createShipment(order: ShippingOrder): Promise<ShipmentResponse> {
    try {
      // Yurtiçi Kargo shipment creation
      const shipmentData = {
        customerId: this.customerId,
        orderNumber: order.orderId,
        sender: {
          name: order.from.name,
          company: order.from.company,
          address: `${order.from.address1}, ${order.from.city}`,
          city: order.from.city,
          postalCode: order.from.postalCode,
          country: order.from.countryCode,
          phone: order.from.phone,
          email: order.from.email
        },
        receiver: {
          name: order.to.name,
          company: order.to.company,
          address: `${order.to.address1}, ${order.to.city}`,
          city: order.to.city,
          postalCode: order.to.postalCode,
          country: order.to.countryCode,
          phone: order.to.phone,
          email: order.to.email
        },
        package: {
          weight: this.calculateTotalWeight(order),
          dimensions: this.calculateDimensions(order),
          value: order.value,
          currency: order.currency || 'TRY'
        },
        service: order.service || 'YURTICI_STANDART',
        paymentType: 'SENDER', // Sender pays
        deliveryType: 'NORMAL' // Normal delivery
      };

      // In a real implementation, you would call Yurtiçi Kargo API here
      // For now, we'll simulate the response
      const trackingNumber = `YT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      return {
        trackingNumber,
        service: shipmentData.service,
        price: shipmentData.package.value * 0.05, // 5% of order value
        currency: shipmentData.package.currency,
        labelUrl: `https://api.yurticikargo.com.tr/labels/${trackingNumber}.pdf`,
        trackingUrl: `https://www.yurticikargo.com/tr/takip/${trackingNumber}`,
        estimatedDelivery: this.calculateEstimatedDelivery(order.to.countryCode),
        status: 'created'
      };
    } catch (error) {
      console.error('Yurtiçi Kargo shipment creation error:', error);
      throw new Error('Failed to create Yurtiçi Kargo shipment');
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      // Yurtiçi Kargo tracking
      // In a real implementation, you would call Yurtiçi Kargo tracking API
      
      // Simulate tracking response
      const events = [
        {
          status: 'Picked up',
          description: 'Package picked up from sender',
          location: 'Istanbul, Turkey',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          status: 'In transit',
          description: 'Package in transit to destination',
          location: 'Ankara, Turkey',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          status: 'Out for delivery',
          description: 'Package out for delivery',
          location: 'Istanbul, Turkey',
          timestamp: new Date().toISOString()
        }
      ];

      return {
        trackingNumber,
        status: 'In transit',
        events,
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        carrier: 'Yurtiçi Kargo',
        service: 'YURTICI_STANDART'
      };
    } catch (error) {
      console.error('Yurtiçi Kargo tracking error:', error);
      throw new Error('Failed to track Yurtiçi Kargo shipment');
    }
  }

  async validateConfig(): Promise<boolean> {
    try {
      // Validate Yurtiçi Kargo configuration
      if (!this.apiKey || !this.customerId) {
        return false;
      }

      // In a real implementation, you would test the API connection
      // For now, we'll just validate the required fields
      return true;
    } catch (error) {
      console.error('Yurtiçi Kargo config validation error:', error);
      return false;
    }
  }

  getProviderName(): string {
    return 'Yurtiçi Kargo';
  }

  private calculateTotalWeight(order: ShippingOrder): number {
    return order.packages.reduce((total, pkg) => total + pkg.weight, 0);
  }

  private calculateDimensions(order: ShippingOrder): { length: number; width: number; height: number } {
    // Calculate total package dimensions
    let totalLength = 0;
    let totalWidth = 0;
    let totalHeight = 0;

    order.packages.forEach(pkg => {
      totalLength = Math.max(totalLength, pkg.length);
      totalWidth = Math.max(totalWidth, pkg.width);
      totalHeight += pkg.height;
    });

    return {
      length: totalLength,
      width: totalWidth,
      height: totalHeight
    };
  }

  private calculateBasePrice(weight: number, destination: string): number {
    // Yurtiçi Kargo pricing logic
    let basePrice = 15; // Base price in TRY

    // Weight-based pricing
    if (weight > 1) {
      basePrice += (weight - 1) * 5; // 5 TRY per additional kg
    }

    // Destination-based pricing
    if (destination === 'TR') {
      // Domestic shipping
      return basePrice;
    } else {
      // International shipping
      return basePrice * 2;
    }
  }

  private getEstimatedDays(destination: string, serviceType: string): number {
    if (destination === 'TR') {
      // Domestic shipping
      switch (serviceType) {
        case 'express': return 1;
        case 'standard': return 2;
        case 'economic': return 3;
        default: return 2;
      }
    } else {
      // International shipping
      switch (serviceType) {
        case 'express': return 3;
        case 'standard': return 5;
        case 'economic': return 7;
        default: return 5;
      }
    }
  }

  private getServiceFeatures(serviceCode: string): string[] {
    switch (serviceCode) {
      case 'YURTICI_STANDART':
        return ['2 iş günü teslimat', 'SMS bildirimi', 'Online takip'];
      case 'YURTICI_EXPRESS':
        return ['1 iş günü teslimat', 'Öncelikli işlem', 'SMS bildirimi', 'Online takip'];
      case 'YURTICI_ECONOMIC':
        return ['3 iş günü teslimat', 'Ekonomik fiyat', 'Online takip'];
      default:
        return ['Online takip'];
    }
  }

  private calculateEstimatedDelivery(destination: string): string {
    const now = new Date();
    const deliveryDays = this.getEstimatedDays(destination, 'standard');
    const deliveryDate = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    return deliveryDate.toISOString();
  }
}
