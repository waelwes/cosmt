'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/').filter(segment => segment !== 'admin' && segment !== '');
  
  const breadcrumbItems = [
    { name: 'Dashboard', href: '/admin' }
  ];

  // Add dynamic breadcrumb items based on current path
  let currentPath = '/admin';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Convert segment to readable name
    const readableName = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbItems.push({
      name: readableName,
      href: isLast ? pathname : currentPath
    });
  });

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 py-3">
        <Link
          href="/admin"
          className="text-gray-400 hover:text-gray-600"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
