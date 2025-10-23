export interface BaseShippingConfig {
  provider: string;
  mode: 'sandbox' | 'production';
  enabled: boolean;
  updatedAt: string;
}

export interface DHLConfig extends BaseShippingConfig {
  provider: 'dhl';
  apiUsername: string;
  apiPassword: string;
  accountNumber: string;
  apiEndpoint: string;
  shipperName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  countryCode: string;
  defaultService: string;
  labelFormat: 'PDF' | 'PNG' | 'ZPL';
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
  defaultWeight: number;
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  insurance: boolean;
  signatureRequired: boolean;
  cod: boolean;
  allowedCountries: string[];
  handlingFee: number;
  freeShippingThreshold: number;
  webhookUrl?: string;
  realtimeRate: boolean;
}

export type ShippingConfig = DHLConfig;
