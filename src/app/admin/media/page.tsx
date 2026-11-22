import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-purple-400" />
            Media Library
          </h1>
          <p className="text-sm text-zinc-400">
            Uploaded images, logos, and promotional assets for CMS sections.
          </p>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-xs text-zinc-500">
          No media files uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
              <div className="aspect-square bg-zinc-950 rounded-lg flex items-center justify-center text-zinc-600">
                <ImageIcon className="h-8 w-8" />
              </div>
              <p className="text-[11px] font-semibold text-white truncate">{item.filename}</p>
              <p className="text-[10px] text-zinc-500">{formatBytes(item.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
