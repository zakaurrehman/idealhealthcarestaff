"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient bar along the top edge that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-bright via-brand to-accent"
      style={{ scaleX }}
    />
  );
}
