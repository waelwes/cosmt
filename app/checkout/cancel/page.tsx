'use client';

import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ödeme İptal Edildi
            </h1>
            <p className="text-lg text-gray-600">
              Ödeme işlemi iptal edildi. Siparişiniz kaydedilmedi.
            </p>
          </div>

          {/* Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ne Oldu?
            </h2>
            <p className="text-gray-600 mb-4">
              Ödeme işlemi sırasında bir sorun oluştu veya işlemi iptal ettiniz. 
              Siparişiniz henüz tamamlanmadı ve ücretlendirilmediniz.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Not:</strong> Sepetinizdeki ürünler korunmuştur. 
                İstediğiniz zaman tekrar ödeme yapabilirsiniz.
              </p>
            </div>
          </div>

          {/* Possible Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Olası Nedenler
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Ödeme sayfasını kapatmanız</li>
              <li>• İnternet bağlantısı sorunu</li>
              <li>• Kredi kartı bilgilerinde hata</li>
              <li>• Banka tarafından işlem reddedilmesi</li>
              <li>• Sayfa zaman aşımı</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/checkout" className="flex-1">
              <Button className="w-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
            </Link>
            <Link href="/cart" className="flex-1">
              <Button variant="outline" className="w-full">
                Sepeti Görüntüle
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Sorun devam ederse bizimle iletişime geçin
            </p>
            <div className="text-sm text-gray-400">
              <p>E-posta: info@cosmat.com</p>
              <p>Telefon: +90 (212) 555-0123</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
