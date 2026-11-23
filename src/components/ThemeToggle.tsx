"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync initial state with actual DOM class
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
    // Check actual current DOM state to avoid stale state
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

    // Broadcast change so any other ThemeToggle instances on page update icon in sync
    window.dispatchEvent(
      new CustomEvent("sitenest-theme-changed", { detail: { isDark: nextDark } })
    );
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] opacity-50 shrink-0" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2C2723] hover:border-[#AEAC78] dark:hover:border-[#F2C46A]/50 transition-all shadow-sm cursor-pointer shrink-0"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#F2C46A] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#4C4541] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
