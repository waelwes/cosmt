'use client';

import { useLanguage } from '../../contexts/UnifiedLanguageContext';

export default function LanguageDebug() {
  const { currentLanguage, direction, languages } = useLanguage();
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg z-50 text-xs">
      <div>Current Language: {currentLanguage}</div>
      <div>Direction: {direction}</div>
      <div>Available: {languages.map(l => l.code).join(', ')}</div>
      <div>Arabic Direction: {languages.find(l => l.code === 'ar')?.direction}</div>
    </div>
  );
}
