"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Layers, Shield, Menu as MenuIcon, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
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

  const isAdminUser = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
            <span className="ml-1 text-[10px] font-mono uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78] font-semibold">
              Botanicals
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links with Active Indicator Bar */}
        <nav className="hidden md:flex items-center h-full gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative h-16 flex items-center px-1 text-sm font-semibold transition-colors duration-150",
                  active
                    ? "text-[#2D2305] dark:text-[#FBF3E6]"
                    : "text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6]"
                )}
              >
                <span>{item.label}</span>
                {/* Active Bar Indicator */}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#AEAC78] dark:bg-[#F2C46A] rounded-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Admin Portal & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2.5">
              {isAdminUser ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#AEAC78]/50 bg-[#AEAC78]/15 px-3 py-1.5 text-xs font-semibold text-[#5A5832] dark:text-[#D9D7A5] hover:bg-[#AEAC78]/25 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#8F8C58] dark:text-[#F2C46A]" />
                    Admin Portal
                  </Link>
                  <Link
                    href="/dashboard/sites/new"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] px-3.5 py-1.5 text-xs font-semibold text-[#2D2305] shadow-sm transition-all"
                  >
                    Upload Product ZIP
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FFF8ED] dark:bg-[#24201C] border border-[#DECBB0] dark:border-[#3D352F] text-xs font-medium text-[#7A6F68] dark:text-[#B5AAA0]">
                  <span>{user.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#4C4541] dark:text-[#FBF3E6]">
                    Viewer
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-3.5 py-1.5 text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2C2723] transition-colors shadow-sm"
            >
              <Shield className="h-3.5 w-3.5 text-[#AEAC78]" />
              Admin Sign In
            </Link>
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

      {/* Mobile menu dropdown: Home, Products, About, Contact with Active Left Bar */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA] dark:bg-[#171513] px-4 pt-3 pb-6 space-y-1.5">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold transition-all",
                    active
                      ? "bg-[#F2C46A]/20 dark:bg-[#F2C46A]/10 text-[#2D2305] dark:text-[#F2C46A] border-l-4 border-[#AEAC78] dark:border-[#F2C46A]"
                      : "text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] hover:bg-[#F5E5C9]/40 dark:hover:bg-[#24201C]"
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78] dark:bg-[#F2C46A]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex flex-col gap-2.5">
            {user ? (
              <>
                {isAdminUser ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#AEAC78]/20 text-[#4C4541] dark:text-[#FBF3E6] border border-[#AEAC78]/40 py-2.5 text-xs font-semibold"
                    >
                      <Shield className="h-4 w-4 text-[#8F8C58] dark:text-[#F2C46A]" />
                      Admin Portal
                    </Link>
                    <Link
                      href="/dashboard/sites/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] text-[#2D2305] py-2.5 text-xs font-semibold shadow-sm"
                    >
                      Upload Product ZIP
                    </Link>
                  </>
                ) : (
                  <div className="py-2 text-center text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                    Signed in as {user.name} (Viewer)
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] text-[#4C4541] dark:text-[#FBF3E6] py-2.5 text-xs font-semibold shadow-sm"
              >
                <Shield className="h-4 w-4 text-[#AEAC78]" />
                Admin Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}