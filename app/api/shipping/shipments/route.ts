import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingService } from '@/lib/shipping/services/ShippingService';
import { ShippingOrder } from '@/lib/shipping/interfaces/IShippingProvider';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider = 'dhl', order } = body;

    if (!order) {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    // Get shipping settings for the provider
    const { data: settings, error: settingsError } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('provider', provider)
      .eq('enabled', true)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ 
        error: `No active shipping configuration found for ${provider}` 
      }, { status: 404 });
    }

    // Create shipping service
    const shippingService = new ShippingService(provider, settings as any);

    // Create shipment
    const shipment = await shippingService.createShipment(order as ShippingOrder);

    // Store shipment in database (optional)
    const { error: dbError } = await supabase
      .from('shipments')
      .insert({
        order_id: order.orderId,
        tracking_number: shipment.trackingNumber,
        provider: provider,
        service: shipment.service,
        price: shipment.price,
        currency: shipment.currency,
        label_url: shipment.labelUrl,
        tracking_url: shipment.trackingUrl,
        estimated_delivery: shipment.estimatedDelivery,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.warn('Failed to store shipment in database:', dbError);
      // Don't fail the request if database storage fails
    }

    return NextResponse.json({ 
      shipment,
      message: 'Shipment created successfully'
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to create shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
