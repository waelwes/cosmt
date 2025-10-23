import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingService } from '@/lib/shipping/services/ShippingService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider = 'dhl' } = body;

    // Get shipping settings for the provider
    const { data: settings, error: settingsError } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('provider', provider)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ 
        error: `No shipping configuration found for ${provider}` 
      }, { status: 404 });
    }

    // Create shipping service
    const shippingService = new ShippingService(provider, settings as any);

    // Validate configuration
    const isValid = await shippingService.validateProvider();

    return NextResponse.json({ 
      provider,
      valid: isValid,
      message: isValid ? 'Configuration is valid' : 'Configuration validation failed'
    });
  } catch (error) {
    console.error('Error validating shipping configuration:', error);
    return NextResponse.json({ 
      error: 'Failed to validate configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      valid: false
    }, { status: 500 });
  }
}
