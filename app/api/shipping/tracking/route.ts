import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingService } from '@/lib/shipping/services/ShippingService';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const provider = searchParams.get('provider') || 'dhl';

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
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

    // Track shipment
    const tracking = await shippingService.trackShipment(trackingNumber);

    return NextResponse.json({ 
      tracking,
      provider
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to track shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
