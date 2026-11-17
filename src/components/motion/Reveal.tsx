"use client";

import { motion, type Variants } from "framer-motion";

/*
 * Scroll-reveal primitives. Every animated element carries `data-reveal`;
 * globals.css strips movement under `prefers-reduced-motion: reduce`, leaving
 * only fades, so no content ever depends on motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const WIPE = [0.77, 0, 0.18, 1] as const;

type Tag = "div" | "section" | "li" | "ul" | "article" | "header";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  as?: Tag;
}

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 40, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({
    transition: { staggerChildren: stagger },
  }),
};

const ITEM_VARIANTS = {
  up: {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  },
  blur: {
    hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
  },
  left: {
    hidden: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  },
  scale: {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
  },
} satisfies Record<string, Variants>;

export type StaggerVariant = keyof typeof ITEM_VARIANTS;

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: Tag;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  variant = "scale",
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  variant?: StaggerVariant;
}) {
  const Component = motion[as];
  return (
    <Component data-reveal="" className={className} variants={ITEM_VARIANTS[variant]}>
      {children}
    </Component>
  );
}

const pop: Variants = {
  hidden: { scale: 0, rotate: -120 },
  show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 16, delay: 0.2 } },
};

/** Springs a small badge or icon into place when its parent <StaggerItem> reveals. */
export function PopIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span data-reveal="" className={className} variants={pop}>
      {children}
    </motion.span>
  );
}

/**
 * Wipes a photo open (bottom to top) while it settles from a slight zoom.
 * `cover` positions the inner layer to fill the parent, for `next/image` `fill`.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
  cover = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  cover?: boolean;
}) {
  return (
    <motion.div
      data-clip-reveal=""
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, delay, ease: WIPE }}
    >
      <motion.div
        data-reveal=""
        className={cover ? "absolute inset-0" : undefined}
        initial={{ scale: 1.22 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
