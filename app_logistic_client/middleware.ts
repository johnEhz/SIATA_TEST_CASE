import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('logistic_access_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/client/shipments', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (!token && !isAuthPage && pathname !== '/') {
    if (pathname.includes('.')) return NextResponse.next();
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/client/shipments', request.url));
  }


  return NextResponse.next();
}

// middleware a todas las rutas excepto las internas de Next.js
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
