import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// Mock data for demo purposes when database is not available
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    total: 89.99,
    status: 'completed' as const,
    paymentStatus: 'paid' as const,
    shippingStatus: 'delivered' as const,
    date: '2024-01-15',
    items: 2,
    shippingAddress: 'İstanbul, Turkey',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ORD-002',
    customer: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '+90 555 234 5678',
    total: 125.50,
    status: 'processing' as const,
    paymentStatus: 'paid' as const,
    shippingStatus: 'preparing' as const,
    date: '2024-01-14',
    items: 3,
    shippingAddress: 'Ankara, Turkey',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'ORD-003',
    customer: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 345 6789',
    total: 67.25,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    shippingStatus: 'pending' as const,
    date: '2024-01-13',
    items: 1,
    shippingAddress: 'İzmir, Turkey',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

// GET /api/admin/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      return NextResponse.json({
        success: true,
        data: mockOrders,
        total: mockOrders.length,
        message: 'Demo mode - Using mock data. Please configure Supabase environment variables for real data.'
      });
    }

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
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockOrders,
      total: mockOrders.length,
      message: 'Database error - Using mock data as fallback'
    });
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
