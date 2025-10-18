import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// GET /api/admin/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const customers = await supabaseDb.getCustomers({
      search,
      status,
      tier,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    return NextResponse.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'status', 'tier'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const customer = await supabaseDb.createCustomer({
      name: body.name,
      email: body.email,
      phone: body.phone,
      status: body.status,
      tier: body.tier,
      totalOrders: body.totalOrders || 0,
      totalSpent: body.totalSpent || 0,
      lastOrder: body.lastOrder || '',
      joinDate: body.joinDate || new Date().toISOString().split('T')[0],
      location: body.location || '',
      avatar: body.avatar || '/api/placeholder/40/40',
      rating: body.rating || 0
    });

    return NextResponse.json({
      success: true,
      data: customer
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
