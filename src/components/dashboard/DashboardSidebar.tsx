"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  UploadCloud,
  Settings,
  User,
  LogOut,
  Layers,
  ExternalLink,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userRole?: string;
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Websites", href: "/dashboard/sites", icon: FolderGit2 },
    { label: "Deploy New Site", href: "/dashboard/sites/new", icon: UploadCloud, highlight: true },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { label: "User Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-3 font-bold text-lg text-white mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Layers className="h-4 w-4" />
          </div>
          <span>Site<span className="text-indigo-400">Nest</span></span>
        </Link>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Control Panel
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                    : item.highlight
                    ? "text-zinc-200 hover:bg-zinc-900 bg-zinc-900/60 border border-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-indigo-400" : "text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin Link if role permits */}
        {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-purple-400">
              Administration
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-950/40 border border-purple-500/20 transition-colors"
            >
              <Shield className="h-4 w-4 text-purple-400" />
              Admin Portal
            </Link>
          </div>
        )}
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-1">
        <Link
          href="/sites"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <span>Public Directory</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
