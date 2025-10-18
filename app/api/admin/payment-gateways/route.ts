import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('payment_gateways')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.log('Database not available, returning demo data:', error.message);
      
      // Return demo data when database is not available
      const demoGateways = [
        {
          id: 1,
          name: 'stripe',
          display_name: 'Stripe',
          provider: 'stripe',
          is_active: true,
          is_default: true,
          mode: 'sandbox',
          public_key: 'pk_test_demo_key_12345',
          secret_key: 'sk_test_demo_secret_67890',
          merchant_id: 'demo_merchant_123',
          webhook_secret: 'whsec_demo_webhook_secret',
          supported_currencies: ['USD', 'EUR', 'GBP'],
          supported_countries: ['US', 'EU', 'GB'],
          fees_percentage: 2.90,
          fees_fixed: 0.30,
          api_url: 'https://api.stripe.com',
          webhook_url: 'https://yourdomain.com/api/webhooks/stripe',
          description: 'Stripe payment processing for global payments',
          test_status: 'success',
          last_tested_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'paypal',
          display_name: 'PayPal',
          provider: 'paypal',
          is_active: false,
          is_default: false,
          mode: 'sandbox',
          public_key: 'demo_paypal_client_id',
          secret_key: 'demo_paypal_secret',
          merchant_id: 'demo_paypal_merchant',
          webhook_secret: 'demo_paypal_webhook',
          supported_currencies: ['USD', 'EUR', 'GBP', 'CAD'],
          supported_countries: ['US', 'EU', 'GB', 'CA'],
          fees_percentage: 2.90,
          fees_fixed: 0.30,
          api_url: 'https://api.paypal.com',
          webhook_url: 'https://yourdomain.com/api/webhooks/paypal',
          description: 'PayPal digital wallet for alternative payments',
          test_status: 'pending',
          last_tested_at: null
        },
        {
          id: 3,
          name: 'iyzico',
          display_name: 'Iyzico',
          provider: 'iyzico',
          is_active: false,
          is_default: false,
          mode: 'sandbox',
          public_key: 'demo_iyzico_api_key',
          secret_key: 'demo_iyzico_secret',
          merchant_id: 'demo_iyzico_merchant',
          webhook_secret: 'demo_iyzico_webhook',
          supported_currencies: ['TRY'],
          supported_countries: ['TR'],
          fees_percentage: 2.90,
          fees_fixed: 0.30,
          api_url: 'https://sandbox-api.iyzipay.com',
          webhook_url: 'https://yourdomain.com/api/webhooks/iyzico',
          description: 'Turkish payment gateway with installment options',
          test_status: 'pending',
          last_tested_at: null
        },
        {
          id: 4,
          name: 'razorpay',
          display_name: 'Razorpay',
          provider: 'razorpay',
          is_active: false,
          is_default: false,
          mode: 'sandbox',
          public_key: 'rzp_test_demo_key',
          secret_key: 'rzp_test_demo_secret',
          merchant_id: 'demo_razorpay_merchant',
          webhook_secret: 'demo_razorpay_webhook',
          supported_currencies: ['INR'],
          supported_countries: ['IN'],
          fees_percentage: 2.00,
          fees_fixed: 0.00,
          api_url: 'https://api.razorpay.com',
          webhook_url: 'https://yourdomain.com/api/webhooks/razorpay',
          description: 'Razorpay for Indian market payments',
          test_status: 'pending',
          last_tested_at: null
        },
        {
          id: 5,
          name: 'paystack',
          display_name: 'Paystack',
          provider: 'paystack',
          is_active: false,
          is_default: false,
          mode: 'sandbox',
          public_key: 'pk_test_demo_paystack',
          secret_key: 'sk_test_demo_paystack',
          merchant_id: 'demo_paystack_merchant',
          webhook_secret: 'demo_paystack_webhook',
          supported_currencies: ['NGN', 'GHS', 'ZAR'],
          supported_countries: ['NG', 'GH', 'ZA'],
          fees_percentage: 1.50,
          fees_fixed: 0.00,
          api_url: 'https://api.paystack.co',
          webhook_url: 'https://yourdomain.com/api/webhooks/paystack',
          description: 'Paystack for African market payments',
          test_status: 'pending',
          last_tested_at: null
        }
      ];

      return NextResponse.json(demoGateways);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Payment gateways fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('payment_gateways')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating payment gateway:', error);
      return NextResponse.json(
        { error: 'Failed to create payment gateway' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment gateway creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
