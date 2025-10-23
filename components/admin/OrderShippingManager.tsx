'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useShipping } from '@/hooks/useShipping';
import { toast } from '@/lib/toast';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  payment_status: string;
  shipping_status: string;
  shipping_address: string;
  tracking_number?: string;
  shipping_method?: string;
  shipping_cost?: number;
  estimated_delivery?: string;
  date: string;
  items: number;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Shipment {
  id: string;
  order_id: string;
  tracking_number: string;
  provider: string;
  service: string;
  status: string;
  price: number;
  currency: string;
  label_url?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  shipment_events?: ShipmentEvent[];
}

interface ShipmentEvent {
  id: string;
  event_type: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

interface OrderShippingManagerProps {
  order: Order;
  onOrderUpdate?: (order: Order) => void;
  className?: string;
}

export default function OrderShippingManager({ 
  order, 
  onOrderUpdate, 
  className 
}: OrderShippingManagerProps) {
  const { trackShipment, tracking } = useShipping();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    loadShipments();
  }, [order.id]);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shipping/orders/${order.id}/shipments`);
      if (response.ok) {
        const data = await response.json();
        setShipments(data.shipments || []);
      }
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/shipping/orders/${order.id}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'dhl',
          service: selectedService,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShipments(prev => [data.shipment, ...prev]);
        onOrderUpdate?.({
          ...order,
          shipping_status: 'preparing',
          tracking_number: data.shipment.tracking_number,
          shipping_method: data.shipment.service,
          shipping_cost: data.shipment.price,
        });
        toast.success('Shipment created successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackShipment = async (trackingNumber: string) => {
    setTrackingNumber(trackingNumber);
    await trackShipment(trackingNumber);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'preparing':
        return <Package className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'preparing': { variant: 'outline' as const, label: 'Preparing' },
      'shipped': { variant: 'default' as const, label: 'Shipped' },
      'delivered': { variant: 'default' as const, label: 'Delivered' },
      'returned': { variant: 'destructive' as const, label: 'Returned' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { variant: 'outline' as const, label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseShippingAddress = (address: string) => {
    try {
      return JSON.parse(address);
    } catch {
      return { address1: address };
    }
  };

  const shippingAddress = parseShippingAddress(order.shipping_address);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Management
          </CardTitle>
          <CardDescription>
            Manage shipping for order #{order.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <span className="text-sm font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer:</span>
                      <span className="text-sm font-medium">{order.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-sm font-medium">${order.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="text-sm font-medium">{order.items}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Shipping Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.shipping_status)}
                        {getStatusBadge(order.shipping_status)}
                      </div>
                    </div>
                    {order.tracking_number && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tracking:</span>
                        <span className="text-sm font-medium">{order.tracking_number}</span>
                      </div>
                    )}
                    {order.shipping_method && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Method:</span>
                        <span className="text-sm font-medium">{order.shipping_method}</span>
                      </div>
                    )}
                    {order.shipping_cost && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost:</span>
                        <span className="text-sm font-medium">${order.shipping_cost}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div className="font-medium">{shippingAddress.name || order.customer}</div>
                    <div>{shippingAddress.address1}</div>
                    {shippingAddress.address2 && <div>{shippingAddress.address2}</div>}
                    <div>
                      {shippingAddress.city}, {shippingAddress.postalCode} {shippingAddress.countryCode}
                    </div>
                    {shippingAddress.phone && <div>{shippingAddress.phone}</div>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Shipments</h3>
                {order.shipping_status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXPRESS">DHL Express</SelectItem>
                        <SelectItem value="EXPRESS_12">DHL Express 12:00</SelectItem>
                        <SelectItem value="EXPRESS_10">DHL Express 10:30</SelectItem>
                        <SelectItem value="ECONOMY">DHL Economy</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleCreateShipment}
                      disabled={!selectedService || loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Shipment
                    </Button>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading shipments...</span>
                </div>
              ) : shipments.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No shipments found for this order.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <Card key={shipment.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(shipment.status)}
                            <CardTitle className="text-sm">
                              {shipment.provider} - {shipment.service}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(shipment.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTrackShipment(shipment.tracking_number)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Track
                            </Button>
                            {shipment.label_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(shipment.label_url, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Label
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Tracking:</span>
                            <div className="font-medium">{shipment.tracking_number}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Price:</span>
                            <div className="font-medium">${shipment.price} {shipment.currency}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <div className="font-medium">{formatDate(shipment.created_at)}</div>
                          </div>
                          {shipment.estimated_delivery && (
                            <div>
                              <span className="text-gray-600">Est. Delivery:</span>
                              <div className="font-medium">{formatDate(shipment.estimated_delivery)}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              {tracking ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Tracking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Tracking #{tracking.trackingNumber}</div>
                        <div className="text-sm text-gray-600">
                          Last updated: {new Date(tracking.lastUpdate).toLocaleString()}
                        </div>
                      </div>
                      {getStatusBadge(tracking.status)}
                    </div>
                    
                    {tracking.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Current location: {tracking.location}</span>
                      </div>
                    )}

                    {tracking.events && tracking.events.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Tracking History</h4>
                        <div className="space-y-2">
                          {tracking.events.map((event, index) => (
                            <div key={index} className="flex gap-3 p-3 border rounded-lg">
                              <div className="flex-shrink-0 mt-1">
                                {getStatusIcon(event.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{event.status}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
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
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Select a shipment to track its status.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
