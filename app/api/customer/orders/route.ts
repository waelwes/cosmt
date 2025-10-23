import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get customer orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('email');
    const customerId = searchParams.get('customerId');

    if (!customerEmail && !customerId) {
      return NextResponse.json(
        { error: 'Customer email or ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        shipments (
          id,
          tracking_number,
          status,
          carrier,
          service,
          estimated_delivery,
          actual_delivery
        )
      `)
      .order('created_at', { ascending: false });

    if (customerEmail) {
      query = query.eq('customer_email', customerEmail);
    } else if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching customer orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      shipping_address: order.shipping_address,
      items: order.items || [],
      shipment: order.shipments && order.shipments.length > 0 ? {
        tracking_number: order.shipments[0].tracking_number,
        status: order.shipments[0].status,
        carrier: order.shipments[0].carrier,
        service: order.shipments[0].service,
        estimated_delivery: order.shipments[0].estimated_delivery,
        actual_delivery: order.shipments[0].actual_delivery
      } : null
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error in customer orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new order (for testing or manual order creation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_email,
      customer_name,
      customer_phone,
      shipping_address,
      items,
      total_amount,
      payment_method,
      notes
    } = body;

    // Validate required fields
    if (!customer_email || !customer_name || !shipping_address || !items || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_email,
        customer_name,
        customer_phone,
        shipping_address,
        items,
        total_amount,
        payment_method,
        notes,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error in create order API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
