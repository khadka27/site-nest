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
    <aside className="w-64 border-r border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] flex flex-col justify-between p-4 shrink-0 transition-colors duration-200">
      <div>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-3 font-bold text-lg text-[#4C4541] dark:text-[#FBF3E6] mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2C46A] text-[#2D2305]">
            <Layers className="h-4 w-4" />
          </div>
          <span>Site<span className="text-[#AEAC78]">Nest</span></span>
        </Link>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#7A6F68] dark:text-[#B5AAA0]">
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
                    ? "bg-[#F2C46A]/25 dark:bg-[#F2C46A]/15 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40 font-semibold"
                    : item.highlight
                    ? "text-[#4C4541] dark:text-[#FBF3E6] bg-[#F5E5C9]/80 dark:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] hover:bg-[#EAD6B5] dark:hover:bg-[#2D2823]"
                    : "text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] hover:bg-[#F5E5C9]/50 dark:hover:bg-[#24201C]"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-[#5A5B35] dark:text-[#AEAC78]" : "text-[#7A6F68] dark:text-[#B5AAA0]")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin Link if role permits */}
        {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
          <div className="mt-6 pt-6 border-t border-[#DECBB0] dark:border-[#3D352F]">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5A5B35] dark:text-[#AEAC78]">
              Administration
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9]/70 dark:hover:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] transition-colors"
            >
              <Shield className="h-4 w-4 text-[#AEAC78]" />
              Admin Portal
            </Link>
          </div>
        )}
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] space-y-1">
        <Link
          href="/sites"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] hover:bg-[#F5E5C9]/50 dark:hover:bg-[#24201C] transition-colors"
        >
          <span>Website Showcase</span>
          <span className="text-[10px] font-mono text-[#AEAC78]">Public</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
