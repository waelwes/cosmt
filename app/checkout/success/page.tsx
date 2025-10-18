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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ödeme Başarılı! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Siparişiniz başarıyla alındı ve ödeme işlemi tamamlandı.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Sipariş Detayları
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sipariş No:</span>
                  <span className="font-medium text-gray-900">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ödeme No:</span>
                  <span className="font-medium text-gray-900">{orderDetails.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarih:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(orderDetails.timestamp).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Sıradaki Adımlar
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Sipariş onay e-postası gönderildi
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Siparişiniz hazırlanmaya başlandı
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Kargo bilgileri e-posta ile gönderilecek
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-600" />
              İletişim
            </h3>
            <p className="text-gray-600 mb-2">
              Siparişinizle ilgili herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
            </p>
            <div className="text-sm text-gray-500">
              <p>E-posta: info@cosmat.com</p>
              <p>Telefon: +90 (212) 555-0123</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
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
