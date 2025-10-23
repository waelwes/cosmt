import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get tracking information for a specific order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');

    if (!orderId && !trackingNumber) {
      return NextResponse.json(
        { error: 'Order ID or tracking number is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('shipments')
      .select(`
        *,
        orders (
          id,
          order_number,
          status,
          customer_email,
          customer_name,
          shipping_address,
          created_at
        ),
        shipment_events (
          id,
          event_type,
          description,
          location,
          timestamp,
          status
        )
      `);

    if (orderId) {
      query = query.eq('order_id', orderId);
    } else if (trackingNumber) {
      query = query.eq('tracking_number', trackingNumber);
    }

    const { data: shipments, error } = await query;

    if (error) {
      console.error('Error fetching tracking data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tracking information' },
        { status: 500 }
      );
    }

    if (!shipments || shipments.length === 0) {
      return NextResponse.json(
        { error: 'No tracking information found' },
        { status: 404 }
      );
    }

    const shipment = shipments[0];
    
    // Format the response
    const trackingInfo = {
      orderNumber: shipment.orders.order_number,
      trackingNumber: shipment.tracking_number,
      status: shipment.status,
      carrier: shipment.carrier,
      service: shipment.service,
      estimatedDelivery: shipment.estimated_delivery,
      actualDelivery: shipment.actual_delivery,
      trackingUrl: `https://www.dhl.com/tracking?trackingNumber=${shipment.tracking_number}`,
      events: shipment.shipment_events.map(event => ({
        id: event.id,
        type: event.event_type,
        description: event.description,
        location: event.location,
        timestamp: event.timestamp,
        status: event.status
      })),
      order: {
        id: shipment.orders.id,
        status: shipment.orders.status,
        customerEmail: shipment.orders.customer_email,
        customerName: shipment.orders.customer_name,
        shippingAddress: shipment.orders.shipping_address,
        createdAt: shipment.orders.created_at
      }
    };

    return NextResponse.json({ trackingInfo });
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update shipment tracking information (webhook from DHL)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumber, events, status, estimatedDelivery } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Update shipment status
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .update({
        status,
        estimated_delivery: estimatedDelivery,
        updated_at: new Date().toISOString()
      })
      .eq('tracking_number', trackingNumber)
      .select()
      .single();

    if (shipmentError) {
      console.error('Error updating shipment:', shipmentError);
      return NextResponse.json(
        { error: 'Failed to update shipment' },
        { status: 500 }
      );
    }

    // Add new events if provided
    if (events && events.length > 0) {
      const eventsToInsert = events.map((event: any) => ({
        shipment_id: shipment.id,
        event_type: event.type,
        description: event.description,
        location: event.location,
        timestamp: event.timestamp || new Date().toISOString(),
        status: event.status || status
      }));

      const { error: eventsError } = await supabase
        .from('shipment_events')
        .insert(eventsToInsert);

      if (eventsError) {
        console.error('Error inserting events:', eventsError);
        // Don't fail the request, just log the error
      }
    }

    // Get order information to send email notification
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('customer_email, customer_name, order_number')
      .eq('id', shipment.order_id)
      .single();

    if (!orderError && orderData) {
      // Send email notification to customer
      try {
        const EmailService = (await import('@/lib/services/EmailService')).default;
        const emailService = EmailService.getInstance();
        
        await emailService.sendOrderStatusUpdate(
          orderData.customer_email,
          orderData.customer_name,
          orderData.order_number,
          status,
          trackingNumber
        );
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tracking information updated successfully' 
    });
  } catch (error) {
    console.error('Error in tracking update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
