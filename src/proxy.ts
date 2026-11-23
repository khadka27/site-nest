import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "sitenest-default-ultra-secure-key-32-chars-minimum!!"
);

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes (unless custom routing needed)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract base domain
  const currentHost = hostname.replace(/:\d+$/, ""); // remove port
  const baseDomain = (process.env.BASE_DOMAIN || "localhost").replace(/:\d+$/, "");
  const websiteBaseDomain = (process.env.WEBSITE_BASE_DOMAIN || "").replace(/:\d+$/, "");

  // Subdomain detection
  let subdomain: string | null = null;

  if (currentHost.endsWith(baseDomain) && currentHost !== baseDomain) {
    const candidate = currentHost.replace(`.${baseDomain}`, "");
    if (candidate && !["www", "admin", "api", "app"].includes(candidate)) {
      subdomain = candidate;
    }
  } else if (websiteBaseDomain && currentHost.endsWith(websiteBaseDomain) && currentHost !== websiteBaseDomain) {
    const candidate = currentHost.replace(`.${websiteBaseDomain}`, "");
    if (candidate) {
      subdomain = candidate;
    }
  }

  // If subdomain is detected, rewrite to static site serving route /s/[subdomain]/...
  if (subdomain) {
    const path = url.pathname === "/" ? "" : url.pathname;
    return NextResponse.rewrite(new URL(`/s/${subdomain}${path}`, req.url));
  }

  const token = req.cookies.get("sitenest_token")?.value;
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isAdminPath = url.pathname.startsWith("/admin");

  // Decode JWT to check if user has admin privileges
  let userIsAdmin = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN")) {
        userIsAdmin = true;
      }
    } catch {
      // Invalid or expired token
    }
  }

  // Admin cannot access public pages like Home (/), Products, About, Contact
  // Redirect logged-in admins straight to the Admin Control Center (/admin)
  const isPublicPage =
    url.pathname === "/" ||
    url.pathname === "/products" ||
    url.pathname.startsWith("/products/") ||
    url.pathname === "/about" ||
    url.pathname === "/contact" ||
    url.pathname === "/pricing" ||
    url.pathname === "/faq" ||
    url.pathname === "/sites" ||
    url.pathname.startsWith("/sites/") ||
    url.pathname === "/login" ||
    url.pathname === "/register";

  if (userIsAdmin && isPublicPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Path-based auth guards for dashboard and admin
  if ((isDashboard || isAdminPath) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}