'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Loader2, Package, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useShipping } from '@/hooks/useShipping';
import { TrackingResponse, TrackingEvent } from '@/lib/shipping/interfaces/IShippingProvider';

interface TrackingComponentProps {
  className?: string;
}

export default function TrackingComponent({ className }: TrackingComponentProps) {
  const { loading, error, tracking, trackShipment } = useShipping();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsTracking(true);
    await trackShipment(trackingNumber.trim());
    setIsTracking(false);
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (statusLower.includes('error') || statusLower.includes('failed') || statusLower.includes('exception')) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    if (statusLower.includes('warning') || statusLower.includes('delay')) {
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
    return <Package className="h-5 w-5 text-blue-600" />;
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Delivered</Badge>;
    }
    if (statusLower.includes('in transit') || statusLower.includes('shipped')) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">In Transit</Badge>;
    }
    if (statusLower.includes('processing') || statusLower.includes('picked up')) {
      return <Badge variant="secondary">Processing</Badge>;
    }
    if (statusLower.includes('error') || statusLower.includes('failed')) {
      return <Badge variant="destructive">Error</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Track Your Shipment</CardTitle>
          <CardDescription>
            Enter your tracking number to see the current status and location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <div className="flex gap-2">
                <Input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!trackingNumber.trim() || isTracking || loading}
                >
                  {isTracking || loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Track'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Tracking Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {tracking && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tracking.status)}
                    <span className="font-medium">Tracking #{tracking.trackingNumber}</span>
                  </div>
                  {getStatusBadge(tracking.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated: {formatDate(tracking.lastUpdate)}
                  </div>
                  {tracking.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      Current location: {tracking.location}
                    </div>
                  )}
                </div>
              </div>

              {tracking.events && tracking.events.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Tracking History</h4>
                  <div className="space-y-2">
                    {tracking.events.map((event: TrackingEvent, index: number) => (
                      <div key={index} className="flex gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{event.status}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
