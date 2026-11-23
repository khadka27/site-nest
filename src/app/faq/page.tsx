import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Frequently Asked Questions — SiteNest Showcase Directory",
  description:
    "Common questions about exploring our curated web showcase, live subdomains, and static website standards.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the SiteNest Showcase Directory?",
      a: "SiteNest is an editorial gallery and directory of handcrafted static websites, digital portfolios, and creative agency landing pages. Each entry in our directory is live and hosted with its own dedicated subdomain.",
    },
    {
      q: "How can I explore and test the websites in the showcase?",
      a: "You can click on any website card from the directory to open its dedicated inspection page. There you can view metadata, release version, and an interactive sandboxed live preview, or click 'Visit Live Site' to open it directly in a new browser tab.",
    },
    {
      q: "Why are the showcased websites built with static technology?",
      a: "Static websites built with semantic HTML, modern CSS, and minimal JavaScript provide the highest benchmark for speed, privacy, accessibility, and longevity. They load in milliseconds and never suffer from database latency or security vulnerabilities.",
    },
    {
      q: "How are subdomains assigned and routed?",
      a: "Each approved and deployed website receives an automatic wildcard subdomain (such as myproject.sitenest.com) served directly from high-speed storage without application runtime overhead.",
    },
    {
      q: "Who manages and publishes websites to SiteNest?",
      a: "Publishing and deployments are curated and managed by the SiteNest Administrator through the protected admin control center.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            EXPLORATION & DIRECTORY
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Everything you need to know about exploring curated websites on SiteNest.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-2 shadow-sm">
              <h3 className="text-base font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{f.q}</h3>
              <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
