import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { User } from "@/types";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const user = session?.user as User | undefined;
  const path = request.nextUrl.pathname;

  console.log(
    `[MIDDLEWARE] Path: ${path} | User: ${user?.email || "Guest"} | Role: ${user?.role || "None"}`,
  );

  // Public routes that don't need auth
  const isPublicRoute =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api/public");

  // Protected routes logic
  if (!user && !isPublicRoute) {
    // Redirect to login if not authenticated and trying to access protected route
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle root path
  if (path === "/") {
    if (user) {
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (
    user &&
    (path === "/login" || path === "/register" || path.startsWith("/auth"))
  ) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Admin route protection
  if (user && path.startsWith("/admin")) {
    if (user.role !== "admin") {
      // Not admin? Redirect to user home
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
