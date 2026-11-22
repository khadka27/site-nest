"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewWebsitePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deployedSite, setDeployedSite] = useState<{ id: string; subdomain: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-suggest subdomain if not manually modified
    if (!subdomain || subdomain === name.toLowerCase().replace(/[^a-z0-9-]/g, "-")) {
      const suggested = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSubdomain(suggested);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.name.toLowerCase().endsWith(".zip")) {
        setFile(dropped);
        setError(null);
      } else {
        setError("Please upload a .zip archive file.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.name.toLowerCase().endsWith(".zip")) {
        setFile(selected);
        setError(null);
      } else {
        setError("Please upload a .zip archive file.");
      }
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a website name");
      return;
    }
    if (!subdomain.trim()) {
      setError("Please choose a subdomain");
      return;
    }
    if (!file) {
      setError("Please select or drop a valid ZIP archive to upload");
      return;
    }

    setIsDeploying(true);
    setDeployStep("Creating website record...");

    try {
      // Step 1: Create Website
      const siteRes = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subdomain: subdomain.toLowerCase().trim(),
          categoryId: categoryId || undefined,
          description: description.trim() || undefined,
        }),
      });

      const siteData = await siteRes.json();
      if (!siteRes.ok) {
        throw new Error(siteData.error || "Failed to create website");
      }

      const site = siteData.website;
      setDeployStep("Uploading ZIP archive to isolated storage...");

      // Step 2: Upload ZIP
      const formData = new FormData();
      formData.append("file", file);
      formData.append("changeLog", "Initial deployment release v1");

      const uploadRes = await fetch(`/api/sites/${site.id}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload and validate ZIP archive");
      }

      setDeployStep("Validating files and extracting static assets...");

      // Step 3: Poll status for 1-3 seconds
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const checkRes = await fetch(`/api/sites/${site.id}`);
          const checkData = await checkRes.json();
          if (checkData.website?.status === "LIVE") {
            clearInterval(pollInterval);
            setIsDeploying(false);
            setDeployedSite({ id: site.id, subdomain: site.subdomain });
          } else if (checkData.website?.status === "FAILED") {
            clearInterval(pollInterval);
            setIsDeploying(false);
            setError("Deployment failed during file extraction or index.html validation.");
          } else if (attempts > 8) {
            // Assume it completed in background
            clearInterval(pollInterval);
            setIsDeploying(false);
            setDeployedSite({ id: site.id, subdomain: site.subdomain });
          }
        } catch {
          // ignore polling glitch
        }
      }, 1000);
    } catch (err: unknown) {
      setIsDeploying(false);
      setDeployStep(null);
      setError(err instanceof Error ? err.message : "Deployment failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Deploy a New Static Website</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload your project as a ZIP archive. We will unpack your static assets, assign your custom subdomain, and publish it live.
        </p>
      </div>

      {/* Success banner if deployed */}
      {deployedSite && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
            <h3 className="text-lg font-semibold text-white">Website Successfully Deployed!</h3>
          </div>
          <p className="text-sm text-zinc-300">
            Your website is live and served through your dedicated subdomain:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
            <div className="font-mono text-sm text-indigo-400 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{deployedSite.subdomain}.sitenest.com</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/s/${deployedSite.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Open Live Site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/sites/${deployedSite.id}`)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:text-white transition-colors"
              >
                Manage Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!deployedSite && (
        <form onSubmit={handleDeploy} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-medium text-white">Deployment Error</p>
                <p className="mt-0.5 text-xs text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Website Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Portfolio"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Subdomain *
              </label>
              <div className="flex rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <input
                  type="text"
                  required
                  placeholder="myportfolio"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                />
                <span className="flex items-center px-4 bg-zinc-800/80 text-xs font-mono text-zinc-400 border-l border-zinc-700">
                  .sitenest.com
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                3-32 letters, numbers, and hyphens. Your website will be available at this address.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of the website..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Drag & Drop ZIP Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Website ZIP Archive *
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                  file
                    ? "border-indigo-500/60 bg-indigo-950/20"
                    : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {file ? (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                      <FileArchive className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-zinc-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to deploy
                    </p>
                    <span className="inline-block text-[11px] text-indigo-400 underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Drag & drop your static ZIP here, or <span className="text-indigo-400">browse</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Supports static HTML, CSS, JavaScript, images, fonts (max 50MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security checklist note */}
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 flex items-start gap-3 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-300">Automatic Deployment & Verification</p>
                <p className="mt-0.5 leading-relaxed">
                  The archive must contain an <code className="text-zinc-200">index.html</code> file. Backend executable files (.php, .sh, .exe) are blocked by our security scanner.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/sites")}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeploying || !file || !name}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{deployStep || "Deploying..."}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Deploy Website
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
