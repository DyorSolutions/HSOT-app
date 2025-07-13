import { NextRequest, NextResponse } from "next/server";

export function middleware (req: NextRequest) {
  // Assume you set a session cookie on login, e.g., in handleLogin: document.cookie = 'authToken = ' + await user.getIdToken();'
  const token = req.cookies.get('authToken')?.value;

  const protectedPaths = ['/dashboard', '/my-students', '/students', '/subjects'];
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-students/:path*', '/students/:path*', '/subjects/:path*', '/login', '/signup']
};