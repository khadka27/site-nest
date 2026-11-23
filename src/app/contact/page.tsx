"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import { Mail, Send, CheckCircle2, Leaf, ShieldCheck, MapPin } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED] dark:bg-[#24201C] px-3.5 py-1 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm">
            <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />
            <span>BOTANICAL ADVISORY & CLINICAL LIAISON</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Contact SiteNest Botanicals
          </h1>
          <p className="text-sm sm:text-base text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
            Have questions regarding botanical ingredient sourcing, batch Certificates of Analysis (COA), or practitioner dispensing? Connect with our scientific team.
          </p>
        </div>

        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 space-y-2 shadow-sm text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <Leaf className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#4C4541] dark:text-[#FBF3E6]">Clinical Formulations</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              formulations@sitenestbotanicals.com
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 space-y-2 shadow-sm text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#4C4541] dark:text-[#FBF3E6]">COA & Lab Records</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              quality@sitenestbotanicals.com
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 space-y-2 shadow-sm text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#4C4541] dark:text-[#FBF3E6]">Formulation Lab</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              San Francisco, CA & Boulder, CO
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        {submitted ? (
          <div className="rounded-2xl border border-[#AEAC78]/40 bg-[#FFF8ED] dark:bg-[#24201C] p-10 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <CheckCircle2 className="h-12 w-12 text-[#AEAC78] mx-auto" />
            <h3 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6]">Inquiry Received</h3>
            <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Thank you for contacting SiteNest Botanicals. Our clinical advisory team and lab personnel will review your request and respond within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Jordan Ellis"
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase tracking-wider">Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@clinicalbotanicals.com"
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase tracking-wider">Inquiry Category</label>
              <CustomSelect
                value={inquiryType}
                onChange={(val) => setInquiryType(val)}
                options={[
                  { value: "general", label: "General Botanical & Formula Inquiry" },
                  { value: "coa", label: "Certificate of Analysis (COA) / Batch Testing" },
                  { value: "practitioner", label: "Practitioner & Clinical Wholesale Orders" },
                  { value: "subdomain", label: "Product Subdomain & Clinical Research Monograph" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase tracking-wider">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Inquiring on Marine Collagen Peptides heavy metals test"
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase tracking-wider">Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide details about your inquiry, patient cohort, or batch specifications..."
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-6 py-3 text-xs font-semibold text-[#2D2305] transition-all shadow-sm cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Transmit Consultation Request
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}