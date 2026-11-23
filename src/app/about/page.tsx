import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Compass, Feather, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Design Philosophy & Curation Standards — SiteNest",
  description:
    "Learn about our editorial philosophy celebrating handcrafted web craftsmanship, minimal digital footprint, and curated static web experiences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            EDITORIAL VISION & PHILOSOPHY
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Celebrating Handcrafted Digital Web Design
          </h1>
          <p className="text-lg text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            SiteNest is an independent directory and curated gallery devoted to celebrating the art of the static web. We showcase real productions, creative studios, and bespoke portfolios that prioritize intentional typography, instant performance, and enduring digital craft.
          </p>
        </div>

        {/* 3 Core Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Feather className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Typographic Craft</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              We spotlight websites that treat typography and layout as fundamental art forms, respecting reader attention with clarity and poise.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Pure Performance</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Every curated website delivers instantaneous sub-second render times, eliminating heavy runtime trackers and bloated dependency chains.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Subdomain Integrity</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Each live website is partitioned with dedicated routing and subdomain identity, guaranteeing independent presentation.
            </p>
          </div>
        </div>

        {/* Curation Standards */}
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#AEAC78]" />
            Our Curation Standards
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Our editorial catalog features websites that embody restraint, responsive elegance, and clean client-side code. Submissions and additions to the directory are evaluated for visual hierarchy, contrast accessibility, cross-device responsiveness, and respect for user autonomy.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
