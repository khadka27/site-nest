import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-zinc-300">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-zinc-500">Last updated: November 2026</p>

        <section className="space-y-3 pt-4 border-t border-zinc-800">
          <h2 className="text-lg font-bold text-white">1. Permitted Content</h2>
          <p className="leading-relaxed">
            SiteNest provides static website hosting. Users are solely responsible for all content, images, scripts, and media uploaded. Content must not violate intellectual property, distribute malware, engage in phishing, or contain harmful material.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Execution of Server-Side Code</h2>
          <p className="leading-relaxed">
            SiteNest only hosts static client-side files (HTML, CSS, JS). Uploading server-side executables (.php, .sh, .exe, .py) is strictly prohibited and results in immediate automated rejection or account suspension.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Subdomain Ownership</h2>
          <p className="leading-relaxed">
            Subdomains (*.sitenest.com) remain the property of SiteNest and are allocated on a conditional basis. SiteNest reserves the right to reclaim reserved or abusive subdomains.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
