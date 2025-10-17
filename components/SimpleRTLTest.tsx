'use client';

import React, { useState, useEffect } from 'react';

export function SimpleRTLTest() {
  const [isRTL, setIsRTL] = useState(false);
  const [documentDir, setDocumentDir] = useState('ltr');

  useEffect(() => {
    const checkDirection = () => {
      const dir = document.documentElement.dir || 'ltr';
      setDocumentDir(dir);
      setIsRTL(dir === 'rtl');
    };
    
    checkDirection();
    
    // Check every second
    const interval = setInterval(checkDirection, 1000);
    return () => clearInterval(interval);
  }, []);

  const forceRTL = () => {
    document.documentElement.dir = 'rtl';
    document.body.dir = 'rtl';
    document.body.className = document.body.className.replace(/rtl|ltr/g, '') + ' rtl';
    setDocumentDir('rtl');
    setIsRTL(true);
    console.log('Forced RTL - Document dir:', document.documentElement.dir);
  };

  const forceLTR = () => {
    document.documentElement.dir = 'ltr';
    document.body.dir = 'ltr';
    document.body.className = document.body.className.replace(/rtl|ltr/g, '') + ' ltr';
    setDocumentDir('ltr');
    setIsRTL(false);
    console.log('Forced LTR - Document dir:', document.documentElement.dir);
  };

  return (
    <div className="bg-orange-100 p-4 rounded border-2 border-orange-400 mb-4">
      <h3 className="text-lg font-bold mb-2">Simple RTL Test</h3>
      
      <div className="space-y-2 mb-4">
        <div><strong>Document Direction:</strong> {documentDir}</div>
        <div><strong>Is RTL:</strong> {isRTL ? 'Yes' : 'No'}</div>
        <div><strong>Body Classes:</strong> {typeof document !== 'undefined' ? document.body.className : 'N/A'}</div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button 
          onClick={forceRTL}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Force RTL
        </button>
        <button 
          onClick={forceLTR}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Force LTR
        </button>
        <button 
          onClick={() => {
            // Test language switching
            const event = new CustomEvent('languageChanged', { 
              detail: { language: 'ar' } 
            });
            window.dispatchEvent(event);
            console.log('Language change event dispatched for Arabic');
          }}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Test Arabic
        </button>
        <button 
          onClick={() => {
            // Test language switching
            const event = new CustomEvent('languageChanged', { 
              detail: { language: 'en' } 
            });
            window.dispatchEvent(event);
            console.log('Language change event dispatched for English');
          }}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Test English
        </button>
      </div>

      {/* CSS Test */}
      <div className="p-3 bg-gray-100 rounded mb-4">
        <div className="text-sm font-medium mb-2">CSS Test (check if RTL styles are applied):</div>
        <div className="text-xs text-gray-600 mb-2">
          This should change when RTL is applied via CSS
        </div>
        <div 
          className="flex space-x-2"
          style={{ 
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          <div className="bg-red-200 px-1 py-1 rounded text-xs">A</div>
          <div className="bg-blue-200 px-1 py-1 rounded text-xs">B</div>
          <div className="bg-green-200 px-1 py-1 rounded text-xs">C</div>
        </div>
      </div>

      {/* Visual RTL Test */}
      <div className="space-y-4">
        <div className="p-3 bg-white rounded border">
          <div className="text-sm font-medium mb-2">Flex Test (should reverse in RTL):</div>
          <div 
            className="flex space-x-2"
            style={{ 
              direction: isRTL ? 'rtl' : 'ltr',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            <div className="bg-red-200 px-2 py-1 rounded text-xs">1</div>
            <div className="bg-blue-200 px-2 py-1 rounded text-xs">2</div>
            <div className="bg-green-200 px-2 py-1 rounded text-xs">3</div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            RTL should show: 3, 2, 1
          </div>
        </div>

        <div className="p-3 bg-white rounded border">
          <div className="text-sm font-medium mb-2">Text Alignment Test:</div>
          <div 
            className="text-left bg-gray-100 p-2 rounded"
            style={{ 
              direction: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            <div className="text-xs">Left aligned text (should be right in RTL)</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded border">
          <div className="text-sm font-medium mb-2">Justify Between Test:</div>
          <div 
            className="flex justify-between"
            style={{ 
              direction: isRTL ? 'rtl' : 'ltr',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            <span className="bg-yellow-200 px-2 py-1 rounded text-xs">Left</span>
            <span className="bg-purple-200 px-2 py-1 rounded text-xs">Right</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            RTL should swap Left and Right positions
          </div>
        </div>
      </div>
    </div>
  );
}
