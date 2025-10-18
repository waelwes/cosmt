import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// GET /api/admin/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const orders = await supabaseDb.getOrders({
      search,
      status,
      dateRange,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customer', 'email', 'phone', 'total', 'status', 'paymentStatus', 'shippingStatus', 'items', 'shippingAddress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const order = await supabaseDb.createOrder({
      customer: body.customer,
      email: body.email,
      phone: body.phone,
      total: parseFloat(body.total),
      status: body.status,
      paymentStatus: body.paymentStatus,
      shippingStatus: body.shippingStatus,
      date: body.date || new Date().toISOString().split('T')[0],
      items: parseInt(body.items),
      shippingAddress: body.shippingAddress
    });

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
