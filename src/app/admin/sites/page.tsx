import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Globe, ExternalLink, ShieldAlert, CheckCircle, Ban, Layers } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">All Hosted Websites</h1>
          <p className="text-sm text-zinc-400">
            Moderate, suspend, activate, or inspect any website across the platform.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
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
          <tbody className="divide-y divide-zinc-800">
            {websites.map((site) => {
              const latest = site.deployments[0];
              const isLive = site.status === "LIVE";
              return (
                <tr key={site.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{site.name}</p>
                    <p className="text-[11px] text-zinc-500">{site.category?.name || "Uncategorized"}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-purple-300">
                    {site.subdomain}.sitenest.com
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-zinc-300">{site.owner?.name || "Unknown"}</p>
                    <p className="text-[10px] text-zinc-500">{site.owner?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isLive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : site.status === "SUSPENDED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {site.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    v{latest?.version || 1}
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    {formatDate(site.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/s/${site.subdomain}`}
                        target="_blank"
                        className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                        title="Visit Live Site"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/dashboard/sites/${site.id}`}
                        className="px-2.5 py-1 rounded bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs font-medium"
                      >
                        Inspect
                      </Link>
                    </div>
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
