import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  ArrowRight,
  ExternalLink,
  Search,
  Compass,
  CheckCircle2,
  Sparkles as _,
  Eye,
  Layers,
  FolderArchive,
  Zap,
  ShieldCheck,
  Feather,
} from "lucide-react";

export const metadata = {
  title: "SiteNest — Curated Showcase of Handcrafted Static Websites & Portfolios",
  description:
    "Explore a curated index of high-performance static websites, creative agency landing pages, designer portfolios, and bespoke digital experiences deployed live on custom subdomains.",
};

export default async function HomePage() {
  const [showcaseSites, categories] = await Promise.all([
    prisma.website.findMany({
      where: { status: "LIVE" },
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        deployments: {
          where: { status: "LIVE" },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { websites: { where: { status: "LIVE" } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* FULL EXPANSIVE HERO SECTION */}
        <section className="relative overflow-hidden bg-craft-grid py-20 sm:py-28 lg:py-36 border-b border-[#DECBB0] dark:border-[#3D352F]">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Curated Directory Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED]/90 dark:bg-[#24201C]/90 px-4 py-1.5 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm mb-6 backdrop-blur-sm">
              <Compass className="h-3.5 w-3.5 text-[#AEAC78]" />
              <span>Curated Web Directory • Handcrafted Showcase</span>
            </div>

            {/* Main SEO Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6] max-w-4xl mx-auto leading-[1.1]">
              Discover Exceptional Handcrafted Websites & Portfolios
            </h1>

            {/* SEO Subtitle / Value Proposition */}
            <p className="mt-6 text-base sm:text-xl text-[#7A6F68] dark:text-[#B5AAA0] max-w-2xl mx-auto leading-relaxed">
              A curated index of high-performance static websites, creative studio showcases, and bespoke digital experiences. Explore real productions deployed live with sub-second performance.
            </p>

            {/* Direct Search Form */}
            <div className="mt-8 max-w-2xl mx-auto w-full">
              <form action="/sites" method="GET" className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#AEAC78]" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search curated portfolios, agencies, product showcases..."
                  className="w-full rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] pl-12 pr-32 py-3.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/70 focus:border-[#AEAC78] focus:outline-none focus:ring-2 focus:ring-[#AEAC78]/20 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-xs font-semibold text-[#2D2305] transition-all cursor-pointer shadow-sm"
                >
                  Explore
                </button>
              </form>
            </div>

            {/* Category Filter Pills in Hero */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#7A6F68] dark:text-[#B5AAA0] font-medium mr-1">Popular:</span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/sites?category=${c.slug}`}
                  className="px-3 py-1 rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] text-[#4C4541] dark:text-[#FBF3E6] hover:border-[#AEAC78] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-all font-medium"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Live Metrics & Highlights */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                100% Pure Static HTML/CSS/JS
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Instant Dedicated Subdomains
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Sub-Second Edge Loading Speed
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Zero Tracking Scripts or Bloat
              </span>
            </div>
          </div>
        </section>

        {/* CURATED FEATURED SHOWCASE */}
        <section id="showcase" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  CURATED SELECTION
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                  Featured Live Websites
                </h2>
                <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                  Real productions, agency showcases, and designer portfolios currently live in our directory.
                </p>
              </div>
              <Link
                href="/sites"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5B35] dark:text-[#AEAC78] hover:underline"
              >
                Browse All Directory Entries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {showcaseSites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center text-xs text-[#7A6F68] dark:text-[#B5AAA0] bg-[#FFF8ED] dark:bg-[#24201C]">
                Websites will appear here once published by the administrator.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showcaseSites.map((site) => (
                  <div
                    key={site.id}
                    className="group rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 flex flex-col justify-between hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-2.5 py-0.5 rounded-full border border-[#F2C46A]/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                          Live
                        </span>
                        {site.category && (
                          <span className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0] font-medium">
                            {site.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                        {site.name}
                      </h3>

                      <p className="font-mono text-xs text-[#5A5B35] dark:text-[#AEAC78] truncate">
                        {site.subdomain}.sitenest.com
                      </p>

                      {site.description && (
                        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] line-clamp-2 leading-relaxed">
                          {site.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs">
                      <Link
                        href={`/sites/${site.slug}`}
                        className="text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] font-medium"
                      >
                        Inspect Details
                      </Link>
                      <a
                        href={`/s/${site.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#5A5B35] dark:text-[#AEAC78] font-semibold hover:underline"
                      >
                        Visit Live Site
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EXPLORE COLLECTIONS SECTION */}
        <section id="categories" className="py-20 sm:py-28 border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/40 dark:bg-[#1E1A17]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                EXPLORE BY NICHE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                Curated Collections
              </h2>
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                Browse through targeted digital categories engineered for aesthetics, performance, and craftsmanship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/sites?category=${cat.slug}`}
                  className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F] group-hover:scale-105 transition-transform">
                      <FolderArchive className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                      {cat.description || "Browse websites and showcases published in this category."}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                    <span>{cat._count.websites} Live Websites</span>
                    <span className="font-semibold text-[#5A5B35] dark:text-[#AEAC78] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Browse &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO EDITORIAL ARTICLE / CRAFTSMANSHIP ESSAY */}
        <section className="py-20 sm:py-28 border-t border-[#DECBB0] dark:border-[#3D352F]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                DESIGN & PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                The Enduring Power of the Static Web
              </h2>
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                Why handcrafted HTML, CSS, and purposeful typography represent the zenith of digital longevity.
              </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-[#7A6F68] dark:text-[#B5AAA0] space-y-6 leading-relaxed">
              <p>
                In an era dominated by bloated JavaScript bundles and fragile client-side hydration cascades, handcrafted static websites stand out as beacons of clarity and reliability. When a web document consists of pure, semantic HTML, carefully sculpted CSS, and minimal purposeful scripting, it loads instantaneously, consumes negligible memory, and functions flawlessly across every device and browser generation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose my-8">
                <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Unmatched Velocity</h4>
                  <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                    Zero database lookups and zero application runtime latency. Files are streamed directly from high-speed storage in single-digit milliseconds.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Fortified Security</h4>
                  <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                    Without server-side execution environments, common vulnerabilities such as SQL injection, server code execution, and credential exfiltration are rendered obsolete.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                    <Feather className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Artisan Typography</h4>
                  <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                    Designed around intentional layout hierarchies, warm organic palettes, and typography that respects reader attention without manipulative popups.
                  </p>
                </div>
              </div>

              <p>
                Each website hosted on this platform is provisioned with its own isolated subdomain, guaranteeing strict boundary separation and pristine routing. Whether you are inspecting an editorial publication, reviewing a designer&apos;s portfolio, or discovering a product launch, you are viewing the web at its most elegant and resilient.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
