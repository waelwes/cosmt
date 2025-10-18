import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('payment_gateways')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching payment gateway:', error);
      return NextResponse.json(
        { error: 'Payment gateway not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment gateway fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // For demo purposes, just return the updated data
    // In production, this would update the database
    console.log('Demo: Updating payment gateway', params.id, 'with data:', body);
    
    return NextResponse.json({
      ...body,
      id: parseInt(params.id),
      updated_at: new Date().toISOString(),
      demo: true
    });
  } catch (error) {
    console.error('Payment gateway update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('payment_gateways')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting payment gateway:', error);
      return NextResponse.json(
        { error: 'Failed to delete payment gateway' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment gateway deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
