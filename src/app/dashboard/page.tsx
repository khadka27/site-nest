import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [websites, deploymentsCount, liveWebsitesCount] = await Promise.all([
    prisma.website.findMany({
      where: { ownerId: user.id },
      include: {
        category: true,
        deployments: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.deployment.count({
      where: { website: { ownerId: user.id } },
    }),
    prisma.website.count({
      where: { ownerId: user.id, status: "LIVE" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            SiteNest Cloud Hosting
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to your hosting command center
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Upload your static project ZIP to launch instant subdomains with automated isolation and zero-downtime rollbacks.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/sites/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <UploadCloud className="h-4 w-4" />
              Deploy New Website
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Websites</span>
            <div className="rounded-lg bg-zinc-800 p-2 text-zinc-300">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{websites.length}</div>
          <p className="mt-1 text-xs text-zinc-500">Created in your account</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Live Sites</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{liveWebsitesCount}</div>
          <p className="mt-1 text-xs text-zinc-500">Publicly accessible</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Deployments Run</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{deploymentsCount}</div>
          <p className="mt-1 text-xs text-zinc-500">Total build releases</p>
        </div>
      </div>

      {/* Recent Websites Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your Websites</h2>
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {websites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 mb-4">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No websites deployed yet</h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
              Get started by uploading your first static website ZIP archive.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/sites/new"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Upload & Deploy
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {websites.map((site) => {
              const latest = site.deployments[0];
              const isLive = site.status === "LIVE";
              return (
                <div
                  key={site.id}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          isLive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : site.status === "DEPLOYING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                        {site.status}
                      </span>
                      {site.category && (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {site.category.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {site.name}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-zinc-400 truncate">
                        {site.subdomain}.sitenest.com
                      </p>
                    </div>

                    {site.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {site.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">
                      v{latest?.version || 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/s/${site.subdomain}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
                        title="Open Live Website"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/dashboard/sites/${site.id}`}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium ml-2"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
