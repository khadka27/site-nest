import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FAQPage() {
  const faqs = [
    {
      q: "What files can I include in the ZIP archive?",
      a: "SiteNest supports static HTML, CSS, JavaScript, WebAssembly, images (PNG, JPG, SVG, WebP), fonts, PDFs, and standard static web assets. It does not execute uploaded PHP, Node.js, Python, or server-side scripts on our hosting servers.",
    },
    {
      q: "Does index.html have to be at the exact root of the ZIP file?",
      a: "SiteNest accepts either index.html directly at the root of the archive or inside a single top-level directory (e.g. 'my-build/index.html'). The deployment engine automatically flattens single enclosing folders.",
    },
    {
      q: "How does the rollback system work?",
      a: "Each deployment is preserved in an immutable folder: v1, v2, v3... The active release is managed via a release pointer symlink and active database record. When you click rollback, SiteNest updates the release pointer in milliseconds without re-uploading.",
    },
    {
      q: "How are subdomains resolved?",
      a: "Our wildcard DNS (*.sitenest.com) points to our VPS Nginx server. When a request arrives, Nginx matches the subdomain and directly serves static assets from the active deployment folder.",
    },
    {
      q: "What security measures are implemented?",
      a: "SiteNest features strict Zip Slip protection (path traversal sanitization), decompression size limits, symlink blocking, executable extension blacklists, and per-website isolated directory boundaries.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-zinc-400">
            Everything you need to know about static site deployments on SiteNest.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
              <h3 className="text-base font-semibold text-white">{f.q}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
