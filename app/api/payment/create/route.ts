import { NextRequest, NextResponse } from 'next/server';
import { IyzicoPayment, PaymentRequest } from '../../../../lib/payment';
import { getPaymentConfig } from '../../../../config/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['orderId', 'amount', 'items', 'customer', 'billingAddress', 'shippingAddress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      orderId: body.orderId,
      amount: parseFloat(body.amount),
      currency: 'TRY',
      items: body.items,
      customer: body.customer,
      billingAddress: body.billingAddress,
      shippingAddress: body.shippingAddress,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
    };

    // Initialize payment gateway
    const config = getPaymentConfig();
    const paymentGateway = new IyzicoPayment(config);

    // Create payment
    const result = await paymentGateway.createPayment(paymentRequest);

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentId: result.paymentId,
        redirectUrl: result.redirectUrl,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: result.message 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Unable to process payment request'
      },
      { status: 500 }
    );
  }
}
