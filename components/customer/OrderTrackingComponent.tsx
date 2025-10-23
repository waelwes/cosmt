'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Package, MapPin, Clock, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from '@/lib/toast';

interface TrackingEvent {
  id: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
  status: string;
}

interface TrackingInfo {
  orderNumber: string;
  trackingNumber: string;
  status: string;
  carrier: string;
  service: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingUrl: string;
  events: TrackingEvent[];
  order: {
    id: string;
    status: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: any;
    createdAt: string;
  };
}

export default function OrderTrackingComponent() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTrackingInfo(data.trackingInfo);
        toast.success('Tracking information loaded successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load tracking information');
        toast.error('Failed to load tracking information');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to load tracking information');
      toast.error('Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (trackingInfo) {
      setLoading(true);
      try {
        const response = await fetch(`/api/tracking?trackingNumber=${encodeURIComponent(trackingInfo.trackingNumber)}`);
        
        if (response.ok) {
          const data = await response.json();
          setTrackingInfo(data.trackingInfo);
          toast.success('Tracking information refreshed');
        }
      } catch (error) {
        console.error('Error refreshing tracking:', error);
        toast.error('Failed to refresh tracking information');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
      case 'out for delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
      case 'in transit':
        return <Package className="h-4 w-4" />;
      case 'out_for_delivery':
      case 'out for delivery':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div data-admin="true" className="space-y-6">
      <div>
        <h1 className="text-heading-2 text-primary">Track Your Order</h1>
        <p className="text-body text-muted">
          Enter your tracking number to get real-time updates on your package
        </p>
      </div>

      {/* Tracking Input */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Tracking Information</CardTitle>
          <CardDescription>
            Use your DHL tracking number or order number to track your package
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-number" className="text-label text-primary">
              Tracking Number or Order Number
            </Label>
            <div className="flex gap-2">
              <Input
                id="tracking-number"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number or order number"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
              <Button 
                onClick={handleTrackOrder} 
                disabled={loading || !trackingNumber.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Track'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingInfo && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{trackingInfo.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    DHL Tracking: {trackingInfo.trackingNumber}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(trackingInfo.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(trackingInfo.status)}
                      {trackingInfo.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-label text-primary">Carrier</Label>
                  <p className="text-body text-secondary">{trackingInfo.carrier}</p>
                </div>
                <div>
                  <Label className="text-label text-primary">Service</Label>
                  <p className="text-body text-secondary">{trackingInfo.service}</p>
                </div>
                <div>
                  <Label className="text-label text-primary">Estimated Delivery</Label>
                  <p className="text-body text-secondary">
                    {trackingInfo.estimatedDelivery 
                      ? new Date(trackingInfo.estimatedDelivery).toLocaleDateString()
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(trackingInfo.trackingUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Track on DHL Website
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Events Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>
                Latest updates on your package location and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingInfo.events.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {trackingInfo.events.map((event, index) => (
                      <div key={event.id} className="relative flex items-start gap-4 pb-4">
                        {/* Timeline dot */}
                        <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                          index === 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getStatusIcon(event.status)}
                        </div>
                        
                        {/* Event content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-medium text-primary">
                              {event.description}
                            </h4>
                            <time className="text-body-small text-muted">
                              {new Date(event.timestamp).toLocaleString()}
                            </time>
                          </div>
                          {event.location && (
                            <p className="text-body-small text-secondary mt-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-body text-muted">No tracking events available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-body text-secondary">
                {trackingInfo.order.shippingAddress && (
                  <div>
                    <div>{trackingInfo.order.shippingAddress.name}</div>
                    <div>{trackingInfo.order.shippingAddress.address1}</div>
                    {trackingInfo.order.shippingAddress.address2 && (
                      <div>{trackingInfo.order.shippingAddress.address2}</div>
                    )}
                    <div>
                      {trackingInfo.order.shippingAddress.city}, {trackingInfo.order.shippingAddress.postalCode}
                    </div>
                    <div>{trackingInfo.order.shippingAddress.country}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
