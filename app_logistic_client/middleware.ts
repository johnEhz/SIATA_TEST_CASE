import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("logistic_access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");

  if (pathname === "/") {
    const url = request.nextUrl.clone();

    if (token) {
      url.pathname = "/client/shipments";
    } else {
      url.pathname = "/auth/login";
    }

    return NextResponse.redirect(url);
  }

  if (!token && !isAuthPage) {
    if (pathname.includes(".")) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/client/shipments";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};