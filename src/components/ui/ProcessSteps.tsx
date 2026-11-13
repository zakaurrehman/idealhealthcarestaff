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
      <div className={`absolute left-0 right-0 top-6 hidden h-px lg:block ${onDark ? "bg-white/10" : "bg-line"}`} aria-hidden>
        <motion.div
          data-reveal=""
          className="h-full origin-left bg-brand-bright"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </div>

      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            data-reveal=""
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease: EASE }}
          >
            <span
              className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold ring-8 ${
                onDark
                  ? "bg-navy-900 text-green-300 ring-navy-950"
                  : "bg-surface text-brand-ink ring-surface border border-line"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={`mt-6 font-display text-lg font-bold ${onDark ? "text-white" : "text-ink"}`}>
              {step.title}
            </h3>
            <p className={`mt-2.5 text-[0.9375rem] leading-relaxed ${onDark ? "text-slate-400" : "text-ink-3"}`}>
              {step.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
