export interface ShippingRate {
  service: string;
  serviceName: string;
  price: number;
  currency: string;
  estimatedDays: number;
  trackingAvailable: boolean;
}

export interface ShippingAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
  email?: string;
}

export interface ShippingPackage {
  weight: number;
  length: number;
  width: number;
  height: number;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
}

export interface ShippingOrder {
  orderId: string;
  from: ShippingAddress;
  to: ShippingAddress;
  packages: ShippingPackage[];
  value: number;
  currency: string;
  service?: string;
  insurance?: boolean;
  signatureRequired?: boolean;
  cod?: boolean;
}

export interface ShipmentResponse {
  trackingNumber: string;
  labelUrl?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  service: string;
  price: number;
  currency: string;
}

export interface TrackingResponse {
  trackingNumber: string;
  status: string;
  location?: string;
  lastUpdate: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}

export interface IShippingProvider {
  /**
   * Calculate shipping rates for an order
   */
  calculateRate(order: ShippingOrder): Promise<ShippingRate[]>;

  /**
   * Create a shipment and return tracking information
   */
  createShipment(order: ShippingOrder): Promise<ShipmentResponse>;

  /**
   * Track a shipment by tracking number
   */
  trackShipment(trackingNumber: string): Promise<TrackingResponse>;

  /**
   * Validate the provider configuration
   */
  validateConfig(): Promise<boolean>;

  /**
   * Get provider name
   */
  getProviderName(): string;
}
