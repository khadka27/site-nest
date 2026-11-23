import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  ExternalLink,
  ArrowLeft,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function SiteDetailsPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const website = await prisma.website.findFirst({
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

  if (!website) {
    notFound();
  }

  const latest = website.deployments[0];

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/sites"
          className="inline-flex items-center gap-1.5 text-xs text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>

        {/* Website Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DECBB0] dark:border-[#3D352F] pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6]">{website.name}</h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-2.5 py-0.5 rounded-full border border-[#F2C46A]/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                Live Subdomain
              </span>
            </div>
            <p className="font-mono text-sm text-[#5A5B35] dark:text-[#AEAC78]">
              {website.subdomain}.sitenest.com
            </p>
            {website.description && (
              <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] max-w-2xl">{website.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/s/${website.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-5 py-2.5 text-sm font-semibold text-[#2D2305] transition-colors shadow-sm"
            >
              <Globe className="h-4 w-4" />
              Visit Live Site
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Info badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 shadow-sm">
            <span className="text-[#7A6F68] dark:text-[#B5AAA0] block text-[10px] uppercase font-sans font-semibold">Category</span>
            <span className="text-[#4C4541] dark:text-[#FBF3E6] font-semibold font-sans">{website.category?.name || "General"}</span>
          </div>
          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 shadow-sm">
            <span className="text-[#7A6F68] dark:text-[#B5AAA0] block text-[10px] uppercase font-sans font-semibold">Active Version</span>
            <span className="text-[#5A5B35] dark:text-[#AEAC78] font-bold">Release v{latest?.version || 1}</span>
          </div>
          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 shadow-sm">
            <span className="text-[#7A6F68] dark:text-[#B5AAA0] block text-[10px] uppercase font-sans font-semibold">Asset Size</span>
            <span className="text-[#4C4541] dark:text-[#FBF3E6] font-semibold">
              {latest?.fileSize ? formatBytes(latest.fileSize) : "Static Assets"}
            </span>
          </div>
          <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 shadow-sm">
            <span className="text-[#7A6F68] dark:text-[#B5AAA0] block text-[10px] uppercase font-sans font-semibold">Last Updated</span>
            <span className="text-[#4C4541] dark:text-[#FBF3E6] font-semibold">{formatDate(website.updatedAt)}</span>
          </div>
        </div>

        {/* Live Iframe Preview Frame */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Sandboxed Live Preview</span>
            <span className="font-mono">https://{website.subdomain}.sitenest.com</span>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] overflow-hidden bg-[#FFF8ED] dark:bg-[#24201C] shadow-sm">
            <div className="h-9 bg-[#F5E5C9] dark:bg-[#1E1A17] border-b border-[#DECBB0] dark:border-[#3D352F] flex items-center px-4 gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DECBB0] dark:bg-[#3D352F]" />
              <div className="ml-4 flex-1 max-w-sm rounded-md bg-[#FFF8ED] dark:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] px-3 py-0.5 text-[11px] font-mono text-[#7A6F68] dark:text-[#B5AAA0] truncate">
                https://{website.subdomain}.sitenest.com
              </div>
            </div>
            <iframe
              src={`/s/${website.subdomain}`}
              title={website.name}
              className="w-full h-[600px] border-none bg-white"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
