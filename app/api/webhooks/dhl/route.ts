import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import EmailService from '@/lib/services/EmailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DHL Webhook endpoint for tracking updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (implement based on DHL's webhook security)
    const signature = request.headers.get('x-dhl-signature');
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const {
      trackingNumber,
      status,
      events,
      estimatedDelivery,
      actualDelivery,
      location,
      description
    } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Find the shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select(`
        *,
        orders (
          id,
          order_number,
          customer_email,
          customer_name,
          status
        )
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (shipmentError || !shipment) {
      console.error('Shipment not found:', trackingNumber);
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Update shipment status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (estimatedDelivery) {
      updateData.estimated_delivery = estimatedDelivery;
    }

    if (actualDelivery) {
      updateData.actual_delivery = actualDelivery;
    }

    const { error: updateError } = await supabase
      .from('shipments')
      .update(updateData)
      .eq('tracking_number', trackingNumber);

    if (updateError) {
      console.error('Error updating shipment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update shipment' },
        { status: 500 }
      );
    }

    // Add new tracking event
    if (events && events.length > 0) {
      const eventsToInsert = events.map((event: any) => ({
        shipment_id: shipment.id,
        event_type: event.type || status,
        description: event.description || description,
        location: event.location || location,
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
    } else if (status || description) {
      // Add single event if no events array provided
      const { error: eventError } = await supabase
        .from('shipment_events')
        .insert({
          shipment_id: shipment.id,
          event_type: status,
          description: description || `Status updated to ${status}`,
          location: location,
          timestamp: new Date().toISOString(),
          status: status
        });

      if (eventError) {
        console.error('Error inserting single event:', eventError);
      }
    }

    // Update order status if shipment is delivered
    if (status === 'delivered' && shipment.orders) {
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({ 
          status: 'delivered',
          updated_at: new Date().toISOString()
        })
        .eq('id', shipment.orders.id);

      if (orderUpdateError) {
        console.error('Error updating order status:', orderUpdateError);
      }
    }

    // Send email notification to customer
    if (shipment.orders && shipment.orders.customer_email) {
      try {
        const emailService = EmailService.getInstance();
        
        // Send different emails based on status
        if (status === 'delivered') {
          await emailService.sendOrderStatusUpdate(
            shipment.orders.customer_email,
            shipment.orders.customer_name,
            shipment.orders.order_number,
            'delivered',
            trackingNumber
          );
        } else if (status === 'out_for_delivery') {
          await emailService.sendOrderStatusUpdate(
            shipment.orders.customer_email,
            shipment.orders.customer_name,
            shipment.orders.order_number,
            'out for delivery',
            trackingNumber
          );
        } else if (status === 'in_transit') {
          await emailService.sendOrderStatusUpdate(
            shipment.orders.customer_email,
            shipment.orders.customer_name,
            shipment.orders.order_number,
            'in transit',
            trackingNumber
          );
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the webhook, just log the error
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });
  } catch (error) {
    console.error('Error processing DHL webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify webhook signature (implement based on DHL's security requirements)
function verifyWebhookSignature(body: any, signature: string | null): boolean {
  if (!signature) {
    return false;
  }

  // Implement signature verification based on DHL's webhook security
  // This is a placeholder - implement according to DHL's documentation
  const expectedSignature = process.env.DHL_WEBHOOK_SECRET;
  
  if (!expectedSignature) {
    console.warn('DHL webhook secret not configured');
    return true; // Allow in development
  }

  // Implement HMAC verification or other signature verification method
  // This is a simplified example
  return signature === expectedSignature;
}

// Handle GET requests for webhook verification (if required by DHL)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    // Return the challenge for webhook verification
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    message: 'DHL Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
