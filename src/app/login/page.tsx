"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Shield, AlertCircle, Loader2, Globe, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillAdminCredentials = () => {
    setEmail("admin@sitenest.com");
    setPassword("admin123456");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user?.role === "ADMIN" || data.user?.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col justify-center items-center px-4 py-12 font-sans transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-[#4C4541] dark:text-[#FBF3E6]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2C46A] text-[#2D2305] shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <span>Site<span className="text-[#AEAC78]">Nest</span></span>
          </Link>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#AEAC78]/15 px-3 py-1 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] border border-[#AEAC78]/30">
              <Shield className="h-3.5 w-3.5 text-[#AEAC78]" />
              Admin Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6] pt-1">
            Administrator Sign In
          </h2>
          <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] max-w-xs mx-auto">
            Sign in with admin credentials to upload ZIP archives and manage hosted websites.
          </p>
        </div>

        {/* Quick Fill Admin Button */}
        <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-3 flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2 text-[#7A6F68] dark:text-[#B5AAA0]">
            <KeyRound className="h-4 w-4 text-[#AEAC78]" />
            <span>Admin: <strong className="text-[#4C4541] dark:text-[#FBF3E6] font-mono">admin@sitenest.com</strong></span>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="rounded-lg bg-[#F2C46A] hover:bg-[#E5B555] px-2.5 py-1 text-[11px] font-semibold text-[#2D2305] transition-all cursor-pointer shadow-sm"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-500 dark:text-red-300 flex items-center gap-2 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@sitenest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] py-2.5 text-xs font-semibold text-[#2D2305] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Sign In as Admin
          </button>
        </form>

        {/* Public Visitor Notice */}
        <div className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-4 text-center space-y-2 shadow-sm">
          <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
            Looking to browse hosted websites? Visitors do not need an account.
          </p>
          <Link
            href="/sites"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] hover:underline"
          >
            <Globe className="h-3.5 w-3.5 text-[#AEAC78]" />
            Explore Live Websites Directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
