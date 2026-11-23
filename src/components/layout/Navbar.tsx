"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Layers, Menu as MenuIcon, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] dark:border-[#27272A] bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#111827] dark:text-[#F9FAFB] group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-white dark:bg-white dark:text-[#111827] shadow-sm group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight">
            Site<span className="text-[#111827] dark:text-white">Nest</span>
            <span className="ml-1 text-[10px] font-mono uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF] font-semibold">
              Botanicals
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links with Active Indicator Bar */}
        <nav className="hidden md:flex items-center h-full gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative h-16 flex items-center px-1 text-sm font-semibold transition-colors duration-150",
                  active
                    ? "text-[#111827] dark:text-white"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white"
                )}
              >
                <span>{item.label}</span>
                {/* Active Bar Indicator */}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111827] dark:bg-white rounded-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile menu button and theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-xl p-2 text-[#111827] dark:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#09090B] px-4 pt-3 pb-6 space-y-1.5">
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
                      ? "bg-[#F3F4F6] dark:bg-[#18181B] text-[#111827] dark:text-white border-l-4 border-[#111827] dark:border-white"
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white hover:bg-[#F9FAFB] dark:hover:bg-[#18181B]"
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#111827] dark:bg-white" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
