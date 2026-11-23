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
  Zap,
  ShieldCheck,
  Leaf,
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
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#F9FAFB] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* FULL EXPANSIVE BOTANICAL SUPPLEMENT HERO SECTION */}
        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214]">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Quality Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] px-4 py-1.5 text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] shadow-sm mb-6">
              <Leaf className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
              <span>Artisan Botanical Nutrition • Clinically Lab-Verified</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] dark:text-[#F9FAFB] max-w-4xl mx-auto leading-[1.1]">
              Targeted Botanical Nutrition & Bioactive Formulations
            </h1>

            {/* Subtitle / Brand Value Proposition */}
            <p className="mt-6 text-base sm:text-xl text-[#6B7280] dark:text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
              Pure, lab-verified botanical supplements engineered for vitality, cognitive resilience, and cellular longevity. Each product is accompanied by a dedicated research microsite.
            </p>

            {/* Product Search Form */}
            <div className="mt-8 max-w-2xl mx-auto w-full">
              <form action="/products" method="GET" className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search supplements by health goal, herb, or active ingredient..."
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] pl-12 pr-32 py-3.5 text-sm text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:border-[#111827] dark:focus:border-white focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white dark:bg-white dark:text-[#111827] px-5 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Explore
                </button>
              </form>
            </div>

            {/* Health Goal Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#6B7280] dark:text-[#9CA3AF] font-medium mr-1">Health Goals:</span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] transition-all font-medium shadow-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Quality Certifications & Highlights */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                100% Third-Party Lab Tested
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                Wild-Harvested & Organic Botanicals
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                Zero Fillers or Synthetic Binders
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF]">
                  TARGETED FORMULATIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                  Featured Botanical Products
                </h2>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                  Each supplement product is backed by full clinical transparency and its own dedicated live research microsite.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111827] dark:text-white hover:underline"
              >
                View Full Product Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E5E7EB] dark:border-[#27272A] p-16 text-center text-xs text-[#6B7280] dark:text-[#9CA3AF] bg-white dark:bg-[#121214]">
                Products will appear here once published by the administrator.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="group rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] p-5 flex flex-col justify-between hover:border-[#D1D5DB] dark:hover:border-[#3F3F46] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Header badge & Category */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111827] dark:text-white bg-[#F3F4F6] dark:bg-[#27272A] px-2.5 py-0.5 rounded-full border border-[#E5E7EB] dark:border-[#3F3F46]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                            Live Product
                          </span>
                          {product.category && (
                            <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                              {product.category.name}
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-black dark:group-hover:text-white transition-colors">
                          {product.name}
                        </h3>

                        {/* Product WebP Image Container */}
                        {product.imageUrl && (
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F3F4F6] dark:bg-[#18181B] border border-[#E5E7EB]/70 dark:border-[#27272A] flex items-center justify-center p-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-white/90 dark:bg-[#27272A]/90 text-[#4B5563] dark:text-[#D4D4D8] px-2 py-0.5 rounded backdrop-blur-sm border border-[#E5E7EB] dark:border-[#3F3F46]">
                              WebP
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                          <span className="truncate">{product.subdomain}.sitenest.com</span>
                        </div>

                        {product.description && (
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] grid grid-cols-2 gap-2.5">
                        <Link
                          href={`/products/${product.slug}`}
                          className="rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#111827] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] py-2 px-3 text-xs font-semibold text-center transition-all shadow-sm"
                        >
                          Lab Specs
                        </Link>
                        <a
                          href={`/s/${product.subdomain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white dark:bg-white dark:text-[#111827] dark:hover:bg-[#E5E7EB] py-2 px-3 text-xs font-semibold text-center transition-all shadow-sm inline-flex items-center justify-center gap-1"
                        >
                          <span>Microsite</span>
                          <ExternalLink className="h-3 w-3" />
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
        <section className="py-20 sm:py-28 border-t border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF]">
                CLINICAL FOCUS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                Explore by Health Goal
              </h2>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Every formulation is categorized by its primary biological mechanism and clinical focus area.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 hover:border-[#D1D5DB] dark:hover:border-[#3F3F46] transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6] dark:bg-[#27272A] text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-[#3F3F46] group-hover:scale-105 transition-transform">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-black dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                      {cat.description || "Explore botanical formulas and supplements in this category."}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>{cat._count.websites} Formulations</span>
                    <span className="font-semibold text-[#111827] dark:text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Shop Goal &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BOTANICAL QUALITY STANDARDS & PHILOSOPHY */}
        <section className="py-20 sm:py-28 border-t border-[#E5E7EB] dark:border-[#27272A]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF]">
                LAB TESTING & TRANSPARENCY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                The SiteNest Botanical Standard
              </h2>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Every batch verified for potency, purity, and cellular bioavailability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827] text-white dark:bg-white dark:text-[#111827] mb-3">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">Triple-Batch Testing</h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  Every formulation undergoes independent third-party analysis for heavy metals, microbial safety, and active phytochemical standardization.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827] text-white dark:bg-white dark:text-[#111827] mb-3">
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">Liposomal Bioavailability</h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  Utilizing chelated minerals and liposomal phospholipid matrices to bypass stomach degradation and maximize direct cellular absorption.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-6 space-y-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827] text-white dark:bg-white dark:text-[#111827] mb-3">
                  <Globe className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">Dedicated Subdomains</h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
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
