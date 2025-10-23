import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingService } from '@/lib/shipping/services/ShippingService';
import { ShippingOrder } from '@/lib/shipping/interfaces/IShippingProvider';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider = 'dhl', order } = body;

    if (!order) {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    // Get shipping settings for the provider
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

    // Create shipping service
    const shippingService = new ShippingService(provider, settings as any);

    // Calculate rates
    const rates = await shippingService.getRates(order as ShippingOrder);

    return NextResponse.json({ 
      provider,
      rates,
      currency: order.currency || 'USD'
    });
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json({ 
      error: 'Failed to calculate shipping rates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
