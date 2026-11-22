"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

interface DeploymentItem {
  id: string;
  version: number;
  status: string;
  fileSize?: number;
  filesCount?: number;
  changeLog?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export default function SiteDeploymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [activeDeploymentId, setActiveDeploymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rollingBackVersion, setRollingBackVersion] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDeployments = async () => {
    try {
      const res = await fetch(`/api/sites/${id}/deployments`);
      const data = await res.json();
      if (res.ok) {
        setDeployments(data.deployments || []);
        setActiveDeploymentId(data.activeDeploymentId || null);
      }
    } catch {
      setError("Failed to fetch deployments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, [id]);

  const handleRollback = async (version: number) => {
    if (!confirm(`Are you sure you want to rollback to Version ${version}? This will switch the active release pointer immediately.`)) {
      return;
    }

    setRollingBackVersion(version);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/sites/${id}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Successfully rolled back to Version ${version}!`);
        await fetchDeployments();
      } else {
        setError(data.error || "Rollback failed");
      }
    } catch {
      setError("Error executing rollback");
    } finally {
      setRollingBackVersion(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/sites/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Website Overview
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Deployment History & Rollback</h1>
        <p className="text-sm text-zinc-400">
          Review all version releases, inspect status and file metrics, or instantly roll back to any previous version.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Deployments List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden divide-y divide-zinc-800">
        {deployments.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No deployments recorded yet.
          </div>
        ) : (
          deployments.map((d) => {
            const isLive = d.status === "LIVE";
            const isFailed = d.status === "FAILED";
            const canRollback = !isLive && !isFailed;

            return (
              <div key={d.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      Version {d.version}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isLive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isFailed
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : d.status === "ROLLED_BACK"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {d.status}
                    </span>
                    {isLive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                        Active Release
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300">
                    {d.changeLog || "Deployment"}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono">
                    <span>Deployed {formatDate(d.createdAt)}</span>
                    {d.fileSize ? <span>• {formatBytes(d.fileSize)}</span> : null}
                    {d.filesCount ? <span>• {d.filesCount} files</span> : null}
                  </div>

                  {d.errorMessage && (
                    <p className="mt-2 text-xs text-red-400 font-mono bg-red-950/40 p-2 rounded border border-red-900/50">
                      Error: {d.errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canRollback && (
                    <button
                      type="button"
                      onClick={() => handleRollback(d.version)}
                      disabled={rollingBackVersion === d.version}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                    >
                      {rollingBackVersion === d.version ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3 w-3" />
                      )}
                      Rollback to v{d.version}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
