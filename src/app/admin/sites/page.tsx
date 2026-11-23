import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UploadCloud, Globe, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminSitesPage() {
  const websites = await prisma.website.findMany({
    include: {
      owner: { select: { name: true, email: true } },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">All Hosted Websites</h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Moderate, suspend, activate, or inspect any website across the platform.
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-xs font-semibold text-[#2D2305] shadow-sm transition-all shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          Deploy New Website
        </Link>
      </div>

      <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5E5C9]/60 dark:bg-[#1E1A17] border-b border-[#DECBB0] dark:border-[#3D352F] text-[#7A6F68] dark:text-[#B5AAA0] uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Website</th>
              <th className="px-5 py-3.5">Subdomain</th>
              <th className="px-5 py-3.5">Owner</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Active Version</th>
              <th className="px-5 py-3.5">Created</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DECBB0] dark:divide-[#3D352F]">
            {websites.map((site) => {
              const latest = site.deployments[0];
              const isLive = site.status === "LIVE";
              return (
                <tr key={site.id} className="hover:bg-[#F5E5C9]/40 dark:hover:bg-[#2D2823] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{site.name}</p>
                    <p className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">{site.category?.name || "Uncategorized"}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[#5A5B35] dark:text-[#AEAC78]">
                    {site.subdomain}.sitenest.com
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#4C4541] dark:text-[#FBF3E6]">{site.owner?.name || "Unknown"}</p>
                    <p className="text-[10px] text-[#7A6F68] dark:text-[#B5AAA0]">{site.owner?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isLive
                          ? "bg-[#F2C46A]/25 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40 font-semibold"
                          : "bg-[#F5E5C9] text-[#7A6F68]"
                      }`}
                    >
                      {site.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[#4C4541] dark:text-[#FBF3E6]">
                    Release v{latest?.version || 1}
                  </td>
                  <td className="px-5 py-4 text-[#7A6F68] dark:text-[#B5AAA0]">
                    {formatDate(site.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/s/${site.subdomain}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[#5A5B35] dark:text-[#AEAC78] hover:underline font-semibold"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
