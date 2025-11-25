'use client';

import { useEffect, useState } from 'react';

/**
 * Simple test page to verify fetch works
 * Navigate to /test-fetch to see if basic fetch works
 */
export default function TestFetchPage() {
  const [results, setResults] = useState<{
    basicFetch: string;
    healthApi: string;
    productsApi: string;
  }>({
    basicFetch: 'Testing...',
    healthApi: 'Testing...',
    productsApi: 'Testing...',
  });

  useEffect(() => {
    const testFetch = async () => {
      // Test 1: Basic fetch
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (res.ok) {
          setResults(prev => ({ ...prev, basicFetch: '✅ Basic fetch works!' }));
        } else {
          setResults(prev => ({ ...prev, basicFetch: `❌ Status: ${res.status}` }));
        }
      } catch (error) {
        setResults(prev => ({ 
          ...prev, 
          basicFetch: `❌ Error: ${error instanceof Error ? error.message : String(error)}` 
        }));
      }

      // Test 2: Health API
      try {
        const res = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setResults(prev => ({ ...prev, healthApi: `✅ Health API works! ${JSON.stringify(data)}` }));
        } else {
          setResults(prev => ({ ...prev, healthApi: `❌ Status: ${res.status}` }));
        }
      } catch (error) {
        setResults(prev => ({ 
          ...prev, 
          healthApi: `❌ Error: ${error instanceof Error ? error.message : String(error)}` 
        }));
      }

      // Test 3: Products API
      try {
        const res = await fetch('/api/admin/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setResults(prev => ({ 
            ...prev, 
            productsApi: `✅ Products API works! Found ${data.total || 0} products` 
          }));
        } else {
          const errorText = await res.text();
          setResults(prev => ({ 
            ...prev, 
            productsApi: `❌ Status: ${res.status}, Error: ${errorText.substring(0, 100)}` 
          }));
        }
      } catch (error) {
        setResults(prev => ({ 
          ...prev, 
          productsApi: `❌ Error: ${error instanceof Error ? error.message : String(error)}` 
        }));
      }
    };

    // Wait a bit for page to be ready
    setTimeout(testFetch, 500);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Fetch API Test Page</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Test 1: Basic Fetch (External API)</h2>
        <p>{results.basicFetch}</p>
      </div>

      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Test 2: Health API (/api/health)</h2>
        <p>{results.healthApi}</p>
      </div>

      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Test 3: Products API (/api/admin/products)</h2>
        <p>{results.productsApi}</p>
      </div>

      <div style={{ 
        background: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>Instructions:</h3>
        <ul>
          <li>If Test 1 fails: Your browser doesn't support fetch or has network issues</li>
          <li>If Test 2 fails: The health endpoint isn't working</li>
          <li>If Test 3 fails: The products API has an issue</li>
          <li>Check the browser console (F12) for detailed error messages</li>
        </ul>
      </div>
    </div>
  );
}

