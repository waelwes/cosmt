'use client';

import { useState, use } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function TestTranslationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('Hydrating Face Serum');
  const [lang, setLang] = useState('ar');

  const testTranslation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-translation?text=${encodeURIComponent(text)}&lang=${lang}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Translation Test</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to Translate
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter text to translate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Language
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ar">Arabic (ar)</option>
                  <option value="tr">Turkish (tr)</option>
                  <option value="de">German (de)</option>
                  <option value="fr">French (fr)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="it">Italian (it)</option>
                  <option value="nl">Dutch (nl)</option>
                  <option value="ja">Japanese (ja)</option>
                  <option value="zh">Chinese (zh)</option>
                  <option value="hi">Hindi (hi)</option>
                  <option value="pt">Portuguese (pt)</option>
                  <option value="ru">Russian (ru)</option>
                  <option value="ko">Korean (ko)</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={testTranslation}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Testing...' : 'Test Translation'}
            </button>
          </div>

          {results && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Original:</strong> {results.original}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Target Language:</strong> {results.targetLanguage}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Timestamp:</strong> {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(results.services).map(([service, data]: [string, any]) => (
                  <div key={service} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 capitalize">
                      {service} {data.success ? '✅' : '❌'}
                    </h3>
                    
                    {data.success ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Translation:</strong> {data.translation}
                        </p>
                        <p className="text-xs text-gray-500">
                          <strong>Source:</strong> {data.source}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">
                        <strong>Error:</strong> {data.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                <p className="text-sm text-gray-600">
                  {Object.values(results.services).filter((s: any) => s.success).length} out of{' '}
                  {Object.keys(results.services).length} services are working.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
