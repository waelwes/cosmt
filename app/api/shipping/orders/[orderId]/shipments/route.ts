import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingService } from '@/lib/shipping/services/ShippingService';
import { ShippingOrder } from '@/lib/shipping/interfaces/IShippingProvider';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = params;
    const body = await request.json();
    const { provider = 'dhl', service } = body;

    // Get order details from your existing orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          price,
          total
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get shipping settings
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

    // Parse shipping address from order
    let shippingAddress;
    try {
      shippingAddress = JSON.parse(order.shipping_address);
    } catch {
      // Fallback if shipping_address is not JSON
      shippingAddress = {
        name: order.customer,
        email: order.email,
        phone: order.phone,
        address1: order.shipping_address,
        city: '',
        postalCode: '',
        countryCode: 'US'
      };
    }

    // Calculate total weight and dimensions from order items
    let totalWeight = 0;
    let totalValue = 0;
    
    // Get product details for weight calculation
    const productIds = order.order_items.map((item: any) => item.product_id);
    const { data: products } = await supabase
      .from('products')
      .select('id, weight, dimensions')
      .in('id', productIds);

    const productMap = new Map(products?.map(p => [p.id, p]) || []);

    order.order_items.forEach((item: any) => {
      const product = productMap.get(item.product_id);
      const itemWeight = product?.weight || 1.0; // Default weight if not specified
      totalWeight += itemWeight * item.quantity;
      totalValue += item.total;
    });

    // Create shipping order
    const shippingOrder: ShippingOrder = {
      orderId: order.id,
      from: {
        name: settings.shipper_name,
        company: settings.shipper_name,
        address1: settings.address1,
        address2: settings.address2,
        city: settings.city,
        postalCode: settings.postal_code,
        countryCode: settings.country_code,
        phone: settings.phone,
        email: settings.email,
      },
      to: shippingAddress,
      packages: [{
        weight: totalWeight || settings.default_weight,
        length: settings.default_length,
        width: settings.default_width,
        height: settings.default_height,
        weightUnit: settings.weight_unit,
        dimensionUnit: settings.dimension_unit,
      }],
      value: totalValue,
      currency: 'USD',
      service: service || settings.default_service,
      insurance: settings.insurance,
      signatureRequired: settings.signature_required,
      cod: settings.cod,
    };

    // Create shipping service
    const shippingService = new ShippingService(provider, settings as any);

    // Create shipment
    const shipment = await shippingService.createShipment(shippingOrder);

    // Store shipment in database
    const { data: newShipment, error: dbError } = await supabase
      .from('shipments')
      .insert({
        order_id: orderId,
        tracking_number: shipment.trackingNumber,
        provider: provider,
        service: shipment.service,
        price: shipment.price,
        currency: shipment.currency,
        label_url: shipment.labelUrl,
        tracking_url: shipment.trackingUrl,
        estimated_delivery: shipment.estimatedDelivery,
        weight: totalWeight,
        insurance: settings.insurance,
        signature_required: settings.signature_required,
        cod: settings.cod,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error storing shipment:', dbError);
      return NextResponse.json({ 
        error: 'Failed to store shipment',
        details: dbError.message 
      }, { status: 500 });
    }

    // Update order with shipping information
    await supabase
      .from('orders')
      .update({
        shipping_status: 'preparing',
        tracking_number: shipment.trackingNumber,
        shipping_method: shipment.service,
        shipping_cost: shipment.price,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return NextResponse.json({ 
      shipment: newShipment,
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

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = params;

    // Get shipments for this order
    const { data: shipments, error } = await supabase
      .from('shipments')
      .select(`
        *,
        shipment_events (
          id,
          event_type,
          status,
          description,
          location,
          timestamp
        )
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shipments:', error);
      return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
    }

    return NextResponse.json({ shipments });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch shipments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
