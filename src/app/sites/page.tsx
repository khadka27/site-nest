import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Globe, ExternalLink, Search, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Published Websites
          </h1>
          <p className="text-sm text-zinc-400">
            Browse static landing pages, portfolios, and creative showcases hosted on SiteNest.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/sites"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !category
                ? "bg-indigo-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
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
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {c.name} ({c._count.websites})
            </Link>
          ))}
        </div>

        {/* Websites Grid */}
        {sites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-xs text-zinc-500">
            No published websites found matching the criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => {
              const latest = site.deployments[0];
              return (
                <div
                  key={site.id}
                  className="group rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Live
                      </span>
                      {site.category && (
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {site.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {site.name}
                    </h3>

                    <p className="font-mono text-xs text-zinc-400 truncate">
                      {site.subdomain}.sitenest.com
                    </p>

                    {site.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {site.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <Link
                      href={`/sites/${site.slug}`}
                      className="text-zinc-400 hover:text-white font-medium"
                    >
                      Details & Info
                    </Link>
                    <a
                      href={`/s/${site.subdomain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
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
