"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!mounted}
      aria-label={mounted ? label : "Theme toggle"}
      title={mounted ? label : undefined}
      className={`group inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-2.5 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-60 ${className}`}
    >
      <span className="relative h-[18px] w-[18px]">
        <Sun
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
      {showLabel && <span className="text-sm font-medium">{isDark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
