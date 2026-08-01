import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const VALID_ROLES = ["instructor", "student", "parent", "admin"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login — no guard needed
  if (pathname === "/admin/login") return NextResponse.next();

  // Auth page — no guard needed
  if (pathname === "/auth") return NextResponse.next();

  // Dashboard routes require a role
  if (pathname.startsWith("/dashboard")) {
    const roleCookie = request.cookies.get("hive-role")?.value;
    const roleParam = request.nextUrl.searchParams.get("role");

    // If role cookie exists, enforce it (ignore query param manipulation)
    if (
      roleCookie &&
      VALID_ROLES.includes(roleCookie as (typeof VALID_ROLES)[number])
    ) {
      // Rewrite the query param to match the cookie so client code is consistent
      if (roleParam !== roleCookie) {
        const url = request.nextUrl.clone();
        url.searchParams.set("role", roleCookie);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // If no cookie, use query param as fallback and set cookie
    if (
      roleParam &&
      VALID_ROLES.includes(roleParam as (typeof VALID_ROLES)[number])
    ) {
      const response = NextResponse.next();
      response.cookies.set("hive-role", roleParam, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
      return response;
    }

    // No valid role — redirect to auth
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
