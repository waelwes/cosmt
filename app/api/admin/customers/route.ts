import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// Mock data for demo purposes when database is not available
const mockCustomers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    status: 'active' as const,
    tier: 'premium' as const,
    totalOrders: 12,
    totalSpent: 1250.50,
    lastOrder: '2024-01-15',
    joinDate: '2023-06-15',
    location: 'İstanbul, Turkey',
    avatar: '/api/placeholder/40/40',
    rating: 4.8,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '+90 555 234 5678',
    status: 'active' as const,
    tier: 'regular' as const,
    totalOrders: 8,
    totalSpent: 456.75,
    lastOrder: '2024-01-14',
    joinDate: '2023-08-20',
    location: 'Ankara, Turkey',
    avatar: '/api/placeholder/40/40',
    rating: 4.5,
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 345 6789',
    status: 'active' as const,
    tier: 'vip' as const,
    totalOrders: 25,
    totalSpent: 3200.00,
    lastOrder: '2024-01-13',
    joinDate: '2023-03-10',
    location: 'İzmir, Turkey',
    avatar: '/api/placeholder/40/40',
    rating: 4.9,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-13')
  }
];

// GET /api/admin/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      return NextResponse.json({
        success: true,
        data: mockCustomers,
        total: mockCustomers.length,
        message: 'Demo mode - Using mock data. Please configure Supabase environment variables for real data.'
      });
    }

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
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockCustomers,
      total: mockCustomers.length,
      message: 'Database error - Using mock data as fallback'
    });
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
