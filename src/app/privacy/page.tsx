import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-[#4C4541] dark:text-[#FBF3E6]">
        <h1 className="text-3xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6]">Privacy Policy</h1>
        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">Last updated: November 2026</p>

        <section className="space-y-3 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F]">
          <h2 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">1. Information We Collect</h2>
          <p className="text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            We collect account registration data (name, email address, hashed credentials) and website metadata required to provision and route your static subdomains.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">2. Storage and Data Retention</h2>
          <p className="text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Uploaded ZIP archives and extracted release files are retained in isolated directories associated with your account. You can permanently delete any website and its associated assets at any time from your dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">3. Session Security</h2>
          <p className="text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Authentication sessions are stored using secure, HTTP-only JWT cookies that are strictly isolated from user-uploaded websites.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
