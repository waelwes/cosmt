import { useState, useCallback } from 'react';
import { ShippingOrder, ShippingRate, ShipmentResponse, TrackingResponse } from '@/lib/shipping/interfaces/IShippingProvider';

interface UseShippingReturn {
  // State
  loading: boolean;
  error: string | null;
  rates: ShippingRate[];
  shipment: ShipmentResponse | null;
  tracking: TrackingResponse | null;

  // Actions
  calculateRates: (order: ShippingOrder, provider?: string) => Promise<void>;
  createShipment: (order: ShippingOrder, provider?: string) => Promise<void>;
  trackShipment: (trackingNumber: string, provider?: string) => Promise<void>;
  clearError: () => void;
  clearRates: () => void;
  clearShipment: () => void;
  clearTracking: () => void;
}

export function useShipping(): UseShippingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [shipment, setShipment] = useState<ShipmentResponse | null>(null);
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);

  const calculateRates = useCallback(async (order: ShippingOrder, provider = 'dhl') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, order }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate rates');
      }

      const data = await response.json();
      setRates(data.rates || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate rates';
      setError(errorMessage);
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createShipment = useCallback(async (order: ShippingOrder, provider = 'dhl') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shipping/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, order }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create shipment');
      }

      const data = await response.json();
      setShipment(data.shipment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create shipment';
      setError(errorMessage);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const trackShipment = useCallback(async (trackingNumber: string, provider = 'dhl') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/shipping/tracking?trackingNumber=${trackingNumber}&provider=${provider}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to track shipment');
      }

      const data = await response.json();
      setTracking(data.tracking);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track shipment';
      setError(errorMessage);
      setTracking(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRates = useCallback(() => {
    setRates([]);
  }, []);

  const clearShipment = useCallback(() => {
    setShipment(null);
  }, []);

  const clearTracking = useCallback(() => {
    setTracking(null);
  }, []);

  return {
    loading,
    error,
    rates,
    shipment,
    tracking,
    calculateRates,
    createShipment,
    trackShipment,
    clearError,
    clearRates,
    clearShipment,
    clearTracking,
  };
}
