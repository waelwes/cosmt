'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingRatesSelector } from '@/components/shipping/ShippingRatesSelector';
import { useShipping } from '@/hooks/useShipping';
import { ShippingOrder, ShippingRate, ShippingAddress, ShippingPackage } from '@/lib/shipping/interfaces/IShippingProvider';

interface ShippingStepProps {
  onShippingSelect: (rate: ShippingRate, address: ShippingAddress) => void;
  onNext: () => void;
  onBack: () => void;
  className?: string;
}

export default function ShippingStep({
  onShippingSelect,
  onNext,
  onBack,
  className
}: ShippingStepProps) {
  const { rates, loading } = useShipping();
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    countryCode: 'US',
    phone: '',
    email: '',
  });

  const [order, setOrder] = useState<ShippingOrder>({
    orderId: `ORDER-${Date.now()}`,
    from: {
      name: 'Your Store',
      company: 'Your Company',
      address1: '123 Store Street',
      city: 'Store City',
      postalCode: '12345',
      countryCode: 'US',
      phone: '+1234567890',
      email: 'store@example.com',
    },
    to: shippingAddress,
    packages: [
      {
        weight: 1.0,
        length: 10.0,
        width: 10.0,
        height: 10.0,
        weightUnit: 'kg',
        dimensionUnit: 'cm',
      }
    ],
    value: 100.00,
    currency: 'USD',
  });

  useEffect(() => {
    setOrder(prev => ({
      ...prev,
      to: shippingAddress,
    }));
  }, [shippingAddress]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRateSelect = (rate: ShippingRate) => {
    setSelectedRate(rate);
  };

  const handleNext = () => {
    if (selectedRate) {
      onShippingSelect(selectedRate, shippingAddress);
      onNext();
    }
  };

  const isFormValid = () => {
    return (
      shippingAddress.name &&
      shippingAddress.address1 &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      shippingAddress.countryCode &&
      selectedRate
    );
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>
              Enter the delivery address for your order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={shippingAddress.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  value={shippingAddress.company || ''}
                  onChange={(e) => handleAddressChange('company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  type="text"
                  value={shippingAddress.address1}
                  onChange={(e) => handleAddressChange('address1', e.target.value)}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  type="text"
                  value={shippingAddress.address2 || ''}
                  onChange={(e) => handleAddressChange('address2', e.target.value)}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="Enter postal code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country *</Label>
                <Select
                  value={shippingAddress.countryCode}
                  onValueChange={(value) => handleAddressChange('countryCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingAddress.phone || ''}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email || ''}
                  onChange={(e) => handleAddressChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <ShippingRatesSelector
          order={order}
          onRateSelect={handleRateSelect}
          selectedRate={selectedRate}
        />

        <div className="flex items-center justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid() || loading}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
