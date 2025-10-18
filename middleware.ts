import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disable admin route protection for debugging
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route accessed:', request.nextUrl.pathname);
    // Allow all admin routes for now
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
