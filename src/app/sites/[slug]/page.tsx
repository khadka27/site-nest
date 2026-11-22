import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  ExternalLink,
  Layers,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/sites"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>

        {/* Website Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">{website.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live Subdomain
              </span>
            </div>
            <p className="font-mono text-sm text-indigo-400">
              {website.subdomain}.sitenest.com
            </p>
            {website.description && (
              <p className="text-sm text-zinc-300 max-w-2xl">{website.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/s/${website.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Globe className="h-4 w-4" />
              Visit Live Site
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Info badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-zinc-500 block text-[10px] uppercase font-sans">Category</span>
            <span className="text-white font-semibold font-sans">{website.category?.name || "General"}</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-zinc-500 block text-[10px] uppercase font-sans">Active Version</span>
            <span className="text-indigo-400 font-bold">Release v{latest?.version || 1}</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-zinc-500 block text-[10px] uppercase font-sans">Static Assets</span>
            <span className="text-white">{latest?.filesCount ? `${latest.filesCount} files` : "Verified"}</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-zinc-500 block text-[10px] uppercase font-sans">Deployed</span>
            <span className="text-zinc-400 font-sans">{formatDate(latest?.createdAt)}</span>
          </div>
        </div>

        {/* Live Interactive Iframe Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-2xl">
          <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
              <span className="font-mono text-zinc-300 ml-2">
                https://{website.subdomain}.sitenest.com
              </span>
            </div>
            <a
              href={`/s/${website.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <iframe
            src={`/s/${website.subdomain}`}
            title={website.name}
            className="w-full h-[600px] border-none bg-white"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
