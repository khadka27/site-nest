import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import {
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Award,
  Sparkle,
  Layers,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.website.findFirst({
    where: {
      OR: [{ slug }, { subdomain: slug }],
      status: "LIVE",
    },
  });

  if (!product) {
    return { title: "Product Not Found — SiteNest Botanicals" };
  }

  return {
    title: `${product.name} — SiteNest Botanicals`,
    description: product.description || `Bioactive botanical formulation: ${product.name}. Featuring its own dedicated research microsite at ${product.subdomain}.sitenest.com.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.website.findFirst({
    where: {
      OR: [{ slug }, { subdomain: slug }],
      status: "LIVE",
    },
    include: {
      category: true,
      owner: { select: { name: true } },
      deployments: {
        where: { status: "LIVE" },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!product) {
    notFound();
  }

  const latest = product.deployments[0];

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Botanical Catalog
        </Link>

        {/* Product Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#DECBB0] dark:border-[#3D352F] pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-3 py-1 rounded-full border border-[#F2C46A]/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                Live Formulation
              </span>
              {product.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] bg-[#FFF8ED] dark:bg-[#24201C] px-3 py-1 rounded-full border border-[#DECBB0] dark:border-[#3D352F]">
                  <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
                  {product.category.name}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#5A5B35] dark:text-[#AEAC78]">
              <span>Dedicated Product Subdomain:</span>
              <span className="font-bold underline decoration-[#AEAC78]/50">
                {product.subdomain}.sitenest.com
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed pt-1">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={`/s/${product.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#2D2305] transition-all shadow-sm cursor-pointer"
            >
              Open Live Product Subdomain
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Clinical & Formulation Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#7A6F68] dark:text-[#B5AAA0] text-[10px] uppercase font-semibold">
              <FlaskConical className="h-3.5 w-3.5 text-[#AEAC78]" />
              Batch Release
            </div>
            <div className="text-[#4C4541] dark:text-[#FBF3E6] font-bold text-sm">
              Release v{latest?.version || 1}
            </div>
            <div className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
              Updated {formatDate(product.updatedAt)}
            </div>
          </div>

          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#7A6F68] dark:text-[#B5AAA0] text-[10px] uppercase font-semibold">
              <Award className="h-3.5 w-3.5 text-[#AEAC78]" />
              Bioactive Purity
            </div>
            <div className="text-[#5A5B35] dark:text-[#AEAC78] font-bold text-sm">
              99.8% Active Assay
            </div>
            <div className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
              Chromatography Verified
            </div>
          </div>

          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#7A6F68] dark:text-[#B5AAA0] text-[10px] uppercase font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#AEAC78]" />
              Certification
            </div>
            <div className="text-[#4C4541] dark:text-[#FBF3E6] font-bold text-sm">
              cGMP & Non-GMO
            </div>
            <div className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
              Zero Fillers or Binders
            </div>
          </div>

          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#7A6F68] dark:text-[#B5AAA0] text-[10px] uppercase font-semibold">
              <Layers className="h-3.5 w-3.5 text-[#AEAC78]" />
              Package Footprint
            </div>
            <div className="text-[#4C4541] dark:text-[#FBF3E6] font-bold text-sm font-mono">
              {latest?.fileSize ? formatBytes(latest.fileSize) : "Static Bundle"}
            </div>
            <div className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
              Zero Trackers or Bloat
            </div>
          </div>
        </div>

        {/* Sandboxed Live Preview of Product Subdomain */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#AEAC78] animate-pulse" />
              Live Product Subdomain Sandboxed Preview
            </span>
            <span className="font-mono text-xs text-[#5A5B35] dark:text-[#AEAC78]">
              https://{product.subdomain}.sitenest.com
            </span>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] overflow-hidden bg-[#FFF8ED] dark:bg-[#24201C] shadow-sm">
            {/* Browser chrome header bar */}
            <div className="h-10 bg-[#F5E5C9] dark:bg-[#1E1A17] border-b border-[#DECBB0] dark:border-[#3D352F] flex items-center px-4 gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <div className="ml-4 flex-1 max-w-md rounded-lg bg-[#FFF8ED] dark:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] px-3.5 py-1 text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0] truncate flex items-center justify-between">
                <span>https://{product.subdomain}.sitenest.com</span>
                <span className="text-[10px] text-[#AEAC78] font-semibold">SSL SECURE</span>
              </div>
            </div>

            {/* Embedded Live Subdomain Preview */}
            <iframe
              src={`/s/${product.subdomain}`}
              title={product.name}
              className="w-full h-[650px] border-none bg-white"
            />
          </div>
        </div>

        {/* Clinical Transparency Note */}
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
          <h4 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-sm">
            Botanical Integrity & Sourcing Transparency
          </h4>
          <p className="leading-relaxed">
            All active raw materials in {product.name} are harvested at their peak physiological potency. Every individual batch release is accompanied by full third-party chromatographic purity profiles, heavy-metal safety thresholds, and solvent-free verification.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}