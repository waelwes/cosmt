'use client';

import { useState, useEffect } from 'react';

/**
 * Diagnostic component to test API connectivity
 * Use this to verify your API routes are working
 */
export function ApiConnectionTest() {
  const [testResults, setTestResults] = useState<{
    health: 'pending' | 'success' | 'error';
    products: 'pending' | 'success' | 'error';
    healthError?: string;
    productsError?: string;
  }>({
    health: 'pending',
    products: 'pending',
  });

  useEffect(() => {
    const runTests = async () => {
      // Test health endpoint
      try {
        const healthResponse = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (healthResponse.ok) {
          const data = await healthResponse.json();
          console.log('✅ Health check passed:', data);
          setTestResults(prev => ({ ...prev, health: 'success' }));
        } else {
          throw new Error(`Health check failed with status ${healthResponse.status}`);
        }
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setTestResults(prev => ({
          ...prev,
          health: 'error',
          healthError: error instanceof Error ? error.message : String(error),
        }));
      }

      // Test products endpoint
      try {
        const productsResponse = await fetch('/api/admin/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (productsResponse.ok) {
          const data = await productsResponse.json();
          console.log('✅ Products API passed:', data);
          setTestResults(prev => ({ ...prev, products: 'success' }));
        } else {
          const errorText = await productsResponse.text();
          throw new Error(`Products API failed with status ${productsResponse.status}: ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Products API failed:', error);
        setTestResults(prev => ({
          ...prev,
          products: 'error',
          productsError: error instanceof Error ? error.message : String(error),
        }));
      }
    };

    runTests();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3 style={{ marginTop: 0 }}>API Connection Test</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Health Endpoint:</strong>{' '}
        <span style={{ 
          color: testResults.health === 'success' ? 'green' : testResults.health === 'error' ? 'red' : 'orange' 
        }}>
          {testResults.health === 'pending' && '⏳ Testing...'}
          {testResults.health === 'success' && '✅ Success'}
          {testResults.health === 'error' && `❌ Failed: ${testResults.healthError}`}
        </span>
      </div>
      <div>
        <strong>Products API:</strong>{' '}
        <span style={{ 
          color: testResults.products === 'success' ? 'green' : testResults.products === 'error' ? 'red' : 'orange' 
        }}>
          {testResults.products === 'pending' && '⏳ Testing...'}
          {testResults.products === 'success' && '✅ Success'}
          {testResults.products === 'error' && `❌ Failed: ${testResults.productsError}`}
        </span>
      </div>
      {testResults.health === 'error' && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#fee', borderRadius: '4px' }}>
          <strong>⚠️ Server may not be running!</strong>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Run: <code>npm run dev</code>
          </p>
        </div>
      )}
    </div>
  );
}

