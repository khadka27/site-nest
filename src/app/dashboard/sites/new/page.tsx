"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  UploadCloud,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  ShieldCheck,
  ExternalLink,
  FolderTree,
  ImageIcon,
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

      // Step 3: Poll status
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
        <h1 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
          Deploy a New Static Website
        </h1>
        <p className="mt-1 text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
          Upload your project as a ZIP archive. We will unpack your static assets (HTML, CSS, JS, images, fonts), assign your custom subdomain, and publish it live instantly.
        </p>
      </div>

      {/* ZIP Structure Guide Accordion/Card */}
      <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">
          <FolderTree className="h-4 w-4 text-[#AEAC78]" />
          <span>Recommended ZIP Archive Structure</span>
        </div>

        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
          Your ZIP archive can contain your <code className="font-mono text-[#AEAC78] font-bold">index.html</code> directly at the root, along with <code className="font-mono text-[#AEAC78]">images/</code>, <code className="font-mono text-[#AEAC78]">css/</code>, and <code className="font-mono text-[#AEAC78]">js/</code> folders:
        </p>

        <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/60 dark:bg-[#1E1A17] p-4 font-mono text-xs text-[#4C4541] dark:text-[#FBF3E6] overflow-x-auto">
          <pre>{`my-website.zip
├── index.html           <- Required primary entry point
├── styles.css           <- CSS stylesheets (or inside css/)
├── app.js               <- Client-side JavaScript (or inside js/)
└── images/              <- Supported folder for photos, icons, graphics
    ├── logo.png
    ├── banner.jpg
    └── icon.svg`}</pre>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
          <ImageIcon className="h-3.5 w-3.5 text-[#AEAC78] shrink-0" />
          <span>In your HTML, reference images using relative paths, e.g.: <code className="font-mono text-[#4C4541] dark:text-[#FBF3E6]">&lt;img src="images/logo.png" alt="Logo" /&gt;</code></span>
        </div>
      </div>

      {/* Success banner if deployed */}
      {deployedSite && (
        <div className="rounded-2xl border border-[#AEAC78]/40 bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-[#5A5B35] dark:text-[#AEAC78]">
            <CheckCircle2 className="h-6 w-6 text-[#AEAC78]" />
            <h3 className="text-lg font-semibold text-[#4C4541] dark:text-[#FBF3E6]">Website Successfully Deployed!</h3>
          </div>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Your website is live and served through your dedicated subdomain:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FCF0DA]/60 dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F] rounded-xl p-4">
            <div className="font-mono text-sm text-[#5A5B35] dark:text-[#AEAC78] flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{deployedSite.subdomain}.sitenest.com</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/s/${deployedSite.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-xs font-semibold text-[#2D2305] transition-colors shadow-sm"
              >
                Open Live Site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/sites/${deployedSite.id}`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-4 py-2 text-xs font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors"
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
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 flex items-start gap-3 text-red-500 dark:text-red-300 text-sm shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
              <div>
                <p className="font-medium text-[#4C4541] dark:text-[#FBF3E6]">Deployment Error</p>
                <p className="mt-0.5 text-xs">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Website Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Architecture Portfolio"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                  Category
                </label>
                <CustomSelect
                  value={categoryId}
                  onChange={(val) => setCategoryId(val)}
                  placeholder="Select a category..."
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              </div>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                Subdomain *
              </label>
              <div className="flex rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] overflow-hidden focus-within:border-[#AEAC78]">
                <input
                  type="text"
                  required
                  placeholder="myportfolio"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:outline-none font-mono"
                />
                <span className="flex items-center px-4 bg-[#F5E5C9]/80 dark:bg-[#2D2823] text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0] border-l border-[#DECBB0] dark:border-[#3D352F]">
                  .sitenest.com
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
                3-32 letters, numbers, and hyphens. Your website will be available at this address.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of the website..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            {/* Drag & Drop ZIP Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                Website ZIP Archive *
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                  file
                    ? "border-[#AEAC78] bg-[#F5E5C9]/40 dark:bg-[#2D2823]/60"
                    : "border-[#DECBB0] dark:border-[#3D352F] hover:border-[#AEAC78] dark:hover:border-[#AEAC78] bg-[#FCF0DA]/30 dark:bg-[#1E1A17]"
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
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78]">
                      <FileArchive className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{file.name}</p>
                    <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to deploy
                    </p>
                    <span className="inline-block text-[11px] text-[#5A5B35] dark:text-[#AEAC78] underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#2D2823] text-[#7A6F68] dark:text-[#B5AAA0]">
                      <UploadCloud className="h-6 w-6 text-[#AEAC78]" />
                    </div>
                    <p className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">
                      Drag & drop your static ZIP here, or <span className="text-[#AEAC78] underline">browse</span>
                    </p>
                    <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                      Supports HTML, CSS, JS, images (PNG, JPG, SVG, WebP), fonts (max 50MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security checklist note */}
            <div className="rounded-xl bg-[#FCF0DA]/60 dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F] p-4 flex items-start gap-3 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#AEAC78] mt-0.5" />
              <div>
                <p className="font-medium text-[#4C4541] dark:text-[#FBF3E6]">Automatic Extraction & Security Validation</p>
                <p className="mt-0.5 leading-relaxed">
                  The archive must contain an <code className="text-[#4C4541] dark:text-[#FBF3E6] font-mono">index.html</code> file. All subfolders (e.g. <code className="font-mono">images/</code>, <code className="font-mono">assets/</code>, <code className="font-mono">css/</code>) are preserved and served relative to the root. Executable files (.php, .sh, .exe) are blocked automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/sites")}
              className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-5 py-2.5 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeploying || !file || !name}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-6 py-2.5 text-sm font-semibold text-[#2D2305] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
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
