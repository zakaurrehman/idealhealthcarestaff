"use client";

import { useRef } from "react";

/**
 * Card with a soft brand-green light that follows the cursor and a gentle 3D
 * tilt toward it. Adapted from the 21st.dev "Spotlight Card" pattern using CSS
 * custom properties only. Styles live in globals.css (.spotlight).
 */
export default function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
  tilt = 6,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  /** Maximum tilt in degrees; 0 disables it. */
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    if (!tilt || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rx = (0.5 - y / rect.height) * tilt;
    const ry = (x / rect.width - 0.5) * tilt;
    // Inline transform overrides the hover:-translate utility while the pointer is over the card.
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight ${className}`}
    >
      {children}
    </Tag>
  );
}
