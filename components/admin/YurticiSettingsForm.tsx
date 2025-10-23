'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Save, TestTube, CheckCircle, XCircle, Truck } from 'lucide-react';
import { toast } from '@/lib/toast';

interface YurticiConfig {
  // API Credentials
  apiKey: string;
  customerId: string;
  apiEndpoint: string;
  mode: 'sandbox' | 'production';
  
  // Shipper Information
  shipperName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  countryCode: string;
  
  // Shipping Options
  defaultService: string;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
  defaultWeight: number;
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  
  // Service Options
  insurance: boolean;
  signatureRequired: boolean;
  cod: boolean;
  
  // Destination & Rate Settings
  allowedCountries: string[];
  handlingFee: number;
  freeShippingThreshold: number;
  
  // Webhook & Real-time Settings
  webhookUrl: string;
  realtimeRate: boolean;
  enabled: boolean;
}

export default function YurticiSettingsForm() {
  const [config, setConfig] = useState<YurticiConfig>({
    // API Credentials
    apiKey: '',
    customerId: '',
    apiEndpoint: 'https://api.yurticikargo.com.tr',
    mode: 'sandbox',
    
    // Shipper Information
    shipperName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    countryCode: 'TR',
    
    // Shipping Options
    defaultService: 'YURTICI_STANDART',
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    defaultWeight: 1.0,
    defaultLength: 10.0,
    defaultWidth: 10.0,
    defaultHeight: 10.0,
    
    // Service Options
    insurance: false,
    signatureRequired: false,
    cod: false,
    
    // Destination & Rate Settings
    allowedCountries: ['TR', 'US', 'GB', 'DE', 'FR'],
    handlingFee: 0.00,
    freeShippingThreshold: 50.00,
    
    // Webhook & Real-time Settings
    webhookUrl: '',
    realtimeRate: true,
    enabled: false
  });

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/shipping/settings?provider=yurtici');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setConfig({ ...config, ...data.settings });
        }
      }
    } catch (error) {
      console.error('Error loading Yurtiçi settings:', error);
    }
  };

  const handleInputChange = (field: keyof YurticiConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'allowedCountries', value: string) => {
    const countries = value.split(',').map(c => c.trim().toUpperCase()).filter(c => c);
    setConfig(prev => ({
      ...prev,
      [field]: countries
    }));
  };

  const validateConfiguration = async () => {
    setValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/shipping/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'yurtici',
          config: config
        }),
      });

      const result = await response.json();
      setValidationResult({
        valid: result.valid,
        message: result.message
      });

      if (result.valid) {
        toast.success('Yurtiçi Kargo configuration is valid!');
      } else {
        toast.error('Yurtiçi Kargo configuration validation failed');
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Failed to validate configuration'
      });
      toast.error('Failed to validate configuration');
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/shipping/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'yurtici',
          config: config
        }),
      });

      if (response.ok) {
        toast.success('Yurtiçi Kargo settings saved successfully!');
        setValidationResult(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Credentials */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter Yurtiçi Kargo API key"
            />
          </div>
          <div>
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              type="text"
              value={config.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              placeholder="Enter Yurtiçi Kargo customer ID"
            />
          </div>
          <div>
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Select value={config.apiEndpoint} onValueChange={(value) => handleInputChange('apiEndpoint', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https://api.yurticikargo.com.tr">Production</SelectItem>
                <SelectItem value="https://api-test.yurticikargo.com.tr">Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mode">Mode</Label>
            <Select value={config.mode} onValueChange={(value) => handleInputChange('mode', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => handleInputChange('enabled', checked)}
            />
            <Label htmlFor="enabled">Enable Yurtiçi Kargo</Label>
          </div>
        </div>
      </div>

      {/* Shipper Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipperName">Shipper Name</Label>
            <Input
              id="shipperName"
              type="text"
              value={config.shipperName}
              onChange={(e) => handleInputChange('shipperName', e.target.value)}
              placeholder="Your company name"
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              type="text"
              value={config.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              placeholder="Contact person name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={config.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+90 212 555 0123"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={config.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="shipping@cosmat.com"
            />
          </div>
          <div>
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              type="text"
              value={config.address1}
              onChange={(e) => handleInputChange('address1', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div>
            <Label htmlFor="address2">Address Line 2</Label>
            <Input
              id="address2"
              type="text"
              value={config.address2}
              onChange={(e) => handleInputChange('address2', e.target.value)}
              placeholder="Apartment, suite, etc."
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              value={config.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Istanbul"
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              type="text"
              value={config.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="34000"
            />
          </div>
          <div>
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              type="text"
              value={config.countryCode}
              onChange={(e) => handleInputChange('countryCode', e.target.value)}
              placeholder="TR"
              maxLength={3}
            />
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="defaultService">Default Service</Label>
            <Select value={config.defaultService} onValueChange={(value) => handleInputChange('defaultService', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YURTICI_STANDART">Yurtiçi Kargo Standart</SelectItem>
                <SelectItem value="YURTICI_EXPRESS">Yurtiçi Kargo Express</SelectItem>
                <SelectItem value="YURTICI_ECONOMIC">Yurtiçi Kargo Ekonomik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weightUnit">Weight Unit</Label>
            <Select value={config.weightUnit} onValueChange={(value) => handleInputChange('weightUnit', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lb">Pounds (lb)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dimensionUnit">Dimension Unit</Label>
            <Select value={config.dimensionUnit} onValueChange={(value) => handleInputChange('dimensionUnit', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Service Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Options</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="insurance"
              checked={config.insurance}
              onCheckedChange={(checked) => handleInputChange('insurance', checked)}
            />
            <Label htmlFor="insurance">Include Shipping Insurance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="signatureRequired"
              checked={config.signatureRequired}
              onCheckedChange={(checked) => handleInputChange('signatureRequired', checked)}
            />
            <Label htmlFor="signatureRequired">Require Signature for Delivery</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="cod"
              checked={config.cod}
              onCheckedChange={(checked) => handleInputChange('cod', checked)}
            />
            <Label htmlFor="cod">Enable Cash on Delivery (COD)</Label>
          </div>
        </div>
      </div>

      {/* Destination & Rate Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination & Rate Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="allowedCountries">Allowed Countries (comma-separated)</Label>
            <Input
              id="allowedCountries"
              type="text"
              value={config.allowedCountries.join(', ')}
              onChange={(e) => handleArrayChange('allowedCountries', e.target.value)}
              placeholder="TR, US, GB, DE, FR"
            />
          </div>
          <div>
            <Label htmlFor="handlingFee">Handling Fee (₺)</Label>
            <Input
              id="handlingFee"
              type="number"
              step="0.01"
              value={config.handlingFee}
              onChange={(e) => handleInputChange('handlingFee', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₺)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              step="0.01"
              value={config.freeShippingThreshold}
              onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <Alert className={validationResult.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center">
            {validationResult.valid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={validationResult.valid ? 'text-green-800' : 'text-red-800'}>
              {validationResult.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={validateConfiguration}
          disabled={validating}
        >
          <TestTube className="h-4 w-4 mr-2" />
          {validating ? 'Validating...' : 'Test Configuration'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
