import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for Next.js internal requests
  if (request.nextUrl.pathname.includes('_next') || 
      request.nextUrl.pathname.includes('_rsc') ||
      request.nextUrl.pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin') {
      // Always allow access to login page without redirect
      // Let the client-side handle authentication check
      return NextResponse.next();
    }

    // Check for authentication token in cookies
    const token = request.cookies.get('adminToken')?.value;
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Basic token validation (check if it's not empty and has proper JWT structure)
    if (token.split('.').length !== 3) {
      // Invalid token format, redirect to login
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('adminToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};