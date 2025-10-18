'use client';

import React, { useEffect, useState } from 'react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

export function RTLDebug() {
  const { language, direction, isRTL, isArabic } = useRTL();
  const [domAttributes, setDomAttributes] = useState({
    htmlLang: '',
    htmlDir: '',
    bodyDir: '',
    bodyClasses: ''
  });

  useEffect(() => {
    const updateDomAttributes = () => {
      setDomAttributes({
        htmlLang: document.documentElement.lang,
        htmlDir: document.documentElement.dir,
        bodyDir: document.body.dir,
        bodyClasses: document.body.className
      });
    };

    updateDomAttributes();
    
    // Update every second to see changes
    const interval = setInterval(updateDomAttributes, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">RTL Debug Info</h3>
      <div className="space-y-1">
        <div>Context Language: {language}</div>
        <div>Context Direction: {direction}</div>
        <div>isRTL: {isRTL.toString()}</div>
        <div>isArabic: {isArabic.toString()}</div>
        <div>HTML Lang: {domAttributes.htmlLang}</div>
        <div>HTML Dir: {domAttributes.htmlDir}</div>
        <div>Body Dir: {domAttributes.bodyDir}</div>
        <div>Body Classes: {domAttributes.bodyClasses}</div>
      </div>
    </div>
  );
}
