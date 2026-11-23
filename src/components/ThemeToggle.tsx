"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDark = document.documentElement.classList.contains("dark");
    setIsDark(hasDark);

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isDark === "boolean") {
        setIsDark(customEvent.detail.isDark);
      } else {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };

    window.addEventListener("sitenest-theme-changed", onThemeChange);
    return () => {
      window.removeEventListener("sitenest-theme-changed", onThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const currentIsDark = document.documentElement.classList.contains("dark");
    const nextDark = !currentIsDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("sitenest_theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("sitenest_theme", "light");
      } catch (e) {}
    }

    window.dispatchEvent(
      new CustomEvent("sitenest-theme-changed", { detail: { isDark: nextDark } })
    );
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] opacity-50 shrink-0" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] transition-all shadow-sm cursor-pointer shrink-0"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#F59E0B] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#4B5563] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
