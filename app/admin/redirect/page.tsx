'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div 
        className="animate-spin h-32 w-32 border-4 border-gray-200 border-t-green-600" 
        style={{
          borderRadius: '50%',
          borderStyle: 'solid',
          borderWidth: '4px',
          borderColor: '#e5e7eb transparent #e5e7eb #e5e7eb',
          borderTopColor: '#059669'
        }}
      ></div>
    </div>
  );
}
