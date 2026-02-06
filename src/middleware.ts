import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/procurement") ||
    pathname.startsWith("/settings");
  const isLoginPage = pathname === LOGIN_ROUTE;

  if (isProtectedRoute && !session) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_ROUTE;
    return NextResponse.redirect(url);
  }

  if (isLoginPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
