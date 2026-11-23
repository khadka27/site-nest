import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Server, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            OUR ARCHITECTURE & VISION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            About SiteNest
          </h1>
          <p className="text-lg text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            SiteNest is built around a simple principle: modern static websites should be effortless to publish, isolated from each other, and served at bare-metal speed without application runtime overhead.
          </p>
        </div>

        {/* 2-System Architecture explanation */}
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] flex items-center gap-2">
            <Server className="h-5 w-5 text-[#AEAC78]" />
            The Two-System Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2 rounded-xl bg-[#F5E5C9]/60 dark:bg-[#1E1A17] p-5 border border-[#DECBB0] dark:border-[#3D352F]">
              <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6]">1. Control Panel (Next.js)</h3>
              <p className="text-[#7A6F68] dark:text-[#B5AAA0] text-xs leading-relaxed">
                Manages accounts, roles, upload validation, background BullMQ deployment workers, section CMS, and PostgreSQL metadata.
              </p>
            </div>
            <div className="space-y-2 rounded-xl bg-[#F5E5C9]/60 dark:bg-[#1E1A17] p-5 border border-[#DECBB0] dark:border-[#3D352F]">
              <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6]">2. Hosting Infrastructure (Nginx)</h3>
              <p className="text-[#7A6F68] dark:text-[#B5AAA0] text-xs leading-relaxed">
                Serves uploaded static assets directly from disk through isolated release directories and wildcard subdomains (*.sitenest.com) with zero Next.js CPU overhead.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Sandboxing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#4C4541] dark:text-[#FBF3E6]">Security & Multi-Tenant Isolation</h2>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Every ZIP upload undergoes strict validation: path traversal defense (ZIP slip prevention), uncompressed bomb checks, rejection of backend executable extensions (.php, .sh, .exe), and per-site directory isolation. Uploaded websites have zero access to platform tokens, cookies, or database credentials.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
