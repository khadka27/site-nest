import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Globe,
  Users,
  Layers,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function AdminDashboardOverview() {
  const [
    totalWebsites,
    liveWebsites,
    totalUsers,
    totalDeployments,
    recentWebsites,
    recentDeployments,
    recentLogs,
  ] = await Promise.all([
    prisma.website.count(),
    prisma.website.count({ where: { status: "LIVE" } }),
    prisma.user.count(),
    prisma.deployment.count(),
    prisma.website.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { name: true, email: true } },
        category: true,
      },
    }),
    prisma.deployment.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        website: { select: { id: true, name: true, subdomain: true } },
      },
    }),
    prisma.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const storageAgg = await prisma.deployment.aggregate({
    _sum: { fileSize: true },
    where: { status: "LIVE" },
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Analytics & Health</h1>
          <p className="text-sm text-zinc-400">
            Real-time multi-tenant static website hosting metrics and activity.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase">Total Sites</span>
            <Globe className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalWebsites}</div>
          <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{liveWebsites} live subdomains</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase">Total Users</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalUsers}</div>
          <div className="mt-1 text-xs text-zinc-500">Registered creators</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase">Deployments</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalDeployments}</div>
          <div className="mt-1 text-xs text-zinc-500">Total build executions</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase">Storage Used</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">
            {formatBytes(storageAgg._sum.fileSize || 0)}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Active live static releases</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deployments */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Latest Deployments</h2>
            <Link href="/admin/deployments" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {recentDeployments.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{d.website.name}</p>
                  <p className="font-mono text-zinc-400">
                    {d.website.subdomain}.sitenest.com • v{d.version}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      d.status === "LIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : d.status === "FAILED"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {d.status}
                  </span>
                  <p className="mt-1 text-[10px] text-zinc-500">{formatDate(d.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Audit Log */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              Recent Audit Logs
            </h2>
            <Link href="/admin/logs" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-purple-300 font-semibold">{log.action}</span>
                  <p className="text-[11px] text-zinc-500">
                    {log.user ? log.user.email : "System / Anonymous"}
                  </p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
