import { prisma } from "@/lib/prisma";
import { FileText, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" />
            Static CMS Pages
          </h1>
          <p className="text-sm text-zinc-400">
            Platform documents: Terms of Service, Privacy Policy, About Us, etc.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden divide-y divide-zinc-800">
        {pages.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No custom pages configured.
          </div>
        ) : (
          pages.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-white text-sm">{p.title}</p>
                <p className="font-mono text-zinc-500">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  p.published ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <span className="text-zinc-500">{formatDate(p.updatedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
