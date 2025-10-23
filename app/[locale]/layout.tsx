import { notFound } from 'next/navigation';
import { LocaleProvider } from '../../contexts/LocaleProvider';

const SUPPORTED_LOCALES = ['en', 'ar', 'tr', 'de', 'fr', 'es'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}
