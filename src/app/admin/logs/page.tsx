import { prisma } from "@/lib/prisma";
import { ScrollText, Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminLogsPage() {
  const logs = await prisma.activityLog.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-purple-400" />
          Audit & Deployment Activity Logs
        </h1>
        <p className="text-sm text-zinc-400">
          Immutable audit record of all deployments, rollbacks, user logins, and administrative actions.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Metadata</th>
              <th className="px-5 py-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-3 font-mono font-bold text-purple-300">
                  {log.action}
                </td>
                <td className="px-5 py-3">
                  <p className="text-zinc-300">{log.user?.name || "System"}</p>
                  <p className="text-[10px] text-zinc-500">{log.user?.email}</p>
                </td>
                <td className="px-5 py-3 font-mono text-[11px] text-zinc-400">
                  {log.metadata ? JSON.stringify(log.metadata) : "—"}
                </td>
                <td className="px-5 py-3 text-zinc-500 font-mono">
                  {formatDate(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
