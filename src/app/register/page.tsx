import Link from "next/link";
import { Layers, Globe, Shield, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12 font-sans">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Brand */}
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Layers className="h-5 w-5" />
            </div>
            <span>Site<span className="text-indigo-400">Nest</span></span>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Globe className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Direct Public Access</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              SiteNest is configured in admin-managed mode. You do not need to register an account — all published websites and subdomains uploaded by administrators are directly available to view and explore.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/sites"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors"
            >
              <Globe className="h-4 w-4" />
              Explore Published Websites
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Administrator Sign In
            </Link>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Return to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
