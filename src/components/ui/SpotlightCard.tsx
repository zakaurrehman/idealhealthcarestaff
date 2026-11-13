"use client";

import { useRef } from "react";

/**
 * Card with a soft brand-green light that follows the cursor.
 * Adapted from the 21st.dev "Spotlight Card" pattern using CSS custom
 * properties only (no extra dependencies). Styles live in globals.css (.spotlight).
 */
export default function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      onMouseMove={onMove}
      className={`spotlight ${className}`}
    >
      {children}
    </Tag>
  );
}
