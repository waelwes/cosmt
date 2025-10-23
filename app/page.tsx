import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  // Get locale from cookies or default to 'en'
  const cookieStore = cookies();
  const locale = cookieStore.get('cosmt-locale')?.value || 'en';
  
  // Redirect to localized version
  redirect(`/${locale}`);
}