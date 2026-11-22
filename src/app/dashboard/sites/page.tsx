import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UploadCloud, Globe, ExternalLink, ArrowRight, Layers, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function MyWebsitesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const websites = await prisma.website.findMany({
    where: { ownerId: user.id },
    include: {
      category: true,
      deployments: {
        orderBy: { version: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Websites</h1>
          <p className="text-sm text-zinc-400">
            Manage your deployed static websites, subdomains, and releases.
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          Deploy New Site
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 mb-4">
            <Globe className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No websites deployed</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-sm mx-auto">
            You have not launched any static websites yet. Create your first site now.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/sites/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Upload Project ZIP
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {websites.map((site) => {
            const latest = site.deployments[0];
            const isLive = site.status === "LIVE";
            return (
              <div
                key={site.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white text-base">{site.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isLive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : site.status === "DEPLOYING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {site.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                      <span className="font-mono text-zinc-300">
                        {site.subdomain}.sitenest.com
                      </span>
                      {site.category && (
                        <span className="border-l border-zinc-800 pl-4 text-zinc-500">
                          {site.category.name}
                        </span>
                      )}
                      <span className="border-l border-zinc-800 pl-4 font-mono">
                        Version {latest?.version || 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <Link
                    href={`/s/${site.subdomain}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Live Site
                  </Link>
                  <Link
                    href={`/dashboard/sites/${site.id}/deployments`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Releases
                  </Link>
                  <Link
                    href={`/dashboard/sites/${site.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                  >
                    Manage
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
