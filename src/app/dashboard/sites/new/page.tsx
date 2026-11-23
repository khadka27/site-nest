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
  Leaf,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductMicrositePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deployedProduct, setDeployedProduct] = useState<{ id: string; subdomain: string; slug?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check authentication and admin permissions
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && (data.user?.role === "ADMIN" || data.user?.role === "SUPER_ADMIN")) {
          setIsAdminUser(true);
        } else {
          setIsAdminUser(false);
        }
      })
      .catch(() => setIsAdminUser(false));

    // Load botanical categories
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
        setError("Please upload a valid .zip archive file.");
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
        setError("Please upload a valid .zip archive file.");
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const img = e.target.files[0];
      if (img.type.startsWith("image/")) {
        setProductImage(img);
        setImagePreview(URL.createObjectURL(img));
        setError(null);
      } else {
        setError("Please select a valid image file (PNG, JPG, JPEG, WebP, AVIF).");
      }
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const img = e.dataTransfer.files[0];
      if (img.type.startsWith("image/")) {
        setProductImage(img);
        setImagePreview(URL.createObjectURL(img));
        setError(null);
      } else {
        setError("Please select a valid image file (PNG, JPG, JPEG, WebP, AVIF).");
      }
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a product name");
      return;
    }
    if (!subdomain.trim()) {
      setError("Please choose a product subdomain");
      return;
    }
    if (!file) {
      setError("Please select or drop a valid ZIP archive containing the product microsite");
      return;
    }

    setIsDeploying(true);
    setDeployStep("Creating botanical product record...");

    try {
      // Step 1: Create Website/Product
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
        throw new Error(siteData.error || "Failed to create product record");
      }

      const site = siteData.website;
      setDeployStep("Uploading ZIP archive & auto-compressing product images to WebP...");

      // Step 2: Upload ZIP & Product Image
      const formData = new FormData();
      formData.append("file", file);
      formData.append("changeLog", "Initial botanical release v1");
      if (productImage) {
        formData.append("productImage", productImage);
      }

      const uploadRes = await fetch(`/api/sites/${site.id}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload and validate ZIP archive");
      }

      setDeployStep("Extracting static assets & converting archive images to WebP...");

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
            setDeployedProduct({ id: site.id, subdomain: site.subdomain, slug: site.slug });
          } else if (checkData.website?.status === "FAILED") {
            clearInterval(pollInterval);
            setIsDeploying(false);
            setError("Deployment failed during file extraction or index.html validation.");
          } else if (attempts > 8) {
            clearInterval(pollInterval);
            setIsDeploying(false);
            setDeployedProduct({ id: site.id, subdomain: site.subdomain, slug: site.slug });
          }
        } catch {
          // ignore
        }
      }, 1000);
    } catch (err: unknown) {
      setIsDeploying(false);
      setDeployStep(null);
      setError(err instanceof Error ? err.message : "Deployment failed");
    }
  };

  // If user is a viewer (not admin), show restricted access card
  if (isAdminUser === false) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78]">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#4C4541] dark:text-[#FBF3E6]">
            Administrator Privileges Required
          </h2>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed max-w-lg mx-auto">
            Public viewers and registered customers cannot upload static site packages. Only verified administrators have permission to register botanical products and deploy custom subdomains.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push("/products")}
              className="rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-5 py-2.5 text-xs font-semibold text-[#2D2305] transition-colors shadow-sm cursor-pointer"
            >
              Browse Botanical Products
            </button>
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/60 dark:bg-[#1E1A17] px-5 py-2.5 text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] transition-colors cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED] dark:bg-[#24201C] px-3.5 py-1 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm mb-3">
          <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
          <span>Admin Subdomain Deployment</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
          Register Botanical Product & Deploy Subdomain
        </h1>
        <p className="mt-1 text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
          Upload the product&apos;s static microsite ZIP and product imagery. All images are automatically compressed and converted to WebP format for optimal performance.
        </p>
      </div>

      {/* ZIP Structure Guide */}
      <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">
          <FolderTree className="h-4 w-4 text-[#AEAC78]" />
          <span>Recommended Product ZIP Structure</span>
        </div>

        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
          Your ZIP archive can contain your <code className="font-mono text-[#AEAC78] font-bold">index.html</code> directly at the root, along with <code className="font-mono text-[#AEAC78]">images/</code>, <code className="font-mono text-[#AEAC78]">css/</code>, and <code className="font-mono text-[#AEAC78]">js/</code> folders:
        </p>

        <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/60 dark:bg-[#1E1A17] p-4 font-mono text-xs text-[#4C4541] dark:text-[#FBF3E6] overflow-x-auto">
          <pre>{`supplement-package.zip
├── index.html           <- Primary product landing page
├── styles.css           <- Custom styling (or inside css/)
├── app.js               <- Client scripts (or inside js/)
└── images/              <- PNG/JPG files are auto-converted to .webp!
    ├── bottle-render.png -> auto-converted to bottle-render.webp
    ├── purity-seal.jpg   -> auto-converted to purity-seal.webp
    └── herbal-source.jpg -> auto-converted to herbal-source.webp`}</pre>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#5A5B35] dark:text-[#AEAC78] bg-[#AEAC78]/15 px-3 py-2 rounded-xl border border-[#AEAC78]/30">
          <Zap className="h-4 w-4 shrink-0 text-[#AEAC78]" />
          <span><strong>Automatic WebP Pipeline:</strong> Any raster images in your ZIP are converted to compressed .webp during extraction, reducing page size by 70–85%!</span>
        </div>
      </div>

      {/* Success banner if deployed */}
      {deployedProduct && (
        <div className="rounded-2xl border border-[#AEAC78]/40 bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-[#5A5B35] dark:text-[#AEAC78]">
            <CheckCircle2 className="h-6 w-6 text-[#AEAC78]" />
            <h3 className="text-lg font-semibold text-[#4C4541] dark:text-[#FBF3E6]">Product Microsite Live!</h3>
          </div>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            The product is now provisioned, images converted to WebP, and publicly accessible:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FCF0DA]/60 dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F] rounded-xl p-4">
            <div className="font-mono text-sm text-[#5A5B35] dark:text-[#AEAC78] flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{deployedProduct.subdomain}.sitenest.com</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/s/${deployedProduct.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-4 py-2 text-xs font-semibold text-[#2D2305] transition-colors shadow-sm"
              >
                Open Subdomain Site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => router.push(`/products/${deployedProduct.slug || deployedProduct.subdomain}`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-4 py-2 text-xs font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors cursor-pointer"
              >
                View Product Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!deployedProduct && (
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
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Marine Collagen Peptides"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                  Health Goal Category
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
                Product Subdomain *
              </label>
              <div className="flex rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] overflow-hidden focus-within:border-[#AEAC78]">
                <input
                  type="text"
                  required
                  placeholder="collagen"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:outline-none font-mono"
                />
                <span className="flex items-center px-4 bg-[#F5E5C9]/80 dark:bg-[#2D2823] text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0] border-l border-[#DECBB0] dark:border-[#3D352F]">
                  .sitenest.com
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
                Dedicated address: <span className="font-mono text-[#5A5B35] dark:text-[#AEAC78]">https://{subdomain || "your-product"}.sitenest.com</span>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                Formulation & Active Bioactives Description
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Wild-caught hydrolysed marine collagen types I & III with natural hyaluronic acid and vitamin C..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            {/* PRODUCT IMAGE UPLOAD (AUTO COMPRESS & WEBP CONVERSION) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                  Product Image (Auto-Compress to WebP)
                </label>
                <span className="text-[10px] font-mono text-[#5A5B35] dark:text-[#AEAC78] bg-[#AEAC78]/15 px-2 py-0.5 rounded border border-[#AEAC78]/30">
                  Auto WebP Conversion
                </span>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all ${
                  productImage
                    ? "border-[#AEAC78] bg-[#F5E5C9]/40 dark:bg-[#2D2823]/60"
                    : "border-[#DECBB0] dark:border-[#3D352F] hover:border-[#AEAC78] dark:hover:border-[#AEAC78] bg-[#FCF0DA]/30 dark:bg-[#1E1A17]"
                }`}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="h-24 w-24 rounded-xl overflow-hidden border border-[#DECBB0] dark:border-[#3D352F] bg-white shrink-0 shadow-sm">
                      <img src={imagePreview} alt="Product Preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <p className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{productImage?.name}</p>
                      <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                        {productImage ? (productImage.size / 1024).toFixed(1) : 0} KB • Will be converted to WebP with 80% lossy compression
                      </p>
                      <span className="inline-block text-[11px] text-[#5A5B35] dark:text-[#AEAC78] underline">
                        Click or drag to choose another photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#2D2823] text-[#7A6F68] dark:text-[#B5AAA0]">
                      <ImageIcon className="h-5 w-5 text-[#AEAC78]" />
                    </div>
                    <p className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">
                      Upload product packaging or bottle image, or <span className="text-[#AEAC78] underline">browse</span>
                    </p>
                    <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                      PNG, JPG, JPEG, AVIF • Auto-converted to optimized WebP
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Drag & Drop ZIP Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
                Product Static Website ZIP Archive *
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
                      Click to choose a different archive
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#2D2823] text-[#7A6F68] dark:text-[#B5AAA0]">
                      <UploadCloud className="h-6 w-6 text-[#AEAC78]" />
                    </div>
                    <p className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">
                      Drag & drop your product ZIP here, or <span className="text-[#AEAC78] underline">browse</span>
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
                <p className="font-medium text-[#4C4541] dark:text-[#FBF3E6]">Automatic Extraction & WebP Image Optimization</p>
                <p className="mt-0.5 leading-relaxed">
                  The archive must contain an <code className="text-[#4C4541] dark:text-[#FBF3E6] font-mono">index.html</code> entry point. All images found inside the archive are converted to compressed <code className="text-[#4C4541] dark:text-[#FBF3E6] font-mono">.webp</code> with relative paths updated in your markup.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-5 py-2.5 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-colors cursor-pointer"
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
                  <span>{deployStep || "Deploying Subdomain..."}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Deploy Product Microsite
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}