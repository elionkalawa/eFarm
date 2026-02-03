import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes that don't need auth
  const isPublicRoute =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/auth");

  // Protected routes logic
  if (!user && !isPublicRoute) {
    // Redirect to login if not authenticated and trying to access protected route
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Special handling for the root path
  if (path === "/") {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard or appropriate page
  if (user && (path === "/login" || path === "/register")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Admin route protection
  if (user && path.startsWith("/admin")) {
    // Check role in public.profiles
    // Note: In middleware, we can't easily query the database directly with the same client efficiently for every request
    // without potentially slowing things down, but we can check metadata or do a quick query.
    // The requirement says: "Roles MUST Be read from JWT claims or fetched securely".
    // Checking database in middleware is possible.

    // Check for user role in metadata first (if synced) or fetch from DB
    // Let's safe fetch from DB.
    // We already have the supabase client.

    // However, avoid too many DB calls.
    // Ideally role is in user_metadata if we want speed.
    // But requirement says "Never be hardcoded in frontend logic" and "Live in the database".
    // We can fetch profile.

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      // Not admin? Redirect to user home
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return response;
}
