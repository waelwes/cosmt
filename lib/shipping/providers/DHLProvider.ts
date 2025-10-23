import axios, { AxiosInstance } from 'axios';
import { 
  IShippingProvider, 
  ShippingOrder, 
  ShippingRate, 
  ShipmentResponse, 
  TrackingResponse,
  TrackingEvent 
} from '../interfaces/IShippingProvider';
import { DHLConfig } from '../interfaces/IShippingConfig';

export class DHLProvider implements IShippingProvider {
  private config: DHLConfig;
  private httpClient: AxiosInstance;

  constructor(config: DHLConfig) {
    this.config = config;
    this.httpClient = axios.create({
      baseURL: config.apiEndpoint,
      timeout: 30000,
      auth: {
        username: config.apiUsername,
        password: config.apiPassword
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async calculateRate(order: ShippingOrder): Promise<ShippingRate[]> {
    try {
      const requestBody = this.buildRateRequest(order);
      
      const response = await this.httpClient.post('/rates', requestBody);
      
      return this.parseRateResponse(response.data);
    } catch (error) {
      console.error('DHL Rate calculation error:', error);
      throw new Error(`Failed to calculate DHL rates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createShipment(order: ShippingOrder): Promise<ShipmentResponse> {
    try {
      const requestBody = this.buildShipmentRequest(order);
      
      const response = await this.httpClient.post('/shipments', requestBody);
      
      return this.parseShipmentResponse(response.data);
    } catch (error) {
      console.error('DHL Shipment creation error:', error);
      throw new Error(`Failed to create DHL shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const response = await this.httpClient.get(`/tracking/${trackingNumber}`);
      
      return this.parseTrackingResponse(response.data);
    } catch (error) {
      console.error('DHL Tracking error:', error);
      throw new Error(`Failed to track DHL shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateConfig(): Promise<boolean> {
    try {
      // Test API connection with a simple request
      await this.httpClient.get('/health');
      return true;
    } catch (error) {
      console.error('DHL Config validation error:', error);
      return false;
    }
  }

  getProviderName(): string {
    return 'DHL eCommerce';
  }

  private buildRateRequest(order: ShippingOrder): any {
    return {
      shipper: {
        name: this.config.shipperName,
        contactPerson: this.config.contactPerson,
        phone: this.config.phone,
        email: this.config.email,
        address: {
          address1: this.config.address1,
          address2: this.config.address2,
          city: this.config.city,
          postalCode: this.config.postalCode,
          countryCode: this.config.countryCode
        }
      },
      recipient: {
        name: order.to.name,
        company: order.to.company,
        phone: order.to.phone,
        email: order.to.email,
        address: {
          address1: order.to.address1,
          address2: order.to.address2,
          city: order.to.city,
          postalCode: order.to.postalCode,
          countryCode: order.to.countryCode
        }
      },
      packages: order.packages.map(pkg => ({
        weight: this.convertWeight(pkg.weight, pkg.weightUnit, this.config.weightUnit),
        length: this.convertDimension(pkg.length, pkg.dimensionUnit, this.config.dimensionUnit),
        width: this.convertDimension(pkg.width, pkg.dimensionUnit, this.config.dimensionUnit),
        height: this.convertDimension(pkg.height, pkg.dimensionUnit, this.config.dimensionUnit),
        weightUnit: this.config.weightUnit,
        dimensionUnit: this.config.dimensionUnit
      })),
      value: order.value,
      currency: order.currency,
      mode: this.config.mode,
      accountNumber: this.config.accountNumber
    };
  }

  private buildShipmentRequest(order: ShippingOrder): any {
    return {
      ...this.buildRateRequest(order),
      service: order.service || this.config.defaultService,
      labelFormat: this.config.labelFormat,
      insurance: order.insurance ?? this.config.insurance,
      signatureRequired: order.signatureRequired ?? this.config.signatureRequired,
      cod: order.cod ?? this.config.cod,
      orderId: order.orderId
    };
  }

  private parseRateResponse(data: any): ShippingRate[] {
    if (!data.rates || !Array.isArray(data.rates)) {
      return [];
    }

    return data.rates.map((rate: any) => ({
      service: rate.serviceCode,
      serviceName: rate.serviceName,
      price: rate.price + (this.config.handlingFee || 0),
      currency: rate.currency || 'USD',
      estimatedDays: rate.estimatedDays || 3,
      trackingAvailable: rate.trackingAvailable || true
    }));
  }

  private parseShipmentResponse(data: any): ShipmentResponse {
    return {
      trackingNumber: data.trackingNumber,
      labelUrl: data.labelUrl,
      trackingUrl: data.trackingUrl,
      estimatedDelivery: data.estimatedDelivery,
      service: data.service,
      price: data.price + (this.config.handlingFee || 0),
      currency: data.currency || 'USD'
    };
  }

  private parseTrackingResponse(data: any): TrackingResponse {
    return {
      trackingNumber: data.trackingNumber,
      status: data.status,
      location: data.location,
      lastUpdate: data.lastUpdate,
      events: data.events?.map((event: any) => ({
        timestamp: event.timestamp,
        status: event.status,
        location: event.location,
        description: event.description
      })) || []
    };
  }

  private convertWeight(weight: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return weight;
    
    if (fromUnit === 'lb' && toUnit === 'kg') {
      return weight * 0.453592;
    } else if (fromUnit === 'kg' && toUnit === 'lb') {
      return weight * 2.20462;
    }
    
    return weight;
  }

  private convertDimension(dimension: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return dimension;
    
    if (fromUnit === 'in' && toUnit === 'cm') {
      return dimension * 2.54;
    } else if (fromUnit === 'cm' && toUnit === 'in') {
      return dimension * 0.393701;
    }
    
    return dimension;
  }
}
