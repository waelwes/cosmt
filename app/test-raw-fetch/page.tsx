'use client';

import { useEffect, useState } from 'react';

/**
 * Ultra-minimal fetch test - no hooks, no complexity
 * This tests if raw fetch works at all
 */
export default function TestRawFetchPage() {
  const [result, setResult] = useState<string>('Not tested yet');

  useEffect(() => {
    console.log('🧪 Starting raw fetch test...');
    console.log('🧪 Window available:', typeof window !== 'undefined');
    console.log('🧪 Fetch available:', typeof fetch !== 'undefined');
    console.log('🧪 Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
    
    const testFetch = async () => {
      try {
        console.log('🧪 Attempting to fetch /api/health...');
        const url = '/api/health';
        console.log('🧪 Fetch URL:', url);
        console.log('🧪 Full URL would be:', typeof window !== 'undefined' ? `${window.location.origin}${url}` : url);
        
        const response = await fetch(url);
        console.log('🧪 Response received:', response);
        console.log('🧪 Response status:', response.status);
        console.log('🧪 Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🧪 Response data:', data);
          setResult(`✅ SUCCESS! Status: ${response.status}, Data: ${JSON.stringify(data)}`);
        } else {
          setResult(`❌ FAILED! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('🧪 Fetch error:', error);
        console.error('🧪 Error type:', typeof error);
        console.error('🧪 Error name:', error instanceof Error ? error.name : 'N/A');
        console.error('🧪 Error message:', error instanceof Error ? error.message : String(error));
        console.error('🧪 Error stack:', error instanceof Error ? error.stack : 'N/A');
        setResult(`❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    // Wait for page to be ready
    if (document.readyState === 'complete') {
      setTimeout(testFetch, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(testFetch, 100);
      });
    }
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>Raw Fetch Test</h1>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <strong>Result:</strong>
        <div style={{ marginTop: '10px', padding: '10px', background: 'white', borderRadius: '4px' }}>
          {result}
        </div>
      </div>
      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
        <strong>Check the browser console (F12) for detailed logs</strong>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          Look for messages starting with 🧪 to see exactly what's happening
        </p>
      </div>
    </div>
  );
}

