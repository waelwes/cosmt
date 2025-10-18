'use client';

import React from 'react';
import { useLanguage } from '../contexts/UnifiedLanguageContext';

export function LanguageTest() {
  const { currentLanguage, setCurrentLanguage, t, direction } = useLanguage();

  return (
    <div 
      className="bg-red-100 p-4 rounded border-2 border-red-400 mb-4"
      dir={direction}
      style={{ direction: direction }}
    >
      <h3 className="text-lg font-bold mb-2">Language Context Test</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div><strong>Current Language:</strong> {currentLanguage}</div>
          <div><strong>Direction:</strong> {direction}</div>
          <div><strong>Admin Dashboard:</strong> {t.adminDashboard}</div>
          <div><strong>Total Sales:</strong> {t.totalSales}</div>
        </div>
        <div>
          <button 
            onClick={() => setCurrentLanguage('ar')}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs mr-2"
          >
            Set Arabic
          </button>
          <button 
            onClick={() => setCurrentLanguage('en')}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Set English
          </button>
        </div>
      </div>
    </div>
  );
}
