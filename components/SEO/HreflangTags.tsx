'use client';

import Head from 'next/head';

const SUPPORTED_LOCALES = ['en', 'ar', 'tr', 'de', 'fr', 'es'];
const BASE_URL = 'https://www.cosmt.com';

interface HreflangTagsProps {
  currentLocale: string;
  currentPath?: string;
}

export default function HreflangTags({ currentLocale, currentPath = '' }: HreflangTagsProps) {
  // Remove locale from path if it exists
  const cleanPath = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
  
  return (
    <Head>
      {/* Hreflang tags for each supported locale */}
      {SUPPORTED_LOCALES.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          href={`${BASE_URL}/${locale}${cleanPath}`}
          hrefLang={locale}
        />
      ))}
      
      {/* X-default hreflang (usually points to English) */}
      <link
        rel="alternate"
        href={`${BASE_URL}/en${cleanPath}`}
        hrefLang="x-default"
      />
      
      {/* Canonical URL */}
      <link
        rel="canonical"
        href={`${BASE_URL}/${currentLocale}${cleanPath}`}
      />
    </Head>
  );
}
