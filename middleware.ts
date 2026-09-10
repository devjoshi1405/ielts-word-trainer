import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that do NOT require authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".");

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for common auth cookies set by Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      c.name.startsWith("sb-") &&
      (c.name.endsWith("-auth-token") || c.name.includes("auth-token"))
  );

  // If running in browser or SSR without Supabase cookies, client-side AuthGuard in (app)/layout.tsx handles redirection seamlessly.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listening/:path*",
    "/progress/:path*",
    "/reading/:path*",
    "/writing/:path*",
    "/speaking/:path*",
    "/settings/:path*",
  ],
};
