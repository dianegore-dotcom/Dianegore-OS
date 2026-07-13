import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function responseWithCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const hasUser = Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = pathname.startsWith("/login") || pathname.startsWith("/auth");

  if (!hasUser && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return responseWithCookies(NextResponse.redirect(url), supabaseResponse);
  }

  if (hasUser && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return responseWithCookies(NextResponse.redirect(url), supabaseResponse);
  }

  return supabaseResponse;
}
