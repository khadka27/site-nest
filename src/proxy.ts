import { NextRequest, NextResponse } from "next/server";

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

export function proxy(req: NextRequest) {
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

  // Path-based auth guards for dashboard and admin
  const token = req.cookies.get("sitenest_token")?.value;
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isAdmin = url.pathname.startsWith("/admin");

  if ((isDashboard || isAdmin) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
