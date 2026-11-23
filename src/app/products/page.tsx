import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import {
  ExternalLink,
  Search,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Filter,
} from "lucide-react";

export const metadata = {
  title: "Botanical Products & Bioactive Formulations — SiteNest Botanicals",
  description:
    "Explore our complete catalog of targeted botanical supplements, adaptogens, and bioactive longevity formulas. Each product features its own dedicated research microsite.",
};

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  // If an authenticated admin accesses the public catalog, redirect to the Admin Portal
  const session = await getSession();
  if (session && isAdmin(session.role)) {
    redirect("/admin");
  }

  const { search, category } = await searchParams;

  const where = {
    status: "LIVE" as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { subdomain: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(category && {
      category: { slug: category },
    }),
  };

  const [products, categories] = await Promise.all([
    prisma.website.findMany({
      where,
      include: {
        category: true,
        deployments: {
          where: { status: "LIVE" },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { websites: { where: { status: "LIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED] dark:bg-[#24201C] px-3.5 py-1 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm">
            <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
            <span>Targeted Clinical Formulations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Botanical Supplement Catalog
          </h1>
          <p className="text-sm sm:text-base text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Every botanical formulation is independently synthesized for bioactive potency and accompanied by its own dedicated research microsite hosted on an isolated subdomain.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-2xl mx-auto space-y-4">
          <form method="GET" action="/products" className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-[#AEAC78]" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by botanical name, active ingredient, or health goal..."
              className="w-full rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] pl-11 pr-28 py-3 text-xs sm:text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/70 focus:border-[#AEAC78] focus:outline-none focus:ring-2 focus:ring-[#AEAC78]/20 shadow-sm"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-1.5 text-xs font-semibold text-[#2D2305] transition-all cursor-pointer shadow-sm"
            >
              Filter
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/products"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !category
                  ? "bg-[#F2C46A] text-[#2D2305] shadow-sm"
                  : "bg-[#FFF8ED] dark:bg-[#24201C] text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F]"
              }`}
            >
              All Formulations
            </Link>
            {categories.map((c) => {
              const isSelected = category === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#F2C46A] text-[#2D2305] shadow-sm"
                      : "bg-[#FFF8ED] dark:bg-[#24201C] text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F]"
                  }`}
                >
                  {c.name} ({c._count.websites})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center space-y-3 bg-[#FFF8ED] dark:bg-[#24201C] max-w-xl mx-auto">
            <Leaf className="h-8 w-8 text-[#AEAC78] mx-auto opacity-70" />
            <h3 className="text-base font-semibold text-[#4C4541] dark:text-[#FBF3E6]">No Formulations Found</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              No botanical supplement products matched your search or category selection.
            </p>
            <Link
              href="/products"
              className="inline-block mt-2 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] underline"
            >
              Clear filters and view all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 flex flex-col justify-between hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all shadow-sm"
                >
                  <div className="space-y-3.5">
                    {/* Header badge & Category */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-2.5 py-0.5 rounded-full border border-[#F2C46A]/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                        Active Formula
                      </span>
                      {product.category && (
                        <span className="text-[11px] font-medium text-[#7A6F68] dark:text-[#B5AAA0]">
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                      {product.name}
                    </h3>

                    {/* Product WebP Image */}
                    {product.imageUrl && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#FCF0DA]/60 dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F]">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-[#171513]/80 text-[#AEAC78] px-2 py-0.5 rounded backdrop-blur-sm border border-[#AEAC78]/30">
                          WebP
                        </span>
                      </div>
                    )}

                    {/* Dedicated Subdomain Badge */}
                    <div className="flex items-center gap-2 font-mono text-xs text-[#5A5B35] dark:text-[#AEAC78] bg-[#FCF0DA]/60 dark:bg-[#1E1A17] px-3 py-1.5 rounded-lg border border-[#DECBB0] dark:border-[#3D352F]">
                      <span className="truncate">{product.subdomain}.sitenest.com</span>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:text-[#5A5B35] dark:hover:text-[#AEAC78] transition-colors"
                    >
                      Lab Specs & Details &rarr;
                    </Link>
                    <a
                      href={`/s/${product.subdomain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#5A5B35] dark:text-[#AEAC78] hover:underline"
                    >
                      Visit Microsite
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quality Certifications Bar */}
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-[#4C4541] dark:text-[#FBF3E6] flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="h-4 w-4 text-[#AEAC78]" />
              cGMP Certified Laboratory Standards
            </h4>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              All botanical lots are batch-tested for purity, heavy metals, microbial safety, and active standardized phytochemical marker counts.
            </p>
          </div>
          <Link
            href="/about"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/80 dark:bg-[#1E1A17] px-4 py-2 text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors"
          >
            Read Our Quality Manifesto
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}