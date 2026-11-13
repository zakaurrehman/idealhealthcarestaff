"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarCheck2, MapPin, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

const LINES = ["The right professionals.", "The right place.", "The right time."];

/** Inline style helper for the CSS `.rise` entrance animation. */
const rise = (delay: number, distance = 24) =>
  ({ "--delay": `${delay}s`, "--rise": `${distance}px` }) as React.CSSProperties;

export default function HomeHero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start start", "end start"] });
  // Gentle parallax — the photo drifts slightly slower than the page.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);

  return (
    <section className="relative overflow-hidden">
      {/* Quiet background: one soft brand wash behind the portrait */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[42rem] w-[42rem] rounded-full bg-brand-bright/[0.09] blur-3xl dark:bg-brand-bright/[0.06]"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-14 pb-28 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-36 lg:pt-12">
        {/* ── Copy ───────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <p className="eyebrow rise" style={rise(0.05, 8)}>
            {COMPANY_INFO.tagline}
          </p>

          <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3.25rem] lg:text-[3.1rem] xl:text-[3.75rem]">
            {LINES.map((line, i) => (
              <span
                key={line}
                className={`rise block ${i === LINES.length - 1 ? "text-brand-ink" : ""}`}
                style={rise(0.12 + i * 0.12, 28)}
              >
                {line}
                {i === LINES.length - 1 && (
                  <sup className="ml-0.5 align-super text-[0.3em] font-semibold">™</sup>
                )}
              </span>
            ))}
          </h1>

          <p className="rise mt-7 max-w-xl text-lead text-ink-2" style={rise(0.5)}>
            Where dedication meets opportunity. Ideal Healthcare Staffing connects travel nurses, allied health
            specialists, and clinical professionals with premier health systems nationwide.
          </p>

          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(0.62)}>
            <Link href="/jobs" className="btn-accent btn-lg group">
              Find Healthcare Jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/facilities#inquiry-form" className="btn-secondary btn-lg">
              Request Staffing
            </Link>
          </div>

          <ul className="rise mt-10 flex max-w-xl flex-wrap gap-x-7 gap-y-3 text-sm text-ink-3" style={rise(0.8, 0)}>
            <li>
              <a
                href={COMPANY_INFO.phoneHref}
                className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand-ink"
              >
                <Phone className="h-4 w-4 text-brand-ink" aria-hidden />
                {COMPANY_INFO.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              Los Angeles HQ · Nationwide
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" aria-hidden />
              Joint Commission &amp; OSHA standards
            </li>
          </ul>
        </div>

        {/* ── Portrait (kept fully separate from the copy) ─────── */}
        <div className="rise relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" style={rise(0.2, 32)}>
          {/* Offset brand shape behind the frame */}
          <div
            className="absolute -bottom-5 -right-5 left-10 top-10 rounded-[2.25rem] bg-brand-soft dark:bg-brand-bright/10"
            aria-hidden
          />

          <div
            ref={frameRef}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-2 shadow-lift ring-1 ring-ink/5"
          >
            <motion.div className="absolute inset-x-0 -inset-y-[4%]" style={{ y: imageY }}>
              <Image
                src="/images/hero-clinician.jpg"
                alt="Smiling registered nurse in blue scrubs with a stethoscope"
                fill
                priority
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
                className="object-cover object-[50%_18%]"
              />
            </motion.div>
          </div>

          {/* Chips hang off the frame edges, clear of the face */}
          <div
            className="rise absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-float backdrop-blur sm:-left-10 lg:-left-6"
            style={rise(0.9, 12)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
              <BadgeCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">Primary-source verified</span>
              <span className="text-ink-3">Licenses &amp; credentials</span>
            </span>
          </div>

          <div
            className="rise absolute -right-3 bottom-36 hidden items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-float backdrop-blur sm:-right-8 sm:flex"
            style={rise(1.05, 12)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <CalendarCheck2 className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">Weekly pay</span>
              <span className="text-ink-3">Day-one benefits</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
