import Link from "next/link";
import { Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/70 dark:bg-[#1E1A17] text-[#7A6F68] dark:text-[#B5AAA0] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#4C4541] dark:text-[#FBF3E6]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2C46A] text-[#2D2305]">
                <Layers className="h-4 w-4" />
              </div>
              <span>Site<span className="text-[#AEAC78]">Nest</span></span>
            </Link>
            <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              A curated index of high-performance static websites, creative agency landing pages, designer portfolios, and bespoke digital experiences deployed live on custom subdomains.
            </p>
          </div>

          {/* Directory links */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Directory</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/sites" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Website Directory</Link></li>
              <li><Link href="/#showcase" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Featured Showcases</Link></li>
              <li><Link href="/#categories" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Curated Collections</Link></li>
              <li><Link href="/login" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Editorial links */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Editorial</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Design Philosophy</Link></li>
              <li><Link href="/faq" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Contact Editorial</Link></li>
              <li><Link href="/terms" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Curation Standards */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Curation Standards</h4>
            <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed mb-4">
              Pure semantic HTML, zero tracking bloat, intentional typography, and sub-second edge delivery across all modern devices.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#AEAC78] animate-pulse"></span>
              <span className="text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0]">Directory Live & Operational</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DECBB0] dark:border-[#3D352F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
          <p>© 2026 SiteNest Directory Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Privacy</Link>
            <Link href="/contact" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
