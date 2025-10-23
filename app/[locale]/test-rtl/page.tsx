'use client';

import { use } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRTL } from '@/contexts/UnifiedLanguageContext';

export default function TestRTLPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { isRTL } = useRTL();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 RTL Header Test</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Settings</h2>
            <div className="space-y-2">
              <p><strong>Locale:</strong> {locale}</p>
              <p><strong>RTL Mode:</strong> {isRTL ? 'Yes (Right-to-Left)' : 'No (Left-to-Right)'}</p>
              <p><strong>Text Direction:</strong> {isRTL ? 'rtl' : 'ltr'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Header Elements Test</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Top Promotion Bar</h3>
                <p className="text-sm text-gray-600">
                  Check if the promotional text scrolls in the correct direction and the Site Preferences button is positioned correctly.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Main Navigation</h3>
                <p className="text-sm text-gray-600">
                  Check if the logo, search bar, and navigation items are positioned correctly for RTL.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Right Side Icons</h3>
                <p className="text-sm text-gray-600">
                  Check if the cart, wishlist, and user menu icons are positioned correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Test RTL</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to Site Preferences (globe icon in top bar)</li>
              <li>Change language to Arabic (ar) or Hebrew (he)</li>
              <li>Observe the header layout changes</li>
              <li>Check that all elements are properly aligned for RTL</li>
              <li>Test the mobile menu by clicking the hamburger icon</li>
            </ol>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-3">Expected RTL Behavior</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
              <li>Logo should be on the right side</li>
              <li>Search bar should be centered</li>
              <li>Navigation menu should read right-to-left</li>
              <li>Cart/Wishlist/User icons should be on the left side</li>
              <li>Mobile menu should open from the right</li>
              <li>All text should be right-aligned</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
