import { NextRequest, NextResponse } from "next/server";

const SESSION_TOKEN_NAMES = [
  "authjs.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "__Secure-next-auth.session-token",
];

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_TOKEN_NAMES.some((name) => request.cookies.has(name));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin") {
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
