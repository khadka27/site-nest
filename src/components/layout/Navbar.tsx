"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Globe, Layers, Shield, Menu as MenuIcon, X, Compass, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/90 dark:bg-[#171513]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#4C4541] dark:text-[#FBF3E6] group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4C4541] text-[#FCF0DA] dark:bg-[#F2C46A] dark:text-[#171513] shadow-sm group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight">
            Site<span className="text-[#AEAC78] dark:text-[#F2C46A]">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#7A6F68] dark:text-[#B5AAA0]">
          <Link href="/sites" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            Showcase
          </Link>
          <Link href="/#features" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            Architecture
          </Link>
          <Link href="/pricing" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            About
          </Link>
          <Link href="/faq" className="hover:text-[#4C4541] dark:hover:text-[#FBF3E6] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Auth / Actions & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2.5">
              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#AEAC78]/50 bg-[#AEAC78]/15 px-3 py-1.5 text-xs font-semibold text-[#5A5832] dark:text-[#D9D7A5] hover:bg-[#AEAC78]/25 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-[#8F8C58] dark:text-[#F2C46A]" />
                  Admin Panel
                </Link>
              )}
              <Link
                href="/dashboard/sites/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#4C4541] dark:bg-[#F2C46A] px-4 py-1.5 text-xs font-semibold text-[#FCF0DA] dark:text-[#171513] hover:opacity-90 transition-opacity shadow-sm"
              >
                Upload ZIP
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sites"
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] hover:bg-[#F5E5C9] dark:hover:bg-[#2C2723] transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-[#AEAC78] dark:text-[#F2C46A]" />
                Explore Sites
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#4C4541] dark:bg-[#F2C46A] px-4 py-1.5 text-xs font-semibold text-[#FCF0DA] dark:text-[#171513] hover:opacity-90 transition-opacity shadow-sm"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button and theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-xl p-2 text-[#4C4541] dark:text-[#FBF3E6] border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA] dark:bg-[#171513] px-5 pt-3 pb-6 space-y-3">
          <Link href="/sites" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6]">
            Showcase
          </Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6]">
            Pricing
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6]">
            About
          </Link>
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4C4541] dark:text-[#FBF3E6]">
            FAQ
          </Link>
          <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#AEAC78]/20 text-[#4C4541] dark:text-[#FBF3E6] border border-[#AEAC78]/40 py-2.5 text-xs font-semibold"
                >
                  <Shield className="h-4 w-4 text-[#8F8C58] dark:text-[#F2C46A]" />
                  Admin Panel
                </Link>
                <Link
                  href="/dashboard/sites/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-[#4C4541] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#171513] py-2.5 text-xs font-semibold"
                >
                  Upload ZIP
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] text-[#4C4541] dark:text-[#FBF3E6] py-2.5 text-xs font-semibold"
                >
                  <Compass className="h-4 w-4 text-[#AEAC78] dark:text-[#F2C46A]" />
                  Explore Sites
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#4C4541] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#171513] py-2.5 text-xs font-semibold"
                >
                  <Shield className="h-4 w-4" />
                  Admin Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
