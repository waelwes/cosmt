'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, Package, Mail } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment details from URL parameters
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');
    
    if (paymentId && orderId) {
      setOrderDetails({
        paymentId,
        orderId,
        timestamp: new Date().toISOString()
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h1>
            <p className="text-gray-600">Your order is being processed</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12" style={{backgroundColor: '#fbfbfb'}}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Order Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Your order has been placed successfully and payment has been processed.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Order Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium text-gray-900">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium text-gray-900">{orderDetails.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(orderDetails.timestamp).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              What's Next?
            </h3>
            <ul className="space-y-2 text-green-800">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Order confirmation email sent
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Your order is being prepared
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Shipping details will be sent via email
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-600" />
              Contact Us
            </h3>
            <p className="text-gray-600 mb-2">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="text-sm text-gray-500">
              <p>Email: info@cosmat.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-lg font-semibold transition-colors duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-lg py-3 rounded-lg transition-colors duration-200">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
