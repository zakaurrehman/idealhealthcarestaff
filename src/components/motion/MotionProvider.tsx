"use client";

import { MotionConfig } from "framer-motion";

/** Global motion settings — honours the OS "reduce motion" preference. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
