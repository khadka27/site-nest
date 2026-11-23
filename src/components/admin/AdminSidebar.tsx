"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  GitBranch,
  Users,
  Tags,
  FileText,
  Sliders,
  Menu,
  Image as ImageIcon,
  Network,
  Settings,
  ScrollText,
  LogOut,
  Layers,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navSections = [
    {
      title: "Core",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "All Websites", href: "/admin/sites", icon: Globe },
        { label: "Deployments", href: "/admin/deployments", icon: GitBranch },
        { label: "Users & Roles", href: "/admin/users", icon: Users },
      ],
    },
    {
      title: "CMS & Content",
      items: [
        { label: "Homepage CMS", href: "/admin/homepage", icon: Sliders },
        { label: "Categories", href: "/admin/categories", icon: Tags },
        { label: "Static Pages", href: "/admin/pages", icon: FileText },
        { label: "Navigation Menus", href: "/admin/menus", icon: Menu },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "Infrastructure",
      items: [
        { label: "Domains & DNS", href: "/admin/domains", icon: Network },
        { label: "Platform Settings", href: "/admin/settings", icon: Settings },
        { label: "Activity Logs", href: "/admin/logs", icon: ScrollText },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] flex flex-col justify-between p-4 shrink-0 overflow-y-auto transition-colors duration-200">
      <div>
        {/* Admin Header - Links to /admin, NOT public home */}
        <div className="flex items-center justify-between px-3 py-2 mb-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-[#4C4541] dark:text-[#FBF3E6]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2C46A] text-[#2D2305]">
              <Layers className="h-4 w-4" />
            </div>
            <span>Site<span className="text-[#AEAC78]">Admin</span></span>
          </Link>
          <span className="text-[10px] font-mono uppercase bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] px-1.5 py-0.5 rounded font-semibold">
            v1.0
          </span>
        </div>

        {/* Primary Action: Deploy New Site */}
        <Link
          href="/dashboard/sites/new"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 mb-3 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] text-[#2D2305] text-xs font-semibold shadow-sm transition-all"
        >
          <UploadCloud className="h-4 w-4" />
          Deploy / Upload Site
        </Link>

        {/* Back to User Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg text-xs font-medium text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] bg-[#F5E5C9]/60 dark:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#7A6F68] dark:text-[#B5AAA0]">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        active
                          ? "bg-[#F2C46A]/25 dark:bg-[#F2C46A]/15 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40 font-semibold"
                          : "text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] hover:bg-[#F5E5C9]/70 dark:hover:bg-[#24201C]"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-[#5A5B35] dark:text-[#AEAC78]" : "text-[#7A6F68] dark:text-[#B5AAA0]")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}