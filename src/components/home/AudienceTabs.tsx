"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Check, Stethoscope } from "lucide-react";
import { ImageReveal } from "@/components/motion/Reveal";

const PANELS = [
  {
    id: "clinicians",
    tab: "I'm a clinician",
    icon: Stethoscope,
    eyebrow: "For clinicians",
    title: "Travel nurses & clinicians",
    body: "Earn competitive weekly pay with non-taxed travel stipends, comprehensive day-one benefits, and dedicated placement coordinator support on every hospital contract.",
    points: [
      "Transparent weekly pay packages with maximum IRS per diem travel stipends.",
      "Personalized placement coordination and ongoing assignment support.",
      "Day-one comprehensive medical, dental, vision, and retirement options.",
      "Smooth credentialing assistance and primary license verification.",
    ],
    cta: { href: "/jobs", label: "Explore open travel jobs" },
    image: {
      src: "/images/nurse-compassion.jpg",
      alt: "Nurse in teal scrubs smiling warmly while talking with an elderly resident",
      position: "object-[68%_30%]",
    },
  },
  {
    id: "facilities",
    tab: "I'm a facility",
    icon: Building2,
    eyebrow: "For facilities",
    title: "Hospitals & health systems",
    body: "Safeguard clinical staffing continuity, minimize nurse burnout, and solve urgent census surges with credentialed travel nurses, allied professionals, and per diem staff.",
    points: [
      "Primary-source verified clinical credentials, background checks, and certifications.",
      "Rapid candidate matching for acute census peaks, unit vacancies, and leaves.",
      "Verified skill checklists, health screenings, and professional references.",
      "Flexible contracts from 13-week travelers to direct-hire conversion options.",
    ],
    cta: { href: "/facilities#inquiry-form", label: "Request a staffing partnership" },
    image: {
      src: "/images/physician-confident.jpg",
      alt: "Smiling physician in a white coat with a stethoscope, arms crossed in a clinic",
      position: "object-[56%_30%]",
    },
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AudienceTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + PANELS.length) % PANELS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      {/* Segmented control with a sliding indicator */}
      <div
        role="tablist"
        aria-label="Choose your path"
        onKeyDown={onKeyDown}
        className="inline-flex rounded-full border border-line bg-surface p-1.5 shadow-soft"
      >
        {PANELS.map((p, i) => {
          const selected = i === active;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={selected}
              aria-controls={`panel-${p.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:text-[0.9375rem] ${
                selected ? "text-brand-on" : "text-ink-2 hover:text-ink"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="audience-pill"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" aria-hidden />
              <span className="relative z-10">{p.tab}</span>
            </button>
          );
        })}
      </div>

      {/* Panels share one grid cell, so height never jumps between tabs */}
      <div className="mt-10 grid">
        {PANELS.map((p, i) => {
          const selected = i === active;
          return (
            <motion.div
              key={p.id}
              id={`panel-${p.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${p.id}`}
              inert={!selected}
              aria-hidden={!selected}
              initial={false}
              animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 24 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`col-start-1 row-start-1 grid overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-12 ${
                selected ? "z-10" : "pointer-events-none z-0"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 lg:col-span-5 lg:aspect-auto lg:min-h-[34rem]">
                <ImageReveal className="absolute inset-0" delay={0.15}>
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{ scale: selected ? 1 : 1.12 }}
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(min-width: 1024px) 500px, 100vw"
                      className={`object-cover ${p.image.position}`}
                    />
                  </motion.div>
                </ImageReveal>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-14">
                <p className="eyebrow">{p.eyebrow}</p>
                <h3 className="mt-4 font-display text-title font-medium text-ink">{p.title}</h3>
                <p className="mt-4 max-w-xl text-ink-2">{p.body}</p>
                <ul className="mt-7 grid gap-3.5 text-[0.9375rem] text-ink-2 sm:grid-cols-2 sm:gap-x-8">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <Link href={p.cta.href} className="btn-accent group">
                    {p.cta.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
