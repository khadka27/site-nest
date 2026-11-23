"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 w-full">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            DIRECT INQUIRIES
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">Contact Us</h1>
          <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
            Have questions about custom plans, wildcard domain routing, or enterprise hosting? Get in touch.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-[#AEAC78]/40 bg-[#FFF8ED] dark:bg-[#24201C] p-8 text-center space-y-3 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-[#AEAC78] mx-auto" />
            <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">Message Received</h3>
            <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              Thank you for contacting SiteNest. Our support team will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase">Subject</label>
              <input
                type="text"
                required
                placeholder="Enterprise or Custom Subdomain Inquiry"
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] uppercase">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your project or infrastructure requirements..."
                className="w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17] px-3.5 py-2.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/60 focus:border-[#AEAC78] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-6 py-3 text-xs font-semibold text-[#2D2305] transition-all shadow-sm"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
