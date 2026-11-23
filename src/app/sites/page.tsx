import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Globe, ExternalLink, Search } from "lucide-react";

export default async function SitesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
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

  const [sites, categories] = await Promise.all([
    prisma.website.findMany({
      where,
      include: {
        category: true,
        owner: { select: { name: true } },
        deployments: {
          where: { status: "LIVE" },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { websites: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            COMMUNITY DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6] tracking-tight">
            Explore Published Websites
          </h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Browse static landing pages, portfolios, and creative showcases hosted on SiteNest.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/sites"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !category
                ? "bg-[#F2C46A] text-[#2D2305] shadow-sm"
                : "bg-[#FFF8ED] dark:bg-[#24201C] text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F]"
            }`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/sites?category=${c.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === c.slug
                  ? "bg-[#F2C46A] text-[#2D2305] shadow-sm"
                  : "bg-[#FFF8ED] dark:bg-[#24201C] text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F]"
              }`}
            >
              {c.name} ({c._count.websites})
            </Link>
          ))}
        </div>

        {/* Websites Grid */}
        {sites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center text-xs text-[#7A6F68] dark:text-[#B5AAA0] bg-[#FFF8ED] dark:bg-[#24201C]">
            No published websites found matching the criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => {
              return (
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

                    <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                      {site.name}
                    </h3>

                    <p className="font-mono text-xs text-[#7A6F68] dark:text-[#B5AAA0] truncate">
                      {site.subdomain}.sitenest.com
                    </p>

                    {site.description && (
                      <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] line-clamp-2">
                        {site.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs">
                    <Link
                      href={`/sites/${site.slug}`}
                      className="text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] font-medium"
                    >
                      Details & Info
                    </Link>
                    <a
                      href={`/s/${site.subdomain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#5A5B35] dark:text-[#AEAC78] hover:underline font-semibold"
                    >
                      Visit Site
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
