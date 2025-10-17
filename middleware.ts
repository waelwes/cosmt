import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if admin is logged in (in a real app, use proper session management)
    const adminLoggedIn = request.cookies.get('adminLoggedIn')?.value === 'true';
    
    if (!adminLoggedIn) {
      // Redirect to main signin page
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
