'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-32 w-32">
          <img
            src="/images/logos/COSMT.png"
            alt="COSMT Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
