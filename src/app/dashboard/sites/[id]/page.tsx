"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  UploadCloud,
  Layers,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileArchive,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

interface WebsiteData {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  description?: string;
  status: string;
  activeDeploymentId?: string;
  category?: { id: string; name: string };
  deployments: Array<{
    id: string;
    version: number;
    status: string;
    fileSize?: number;
    filesCount?: number;
    createdAt: string;
    completedAt?: string;
  }>;
}

export default function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [site, setSite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // New version upload state
  const [newFile, setNewFile] = useState<File | null>(null);
  const [changeLog, setChangeLog] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSite = async () => {
    try {
      const res = await fetch(`/api/sites/${id}`);
      const data = await res.json();
      if (res.ok && data.website) {
        setSite(data.website);
      } else {
        setError(data.error || "Website not found");
      }
    } catch {
      setError("Failed to load website details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite();
  }, [id]);

  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile) return;

    setIsUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("changeLog", changeLog || `Release v${(site?.deployments[0]?.version || 0) + 1}`);

      const res = await fetch(`/api/sites/${id}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess("New version queued! Refreshing deployment status...");
      setNewFile(null);
      setChangeLog("");

      // Poll until new version finishes
      setTimeout(() => {
        fetchSite();
        setIsUploading(false);
      }, 2500);
    } catch (err: unknown) {
      setIsUploading(false);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleDeleteSite = async () => {
    if (!confirm("Are you sure you want to delete this website? All files and deployments will be permanently removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/sites");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete website");
      }
    } catch {
      alert("Error deleting website");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-center text-red-300">
        <p>{error || "Website not found"}</p>
        <Link href="/dashboard/sites" className="mt-4 inline-block text-xs text-indigo-400 underline">
          Back to My Websites
        </Link>
      </div>
    );
  }

  const latest = site.deployments[0];
  const isLive = site.status === "LIVE";

  return (
    <div className="space-y-8">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Websites
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">{site.name}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/s/${site.subdomain}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            Visit Live Site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/dashboard/sites/${site.id}/deployments`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            Deployment History
          </Link>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <span className="text-xs font-medium text-zinc-400">Subdomain</span>
          <div className="mt-2 font-mono text-sm font-semibold text-indigo-400 truncate">
            {site.subdomain}.sitenest.com
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Served via Nginx Edge</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <span className="text-xs font-medium text-zinc-400">Active Version</span>
          <div className="mt-2 text-lg font-bold text-white">
            Version {latest?.version || 1}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            {latest?.filesCount ? `${latest.filesCount} static files` : "Immutable release"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <span className="text-xs font-medium text-zinc-400">Category</span>
          <div className="mt-2 text-base font-semibold text-white">
            {site.category?.name || "Uncategorized"}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Showcase classification</p>
        </div>
      </div>

      {/* Re-deploy / Upload New Version */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Deploy a New Version</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Upload an updated ZIP archive to trigger an instant build. Previous versions remain available for 1-click rollback.
          </p>
        </div>

        {uploadSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUploadNewVersion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 cursor-pointer hover:border-zinc-500 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewFile(e.target.files[0]);
                  }
                }}
              />
              <FileArchive className="h-6 w-6 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {newFile ? newFile.name : "Select new ZIP archive..."}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {newFile ? `${(newFile.size / (1024 * 1024)).toFixed(2)} MB` : "Click to browse"}
                </p>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Release notes / change log (optional)"
                value={changeLog}
                onChange={(e) => setChangeLog(e.target.value)}
                className="w-full h-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newFile || isUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing Release...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" />
                  Publish Version v{(latest?.version || 0) + 1}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-red-400">Delete Website</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Permanently delete this website, all release assets, and release the subdomain.
          </p>
        </div>
        <button
          onClick={handleDeleteSite}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Website
        </button>
      </div>
    </div>
  );
}
