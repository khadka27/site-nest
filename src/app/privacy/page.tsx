import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-zinc-300">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-zinc-500">Last updated: November 2026</p>

        <section className="space-y-3 pt-4 border-t border-zinc-800">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect account registration data (name, email address, hashed credentials) and website metadata required to provision and route your static subdomains.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Storage and Data Retention</h2>
          <p className="leading-relaxed">
            Uploaded ZIP archives and extracted release files are retained in isolated directories associated with your account. You can permanently delete any website and its associated assets at any time from your dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Session Security</h2>
          <p className="leading-relaxed">
            Authentication sessions are stored using secure, HTTP-only JWT cookies that are strictly isolated from user-uploaded websites.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
