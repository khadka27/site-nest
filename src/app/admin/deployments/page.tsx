import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UploadCloud, Layers } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function AdminDeploymentsPage() {
  const deployments = await prisma.deployment.findMany({
    include: {
      website: {
        select: { id: true, name: true, subdomain: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Platform Deployment Monitoring
          </h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Live stream of all background extraction pipelines, build durations, and error logs.
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-xs font-semibold text-[#2D2305] shadow-sm transition-all shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          Upload & Deploy ZIP
        </Link>
      </div>

      <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5E5C9]/60 dark:bg-[#1E1A17] border-b border-[#DECBB0] dark:border-[#3D352F] text-[#7A6F68] dark:text-[#B5AAA0] uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Website</th>
              <th className="px-5 py-3.5">Version</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Size</th>
              <th className="px-5 py-3.5">Files</th>
              <th className="px-5 py-3.5">Created At</th>
              <th className="px-5 py-3.5">Notes / Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DECBB0] dark:divide-[#3D352F]">
            {deployments.map((d) => (
              <tr key={d.id} className="hover:bg-[#F5E5C9]/40 dark:hover:bg-[#2D2823] transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{d.website.name}</p>
                  <p className="font-mono text-[10px] text-[#7A6F68] dark:text-[#B5AAA0]">
                    {d.website.subdomain}.sitenest.com
                  </p>
                </td>
                <td className="px-5 py-4 font-mono font-bold text-[#5A5B35] dark:text-[#AEAC78]">
                  v{d.version}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      d.status === "LIVE"
                        ? "bg-[#F2C46A]/25 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40"
                        : d.status === "FAILED"
                        ? "bg-red-500/10 text-red-500"
                        : d.status === "ROLLED_BACK"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-[#F5E5C9] text-[#7A6F68]"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-[#7A6F68] dark:text-[#B5AAA0]">
                  {d.fileSize ? formatBytes(d.fileSize) : "—"}
                </td>
                <td className="px-5 py-4 font-mono text-[#7A6F68] dark:text-[#B5AAA0]">
                  {d.filesCount || "—"}
                </td>
                <td className="px-5 py-4 text-[#7A6F68] dark:text-[#B5AAA0]">
                  {formatDate(d.createdAt)}
                </td>
                <td className="px-5 py-4 text-[#7A6F68] dark:text-[#B5AAA0] max-w-xs truncate">
                  {d.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
