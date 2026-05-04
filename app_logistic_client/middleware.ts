import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("logistic_access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");

  if (pathname === "/") {
    const redirectUrl = token ? "/client/shipments" : "/auth/login";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/client/shipments", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Ignora las rutas de la API, archivos estáticos de Next.js,
     * optimización de imágenes, favicon, y de forma segura 
     * cualquier archivo con extensión conocida (imágenes, fuentes, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$).*)",
  ],
};