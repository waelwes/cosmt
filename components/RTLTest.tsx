'use client';

import React from 'react';
import { useLanguage } from '../contexts/UnifiedLanguageContext';

export function RTLTest() {
  const { direction, currentLanguage } = useLanguage();

  return (
    <div 
      className="bg-yellow-100 p-4 rounded border-2 border-yellow-400 mb-4"
      dir={direction}
      style={{ 
        direction: direction,
        textAlign: direction === 'rtl' ? 'right' : 'left'
      }}
    >
      <h3 className="text-lg font-bold mb-2">RTL Layout Test</h3>
      <div className="space-y-2">
        <div><strong>Current Language:</strong> {currentLanguage}</div>
        <div><strong>Direction:</strong> {direction}</div>
        <div><strong>Document Direction:</strong> {typeof document !== 'undefined' ? document.documentElement.dir : 'N/A'}</div>
        <div><strong>Body Direction:</strong> {typeof document !== 'undefined' ? document.body.dir : 'N/A'}</div>
        
        <div className="mt-4 p-2 bg-white rounded border">
          <div className="flex justify-between">
            <span className="bg-red-100 px-2 py-1 rounded">Left Side</span>
            <span className="bg-blue-100 px-2 py-1 rounded">Right Side</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            This should flip in RTL mode - Left should become Right
          </div>
        </div>
        
        <div className="mt-2 p-2 bg-white rounded border">
          <div className="flex space-x-2">
            <span className="bg-green-100 px-2 py-1 rounded">Item 1</span>
            <span className="bg-yellow-100 px-2 py-1 rounded">Item 2</span>
            <span className="bg-purple-100 px-2 py-1 rounded">Item 3</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            These items should reverse order in RTL
          </div>
        </div>
        
        <div className="mt-2 p-2 bg-white rounded border">
          <div className="text-right">
            <span>This text should be right-aligned in RTL</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 flex-wrap">
          <button 
            onClick={() => {
              document.documentElement.dir = 'rtl';
              document.body.dir = 'rtl';
              document.body.className = document.body.className.replace(/rtl|ltr/g, '') + ' rtl';
              console.log('Forced RTL mode');
              console.log('Document dir:', document.documentElement.dir);
              console.log('Body dir:', document.body.dir);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
          >
            Force RTL
          </button>
          <button 
            onClick={() => {
              document.documentElement.dir = 'ltr';
              document.body.dir = 'ltr';
              document.body.className = document.body.className.replace(/rtl|ltr/g, '') + ' ltr';
              console.log('Forced LTR mode');
              console.log('Document dir:', document.documentElement.dir);
              console.log('Body dir:', document.body.dir);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
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
              console.log('Language change event dispatched');
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded text-xs"
          >
            Test Arabic
          </button>
          <button 
            onClick={() => {
              window.location.reload();
            }}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs"
          >
            Reload Page
          </button>
        </div>
        
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <div><strong>CSS Test:</strong> Check if RTL styles are applied</div>
          <div className="mt-2 flex space-x-2">
            <span className="bg-red-200 px-1">1</span>
            <span className="bg-blue-200 px-1">2</span>
            <span className="bg-green-200 px-1">3</span>
          </div>
          <div className="mt-1 text-gray-600">
            In RTL: 3, 2, 1 (reversed order)
          </div>
        </div>
      </div>
    </div>
  );
}
