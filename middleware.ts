import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { auth } from "@/auth";
import { e2eAuthCookieName } from "@/features/security/google-authentication/auth";

const publicPrefixes = ["/api/auth"];
const publicPaths = ["/login"];

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname) || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

const authMiddleware = auth((request) => {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (process.env.E2E_TEST_AUTH === "true" && request.cookies.get(e2eAuthCookieName)?.value === "true") {
    return NextResponse.next();
  }

  if (request.auth) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
});

const runAuthMiddleware = authMiddleware as unknown as (
  request: NextRequest,
  event: NextFetchEvent
) => NextResponse | Response | Promise<NextResponse | Response>;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (process.env.E2E_TEST_AUTH === "true" && request.cookies.get(e2eAuthCookieName)?.value === "true") {
    return NextResponse.next();
  }

  return runAuthMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
