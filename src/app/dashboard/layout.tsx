import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { UploadCloud } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] overflow-hidden font-sans transition-colors duration-200">
      <DashboardSidebar userRole={user.role} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED]/80 dark:bg-[#1E1A17]/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#7A6F68] dark:text-[#B5AAA0]">Welcome back,</span>
            <span className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{user.name}</span>
            <span className="text-[11px] font-mono uppercase bg-[#F2C46A]/20 text-[#2D2305] dark:text-[#F2C46A] border border-[#F2C46A]/40 px-2 py-0.5 rounded-full font-semibold">
              {user.role}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard/sites/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-3.5 py-1.5 text-xs font-semibold text-[#2D2305] transition-colors shadow-sm"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Upload ZIP
            </Link>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
