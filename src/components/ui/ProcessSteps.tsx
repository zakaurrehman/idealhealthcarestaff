"use client";

import { motion } from "framer-motion";

export interface ProcessStep {
  title: string;
  description: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Numbered horizontal timeline whose connector draws in on scroll. */
export default function ProcessSteps({ steps, onDark = false }: { steps: ProcessStep[]; onDark?: boolean }) {
  return (
    <div className="relative">
      {/* Connector (desktop) */}
      <div
        className={`absolute left-0 right-0 top-7 hidden h-px lg:block ${onDark ? "bg-white/10" : "bg-line"}`}
        aria-hidden
      >
        <motion.div
          data-reveal=""
          className={`h-full origin-left ${onDark ? "bg-gradient-to-r from-teal-300 to-coral-300" : "bg-gradient-to-r from-brand to-accent"}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        <span
          className={`travel-dot absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            onDark
              ? "bg-coral-300 shadow-[0_0_14px_5px_rgba(243,162,132,0.55)]"
              : "bg-accent shadow-[0_0_14px_5px_rgb(var(--accent)/0.4)]"
          }`}
        />
      </div>

      <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            data-reveal=""
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: EASE }}
          >
            <motion.span
              data-reveal=""
              className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-medium ring-[10px] ${
                onDark
                  ? "bg-spruce-700 text-teal-200 ring-spruce"
                  : "border border-line bg-surface text-brand-ink ring-surface"
              }`}
              initial={{ scale: 0.3, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.12 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.25 + i * 0.15 }}
            >
              {String(i + 1).padStart(2, "0")}
            </motion.span>
            <h3 className={`mt-7 font-display text-xl font-medium ${onDark ? "text-white" : "text-ink"}`}>
              {step.title}
            </h3>
            <p className={`mt-3 text-[0.9375rem] leading-relaxed ${onDark ? "text-spruce-50/70" : "text-ink-3"}`}>
              {step.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
