import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get customer profile
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
      .from('customers')
      .select('*');

    if (customerEmail) {
      query = query.eq('email', customerEmail);
    } else if (customerId) {
      query = query.eq('id', customerId);
    }

    const { data: customers, error } = await query;

    if (error) {
      console.error('Error fetching customer profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customer profile' },
        { status: 500 }
      );
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // Format the response
    const profile = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in customer profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update customer profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      name,
      email,
      phone,
      address
    } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Update customer profile
    const { data: customer, error: updateError } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating customer profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update customer profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      profile: customer,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error in update customer profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create customer profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    // Create customer profile
    const { data: customer, error: createError } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone,
        address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating customer profile:', createError);
      return NextResponse.json(
        { error: 'Failed to create customer profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      profile: customer,
      message: 'Customer profile created successfully' 
    });
  } catch (error) {
    console.error('Error in create customer profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
