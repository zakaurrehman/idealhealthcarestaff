"use client";

import { useId } from "react";
import { motion } from "framer-motion";

/**
 * An ECG-style line that draws itself when scrolled into view, then keeps a heartbeat blip running along it.
 * Healthcare-specific take on the 21st.dev "Background Paths" pattern.
 */
export default function PulseLine({ className = "" }: { className?: string }) {
  const gradientId = `pulse-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const d =
    "M0 60 H260 L285 60 L300 22 L318 98 L334 40 L346 60 H520 L540 60 L552 48 L566 72 L578 60 H800 L825 60 L840 14 L858 104 L874 36 L886 60 H1200";
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      aria-hidden
      fill="none"
    >
      <path d={d} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
      <motion.path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* A bright heartbeat blip keeps racing along the line once it has drawn */}
      <path
        d={d}
        pathLength={1}
        className="ecg-run"
        stroke="#ffffff"
        strokeOpacity="0.85"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(127, 205, 205, 0.9))" }}
      />
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FCDCD" stopOpacity="0" />
          <stop offset="0.35" stopColor="#7FCDCD" stopOpacity="0.9" />
          <stop offset="0.75" stopColor="#F3A284" stopOpacity="0.9" />
          <stop offset="1" stopColor="#F3A284" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
