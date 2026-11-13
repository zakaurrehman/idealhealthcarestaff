"use client";

import { motion, type Variants } from "framer-motion";

/*
 * Scroll-reveal primitives. Every animated element carries `data-reveal`;
 * globals.css forces these to their final state under
 * `prefers-reduced-motion: reduce`, so no content ever depends on motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

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
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
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

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

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
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Component = motion[as];
  return (
    <Component data-reveal="" className={className} variants={item}>
      {children}
    </Component>
  );
}
