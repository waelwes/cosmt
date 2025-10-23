'use client';

import { useEffect, useContext } from 'react';
import { UnifiedLanguageContext } from '../../contexts/UnifiedLanguageContext';

export function HTMLAttributes() {
  const context = useContext(UnifiedLanguageContext);
  
  // Don't render if context is not available yet
  if (!context) {
    return null;
  }

  const { language, direction } = context;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = 'ltr'; // Always use LTR for layout
      document.body.dir = 'ltr'; // Always use LTR for layout
      
      // Add/remove RTL class for CSS targeting
      document.body.classList.remove('ltr', 'rtl');
      document.body.classList.add('ltr'); // Always use LTR for layout
      
      console.log(`HTMLAttributes: Set lang=${language}, dir=ltr (forced)`);
    }
  }, [language, direction]);

  return null;
}
