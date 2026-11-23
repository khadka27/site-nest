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
              <span>Site<span className="text-[#AEAC78]">Nest</span> <span className="text-xs font-normal text-[#5A5B35] dark:text-[#AEAC78]">Botanicals</span></span>
            </Link>
            <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
              Targeted botanical nutrition and bioactive formulations. Pure, lab-verified supplements engineered for vitality, cognitive resilience, and cellular longevity — each accompanied by a dedicated research microsite.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">All Products</Link></li>
              <li><Link href="/about" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Contact & Inquiries</Link></li>
            </ul>
          </div>

          {/* Formulations */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Health Goals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products?category=longevity" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Longevity & Anti-Aging</Link></li>
              <li><Link href="/products?category=cognitive" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Cognitive & Focus</Link></li>
              <li><Link href="/products?category=vitality" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Energy & Vitality</Link></li>
              <li><Link href="/products?category=recovery" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Recovery & Sleep</Link></li>
              <li><Link href="/products?category=botanicals" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">Pure Botanicals</Link></li>
            </ul>
          </div>

          {/* Quality Standards */}
          <div>
            <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] tracking-wider uppercase mb-4">Quality Standards</h4>
            <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed mb-4">
              100% Non-GMO, third-party lab tested for heavy metals and purity, wild-harvested botanicals, and zero synthetic fillers.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#AEAC78] animate-pulse"></span>
              <span className="text-xs font-mono text-[#7A6F68] dark:text-[#B5AAA0]">Lab Verification Certified</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DECBB0] dark:border-[#3D352F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
          <p>© 2026 SiteNest Botanical Nutrition Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Privacy Policy</Link>
            <Link href="/login" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6]">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
