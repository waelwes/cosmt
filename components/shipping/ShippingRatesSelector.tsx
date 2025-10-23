'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Loader2, Truck, Clock, Shield, CheckCircle } from 'lucide-react';
import { useShipping } from '@/hooks/useShipping';
import { ShippingOrder, ShippingRate } from '@/lib/shipping/interfaces/IShippingProvider';

interface ShippingRatesSelectorProps {
  order: ShippingOrder;
  onRateSelect: (rate: ShippingRate) => void;
  selectedRate?: ShippingRate;
  className?: string;
}

export default function ShippingRatesSelector({
  order,
  onRateSelect,
  selectedRate,
  className
}: ShippingRatesSelectorProps) {
  const { loading, error, rates, calculateRates } = useShipping();
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (order && order.packages.length > 0) {
      handleCalculateRates();
    }
  }, [order]);

  const handleCalculateRates = async () => {
    setIsCalculating(true);
    await calculateRates(order);
    setIsCalculating(false);
  };

  const getServiceIcon = (service: string) => {
    if (service.includes('EXPRESS')) {
      return <Truck className="h-4 w-4 text-blue-600" />;
    }
    if (service.includes('ECONOMY')) {
      return <Clock className="h-4 w-4 text-green-600" />;
    }
    return <Shield className="h-4 w-4 text-gray-600" />;
  };

  const getServiceBadge = (service: string) => {
    if (service.includes('EXPRESS')) {
      return <Badge variant="default">Express</Badge>;
    }
    if (service.includes('ECONOMY')) {
      return <Badge variant="secondary">Economy</Badge>;
    }
    return <Badge variant="outline">Standard</Badge>;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatEstimatedDays = (days: number) => {
    if (days === 1) return '1 day';
    if (days <= 7) return `${days} days`;
    return `${Math.ceil(days / 7)} weeks`;
  };

  if (isCalculating || loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Calculating Shipping Rates
          </CardTitle>
          <CardDescription>
            Please wait while we calculate available shipping options...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-600">Shipping Error</CardTitle>
          <CardDescription>
            We encountered an error while calculating shipping rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm mb-4">{error}</div>
          <Button onClick={handleCalculateRates} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!rates || rates.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Shipping Options</CardTitle>
          <CardDescription>
            No shipping options are available for this destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCalculateRates} variant="outline">
            Recalculate Rates
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Shipping Options</CardTitle>
        <CardDescription>
          Choose your preferred shipping method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedRate?.service}
          onValueChange={(value) => {
            const rate = rates.find(r => r.service === value);
            if (rate) onRateSelect(rate);
          }}
          className="space-y-4"
        >
          {rates.map((rate) => (
            <div key={rate.service} className="flex items-center space-x-3">
              <RadioGroupItem value={rate.service} id={rate.service} />
              <Label
                htmlFor={rate.service}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(rate.service)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {rate.serviceName}
                        {getServiceBadge(rate.service)}
                        {selectedRate?.service === rate.service && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estimated delivery: {formatEstimatedDays(rate.estimatedDays)}
                        {rate.trackingAvailable && ' • Tracking available'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatPrice(rate.price, rate.currency)}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={handleCalculateRates}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Recalculate Rates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
