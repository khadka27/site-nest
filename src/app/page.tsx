import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import {
  Globe,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Layers,
  Zap,
  ShieldCheck,
  Leaf,
  FlaskConical,
} from "lucide-react";

export const metadata = {
  title: "SiteNest Botanicals — Targeted Botanical Nutrition & Bioactive Formulations",
  description:
    "Pure, lab-verified botanical supplements engineered for vitality, cognitive resilience, and cellular longevity. Each product is accompanied by a dedicated research microsite.",
};

export default async function HomePage() {
  // If an authenticated admin accesses the public home page, redirect them to the Admin Portal
  const session = await getSession();
  if (session && isAdmin(session.role)) {
    redirect("/admin");
  }

  const [products, categories] = await Promise.all([
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
        {/* FULL EXPANSIVE BOTANICAL SUPPLEMENT HERO SECTION */}
        <section className="relative overflow-hidden bg-craft-grid py-20 sm:py-28 lg:py-36 border-b border-[#DECBB0] dark:border-[#3D352F]">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Quality Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED]/90 dark:bg-[#24201C]/90 px-4 py-1.5 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm mb-6 backdrop-blur-sm">
              <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
              <span>Artisan Botanical Nutrition • Clinically Lab-Verified</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6] max-w-4xl mx-auto leading-[1.1]">
              Targeted Botanical Nutrition & Bioactive Formulations
            </h1>

            {/* Subtitle / Brand Value Proposition */}
            <p className="mt-6 text-base sm:text-xl text-[#7A6F68] dark:text-[#B5AAA0] max-w-2xl mx-auto leading-relaxed">
              Pure, lab-verified botanical supplements engineered for vitality, cognitive resilience, and cellular longevity. Each product is accompanied by a dedicated research microsite.
            </p>

            {/* Product Search Form */}
            <div className="mt-8 max-w-2xl mx-auto w-full">
              <form action="/products" method="GET" className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#AEAC78]" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search supplements by health goal, herb, or active ingredient..."
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

            {/* Health Goal Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#7A6F68] dark:text-[#B5AAA0] font-medium mr-1">Health Goals:</span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="px-3.5 py-1 rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] text-[#4C4541] dark:text-[#FBF3E6] hover:border-[#AEAC78] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-all font-medium shadow-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Quality Certifications & Highlights */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                100% Third-Party Lab Tested
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Wild-Harvested & Organic Botanicals
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Zero Fillers, Binders, or Artificial Colors
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                Dedicated Product Research Subdomains
              </span>
            </div>
          </div>
        </section>

        {/* FEATURED SUPPLEMENT PRODUCTS */}
        <section id="products" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  TARGETED FORMULATIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                  Featured Botanical Products
                </h2>
                <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                  Each supplement product is backed by full clinical transparency and its own dedicated live research microsite.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5B35] dark:text-[#AEAC78] hover:underline"
              >
                View Full Product Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center text-xs text-[#7A6F68] dark:text-[#B5AAA0] bg-[#FFF8ED] dark:bg-[#24201C]">
                Products will appear here once published by the administrator.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 flex flex-col justify-between hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-2.5 py-0.5 rounded-full border border-[#F2C46A]/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                            Live Product
                          </span>
                          {product.category && (
                            <span className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0] font-medium">
                              {product.category.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                          {product.name}
                        </h3>

                        <p className="font-mono text-xs text-[#5A5B35] dark:text-[#AEAC78] truncate">
                          {product.subdomain}.sitenest.com
                        </p>

                        {product.description && (
                          <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] font-medium"
                        >
                          View Details & Lab Specs
                        </Link>
                        <a
                          href={`/s/${product.subdomain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#5A5B35] dark:text-[#AEAC78] font-semibold hover:underline"
                        >
                          Open Microsite
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* EXPLORE BY HEALTH GOAL */}
        <section className="py-20 sm:py-28 border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/40 dark:bg-[#1E1A17]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                CLINICAL FOCUS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                Explore by Health Goal
              </h2>
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                Every formulation is categorized by its primary biological mechanism and clinical focus area.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F] group-hover:scale-105 transition-transform">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                      {cat.description || "Explore botanical formulas and supplements in this category."}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                    <span>{cat._count.websites} Formulations</span>
                    <span className="font-semibold text-[#5A5B35] dark:text-[#AEAC78] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Shop Goal &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BOTANICAL QUALITY STANDARDS & PHILOSOPHY */}
        <section className="py-20 sm:py-28 border-t border-[#DECBB0] dark:border-[#3D352F]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                LAB TESTING & TRANSPARENCY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                The SiteNest Botanical Standard
              </h2>
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                Every batch verified for potency, purity, and cellular bioavailability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Triple-Batch Testing</h4>
                <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                  Every formulation undergoes independent third-party analysis for heavy metals, microbial safety, and active phytochemical standardization.
                </p>
              </div>

              <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Liposomal Bioavailability</h4>
                <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                  Utilizing chelated minerals and liposomal phospholipid matrices to bypass stomach degradation and maximize direct cellular absorption.
                </p>
              </div>

              <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] mb-3">
                  <Globe className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">Dedicated Subdomains</h4>
                <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                  Every product is accompanied by its own independent static research site (e.g. collagen.sitenest.com) containing full clinical monographs and batch records.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}