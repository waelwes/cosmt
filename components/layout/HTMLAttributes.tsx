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
      document.documentElement.dir = direction;
      document.body.dir = direction;
      
      // Add/remove RTL class for CSS targeting
      document.body.classList.remove('ltr', 'rtl');
      document.body.classList.add(direction);
      
      console.log(`HTMLAttributes: Set lang=${language}, dir=${direction}`);
    }
  }, [language, direction]);

  return null;
}
