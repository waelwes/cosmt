export interface PaymentConfig {
  provider: string;
  merchantId: string;
  merchantKey?: string;
  merchantSalt?: string;
  terminalId?: string;
  password?: string;
  storeKey?: string;
  apiUrl: string;
  mode: 'sandbox' | 'production';
  enabled: boolean;
  isDefault: boolean;
  feesPercentage: number;
  feesFixed: number;
  supportedCurrencies: string[];
  supportedCountries: string[];
  webhookSecret?: string;
  webhookUrl?: string;
  description?: string;
}

export interface PayTRConfig extends PaymentConfig {
  provider: 'paytr';
  merchantKey: string;
  merchantSalt: string;
}

export interface VakifBankConfig extends PaymentConfig {
  provider: 'vakifbank';
  terminalId: string;
  password: string;
}

export interface KuveytTurkConfig extends PaymentConfig {
  provider: 'kuveytturk';
  terminalId: string;
  password: string;
  storeKey: string;
}
