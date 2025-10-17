import { NextRequest, NextResponse } from 'next/server';
import { IyzicoPayment } from '../../../../lib/payment';
import { getPaymentConfig } from '../../../../config/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, token } = body;

    if (!paymentId || !token) {
      return NextResponse.json(
        { error: 'Missing paymentId or token' },
        { status: 400 }
      );
    }

    // Initialize payment gateway
    const config = getPaymentConfig();
    const paymentGateway = new IyzicoPayment(config);

    // Verify payment
    const result = await paymentGateway.verifyPayment(paymentId, token);

    if (result.success) {
      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Log the transaction
      
      console.log('Payment verified successfully:', {
        paymentId: result.paymentId,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        paymentId: result.paymentId,
        message: 'Payment verified successfully'
      });
    } else {
      console.error('Payment verification failed:', result.error);
      
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
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Unable to process payment callback'
      },
      { status: 500 }
    );
  }
}
