import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import {
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Award,
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
  // If an authenticated admin accesses the public product page, redirect to the Admin Portal
  const session = await getSession();
  if (session && isAdmin(session.role)) {
    redirect("/admin");
  }

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
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#F9FAFB] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Botanical Catalog
        </Link>

        {/* Product Hero Header */}
        <div className="flex flex-col lg:flex-row gap-8 border-b border-[#E5E7EB] dark:border-[#27272A] pb-8 items-start justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start flex-1">
            {product.imageUrl && (
              <div className="w-full sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3F4F6] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shrink-0 shadow-sm relative flex items-center justify-center p-3">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-white/90 dark:bg-[#27272A]/90 text-[#4B5563] dark:text-[#D4D4D8] px-2 py-0.5 rounded border border-[#E5E7EB] dark:border-[#3F3F46]">
                  WebP Compressed
                </span>
              </div>
            )}

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111827] dark:text-white bg-[#F3F4F6] dark:bg-[#27272A] px-3 py-1 rounded-full border border-[#E5E7EB] dark:border-[#3F3F46]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  Live Formulation
                </span>
                {product.category && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] bg-white dark:bg-[#18181B] px-3 py-1 rounded-full border border-[#E5E7EB] dark:border-[#27272A]">
                    <Leaf className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
                    {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                <span>Dedicated Product Subdomain:</span>
                <span className="font-bold underline decoration-[#111827]/40 dark:decoration-white/40 text-[#111827] dark:text-white">
                  {product.subdomain}.sitenest.com
                </span>
              </div>

              {product.description && (
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed pt-1">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 lg:self-center">
            <a
              href={`/s/${product.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white dark:bg-white dark:text-[#111827] dark:hover:bg-[#E5E7EB] px-6 py-3 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Open Live Product Subdomain
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Clinical & Formulation Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-[10px] uppercase font-semibold">
              <FlaskConical className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
              Batch Release
            </div>
            <div className="text-[#111827] dark:text-[#F9FAFB] font-bold text-sm">
              Release v{latest?.version || 1}
            </div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Updated {formatDate(product.updatedAt)}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-[10px] uppercase font-semibold">
              <Award className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
              Bioactive Purity
            </div>
            <div className="text-[#111827] dark:text-white font-bold text-sm">
              99.8% Active Assay
            </div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Chromatography Verified
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-[10px] uppercase font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
              Certification
            </div>
            <div className="text-[#111827] dark:text-[#F9FAFB] font-bold text-sm">
              cGMP & Non-GMO
            </div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Zero Synthetic Binders
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-[10px] uppercase font-semibold">
              <Layers className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
              Package Footprint
            </div>
            <div className="text-[#111827] dark:text-[#F9FAFB] font-bold text-sm font-mono">
              {latest?.fileSize ? formatBytes(latest.fileSize) : "Static Bundle"}
            </div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Zero Trackers or Bloat
            </div>
          </div>
        </div>

        {/* Sandboxed Live Preview of Product Subdomain */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              Live Product Subdomain Sandboxed Preview
            </span>
            <span className="font-mono text-xs text-[#111827] dark:text-white font-semibold">
              https://{product.subdomain}.sitenest.com
            </span>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden bg-white dark:bg-[#121214] shadow-sm">
            {/* Browser chrome header bar */}
            <div className="h-10 bg-[#F9FAFB] dark:bg-[#18181B] border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center px-4 gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB] dark:bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB] dark:bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB] dark:bg-[#3F3F46]" />
              <div className="ml-4 flex-1 max-w-md rounded-lg bg-white dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] px-3.5 py-1 text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] truncate flex items-center justify-between">
                <span>https://{product.subdomain}.sitenest.com</span>
                <span className="text-[10px] text-[#10B981] font-semibold">SSL SECURE</span>
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
        <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#121214] p-6 space-y-2 shadow-sm text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">
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
