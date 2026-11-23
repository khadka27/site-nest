import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdmin(user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] overflow-hidden font-sans transition-colors duration-200">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Admin Top bar */}
        <header className="h-16 border-b border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED]/80 dark:bg-[#1E1A17]/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A5B35] dark:text-[#AEAC78] bg-[#AEAC78]/15 border border-[#AEAC78]/30 px-2.5 py-1 rounded-md">
              SiteNest Control Center
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#AEAC78]"></span>
              PostgreSQL Connected
            </span>
            <span className="border-l border-[#DECBB0] dark:border-[#3D352F] pl-4 text-[#4C4541] dark:text-[#FBF3E6] font-medium">
              {user.name} ({user.role})
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
