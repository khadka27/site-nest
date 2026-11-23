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
              Upload. Deploy. Go Live. The high-performance static hosting platform with automatic wildcard subdomains, isolated directories, and zero-downtime rollbacks.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/sites" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Website Directory</Link></li>
              <li><Link href="/login" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Admin Portal</Link></li>
              <li><Link href="/pricing" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Pricing Plans</Link></li>
              <li><Link href="/#features" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Features</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">About SiteNest</Link></li>
              <li><Link href="/faq" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">FAQ & Architecture</Link></li>
              <li><Link href="/contact" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Contact Support</Link></li>
              <li><Link href="/terms" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Infrastructure</h4>
            <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed mb-4">
              Direct Nginx edge serving, isolated per-site sandboxes, automated BullMQ pipelines, and PostgreSQL persistence.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#AEAC78] animate-pulse"></span>
              <span className="text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0]">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DECBB0] dark:border-[#3D352F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
          <p>© 2026 SiteNest Platform Inc. All rights reserved.</p>
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
