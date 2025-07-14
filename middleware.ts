import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const url = req.nextUrl;

  if (url.pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const protectedPaths = ['/dashboard', '/my-students', '/students', '/subjects'];
  if (protectedPaths.some(path => url.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    try {
      await adminAuth.verifyIdToken(token);
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (token && (url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/my-students/:path*', '/students/:path*', '/subjects/:path*', '/login', '/signup'],
};