import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ShippingConfig, DHLConfig } from '@/lib/shipping/interfaces/IShippingConfig';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'dhl';

    const { data: settings, error } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('provider', provider)
      .single();

    if (error) {
      console.error('Error fetching shipping settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    // Remove sensitive data from response
    const { api_password, ...safeSettings } = settings;

    return NextResponse.json({ settings: safeSettings });
  } catch (error) {
    console.error('Error in GET /api/shipping/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, ...settings } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Validate required fields based on provider
    if (provider === 'dhl') {
      const requiredFields = [
        'api_username', 'api_password', 'account_number', 'api_endpoint',
        'shipper_name', 'contact_person', 'phone', 'email', 'address1',
        'city', 'postal_code', 'country_code'
      ];

      for (const field of requiredFields) {
        if (!settings[field]) {
          return NextResponse.json({ 
            error: `Missing required field: ${field}` 
          }, { status: 400 });
        }
      }
    }

    // Check if settings already exist for this provider
    const { data: existingSettings } = await supabase
      .from('shipping_settings')
      .select('id')
      .eq('provider', provider)
      .single();

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('shipping_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('provider', provider)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await supabase
        .from('shipping_settings')
        .insert({
          provider,
          ...settings
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving shipping settings:', result.error);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    // Remove sensitive data from response
    const { api_password, ...safeSettings } = result.data;

    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings: safeSettings 
    });
  } catch (error) {
    console.error('Error in POST /api/shipping/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('shipping_settings')
      .delete()
      .eq('provider', provider);

    if (error) {
      console.error('Error deleting shipping settings:', error);
      return NextResponse.json({ error: 'Failed to delete settings' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/shipping/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
