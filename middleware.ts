import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value; // Assuming you set this on login

  const url = req.nextUrl;

  // Redirect root to login if not authenticated
  if (url.pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Existing protected paths logic
  const protectedPaths = ['/dashboard', '/my-students', '/students', '/subjects'];
  if (protectedPaths.some(path => url.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (token && (url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/my-students/:path*', '/students/:path*', '/subjects/:path*', '/login', '/signup'],
};