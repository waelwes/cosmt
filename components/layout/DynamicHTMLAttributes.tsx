'use client';

import { useEffect, useState } from 'react';
import { useLanguageSwitch } from '../../hooks/useLanguageSwitch';

export default function DynamicHTMLAttributes() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the unified language system
  const { currentLanguage, direction, mounted: languageMounted } = useLanguageSwitch();

  useEffect(() => {
    if (mounted && languageMounted && typeof window !== 'undefined') {
      console.log('DynamicHTMLAttributes: Updating HTML attributes', {
        lang: currentLanguage,
        dir: direction
      });
      
      // Update HTML attributes
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = 'ltr'; // Always use LTR for layout
      
      // Update body attributes with delay to ensure CSS applies
      setTimeout(() => {
        document.body.dir = 'ltr'; // Always use LTR for layout
        document.body.className = document.body.className.replace(/rtl|ltr/g, '') + ` ltr`;
        
        console.log('DynamicHTMLAttributes: HTML attributes updated successfully', {
          htmlDir: document.documentElement.dir,
          bodyDir: document.body.dir,
          bodyClass: document.body.className
        });
      }, 0);
    }
  }, [mounted, languageMounted, currentLanguage, direction]);

  return null; // This component doesn't render anything
}
