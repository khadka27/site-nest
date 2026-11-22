import { prisma } from "@/lib/prisma";
import { Layers, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Deployment Monitoring</h1>
        <p className="text-sm text-zinc-400">
          Live stream of all background extraction pipelines, build durations, and error logs.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
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
          <tbody className="divide-y divide-zinc-800">
            {deployments.map((d) => (
              <tr key={d.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{d.website.name}</p>
                  <p className="font-mono text-[10px] text-zinc-500">
                    {d.website.subdomain}.sitenest.com
                  </p>
                </td>
                <td className="px-5 py-4 font-mono font-bold text-white">
                  v{d.version}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      d.status === "LIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : d.status === "FAILED"
                        ? "bg-red-500/10 text-red-400"
                        : d.status === "ROLLED_BACK"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono">
                  {d.fileSize ? formatBytes(d.fileSize) : "—"}
                </td>
                <td className="px-5 py-4 font-mono">
                  {d.filesCount ?? "—"}
                </td>
                <td className="px-5 py-4 text-zinc-500">
                  {formatDate(d.createdAt)}
                </td>
                <td className="px-5 py-4">
                  {d.errorMessage ? (
                    <span className="text-red-400 font-mono text-[11px] truncate max-w-xs block">
                      {d.errorMessage}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">
                      {d.changeLog || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
