'use client';

import { use, useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function TestHeaderFixPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [documentDir, setDocumentDir] = useState<string>('');
  const [bodyDir, setBodyDir] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocumentDir(document.documentElement.dir);
      setBodyDir(document.body.dir);
    }
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Header Fix Test</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Settings</h2>
            <div className="space-y-2">
              <p><strong>Locale:</strong> {locale}</p>
              <p><strong>Document Direction:</strong> {documentDir}</p>
              <p><strong>Body Direction:</strong> {bodyDir}</p>
              <p><strong>Expected:</strong> Both should be "ltr" for consistent layout</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-green-900 mb-3">✅ Header Should Now:</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-800">
              <li>Look identical in all languages</li>
              <li>Have logo on the left, search in center, icons on right</li>
              <li>Not change layout when switching languages</li>
              <li>Only translate text content, not layout</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">🧪 Test Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to Site Preferences (globe icon in header)</li>
              <li>Switch between English, Arabic, Turkish, etc.</li>
              <li>Observe that header layout stays exactly the same</li>
              <li>Only text content should change, not positioning</li>
              <li>Check that Document Direction and Body Direction show "ltr"</li>
            </ol>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
