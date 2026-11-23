import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { Leaf, ShieldCheck, Zap, Globe, Award } from "lucide-react";

export const metadata = {
  title: "Botanical Philosophy & Purity Standards — SiteNest Botanicals",
  description:
    "Learn about our botanical extraction philosophy, clean sourcing commitments, and our standard of deploying an independent, uncompromised research microsite for every product.",
};

export default async function AboutPage() {
  // If an authenticated admin accesses the public about page, redirect to the Admin Portal
  const session = await getSession();
  if (session && isAdmin(session.role)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Intro */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED] dark:bg-[#24201C] px-3.5 py-1 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm">
            <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
            <span>BIOACTIVE PURITY & SCIENTIFIC EXTRACTION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            The SiteNest Botanical Standard
          </h1>
          <p className="text-base sm:text-lg text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            SiteNest Botanicals was founded on a singular premise: premium botanical formulations require absolute clinical transparency. Rather than hiding ingredient dossiers behind generic marketing claims, every single product we formulate is provisioned with its own dedicated, uncompromised research microsite on an isolated subdomain.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Leaf className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Wild-Harvested & Organic Sourcing</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              We partner exclusively with sustainable organic growers and ethical wild-harvesters. Our raw plants are gathered at peak seasonal potency from native terroirs across the globe.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Supercritical CO2 Extraction</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              We reject petroleum-based solvent extraction. By utilizing temperature-controlled supercritical CO2 and pure water extraction, we protect fragile bioactive terpenes and phytonutrients.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Independent Triple-Batch Testing</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Every production lot undergoes rigorous independent third-party laboratory analysis for heavy metals (lead, mercury, cadmium), pesticide residues, microbial flora, and active marker assays.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 space-y-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#4C4541] dark:text-[#FBF3E6] text-base">Dedicated Product Subdomains</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Each formulation (such as collagen.sitenest.com or magnesium.sitenest.com) is provisioned with an isolated static website detailing clinical trials, COA batch records, and exact dosing protocols.
            </p>
          </div>
        </div>

        {/* Curation & Quality Standards */}
        <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6] flex items-center gap-2">
            <Award className="h-5 w-5 text-[#AEAC78]" />
            cGMP Laboratory Quality Commitment
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            All SiteNest Botanical formulas are manufactured in registered facilities adhering to Current Good Manufacturing Practices (cGMP) under 21 CFR Part 111. We never use synthetic flow agents, silicon dioxide, magnesium stearate, artificial food colorings, or genetically modified organisms.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}