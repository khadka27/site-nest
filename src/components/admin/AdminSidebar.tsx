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
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
      <div>
        {/* Admin Header */}
        <div className="flex items-center justify-between px-3 py-2 mb-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white">
              <Layers className="h-4 w-4" />
            </div>
            <span>Site<span className="text-purple-400">Admin</span></span>
          </Link>
          <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Back to User Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        active
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-purple-400" : "text-zinc-500")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 mt-6 border-t border-zinc-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
