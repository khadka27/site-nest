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
          <h1 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">My Websites</h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Manage your deployed static websites, subdomains, and releases.
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-sm font-semibold text-[#2D2305] shadow-sm transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          Deploy New Site
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center bg-[#FFF8ED] dark:bg-[#24201C] shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] mb-4">
            <Globe className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#4C4541] dark:text-[#FBF3E6]">No websites deployed</h3>
          <p className="mt-1 text-sm text-[#7A6F68] dark:text-[#B5AAA0] max-w-sm mx-auto">
            You have not launched any static websites yet. Create your first site now.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/sites/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2.5 text-sm font-semibold text-[#2D2305] shadow-sm"
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
                className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F] shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[#4C4541] dark:text-[#FBF3E6] text-base">{site.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isLive
                            ? "bg-[#F2C46A]/25 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40 font-semibold"
                            : site.status === "DEPLOYING"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-[#F5E5C9] dark:bg-[#2D2823] text-[#7A6F68] dark:text-[#B5AAA0]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-[#AEAC78]" : "bg-amber-400"}`} />
                        {site.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                      <span className="font-mono text-[#5A5B35] dark:text-[#AEAC78]">
                        {site.subdomain}.sitenest.com
                      </span>
                      {site.category && (
                        <span className="border-l border-[#DECBB0] dark:border-[#3D352F] pl-4">
                          {site.category.name}
                        </span>
                      )}
                      <span className="border-l border-[#DECBB0] dark:border-[#3D352F] pl-4 font-mono">
                        Version {latest?.version || 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-[#DECBB0] dark:border-[#3D352F]">
                  <Link
                    href={`/s/${site.subdomain}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3 py-1.5 text-xs font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Live Site
                  </Link>
                  <Link
                    href={`/dashboard/sites/${site.id}/deployments`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3 py-1.5 text-xs font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Releases
                  </Link>
                  <Link
                    href={`/dashboard/sites/${site.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-3.5 py-1.5 text-xs font-semibold text-[#2D2305] transition-colors shadow-sm"
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
