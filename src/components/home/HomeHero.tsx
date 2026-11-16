"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Phone, Wallet } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

/** Inline style helper for the CSS `.rise` entrance animation. */
const rise = (delay: number, distance = 24) =>
  ({ "--delay": `${delay}s`, "--rise": `${distance}px` }) as React.CSSProperties;

export default function HomeHero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start start", "end start"] });
  // Gentle parallax — the photo drifts slightly slower than the page.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section className="relative overflow-hidden">
      <div className="container-page relative grid items-center gap-14 pb-32 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-40 lg:pt-16">
        {/* ── Copy ───────────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:pr-6">
          <p className="eyebrow rise" style={rise(0.05, 8)}>
            {COMPANY_INFO.tagline}
          </p>

          <h1 className="mt-7 font-display text-[2.6rem] font-medium leading-[1.04] tracking-[-0.025em] text-ink sm:text-[2.9rem] md:text-[3.4rem] lg:text-[2.8rem] xl:text-[3.5rem]">
            <span className="rise block" style={rise(0.12, 28)}>
              The right professionals.
            </span>
            <span className="rise block" style={rise(0.24, 28)}>
              The right place.
            </span>
            <span className="rise block" style={rise(0.36, 28)}>
              The right <span className="em">time.</span>
              <sup className="ml-1 align-super font-sans text-[0.22em] font-semibold not-italic text-ink-3">™</sup>
            </span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lead text-ink-2" style={rise(0.5)}>
            Where dedication meets opportunity. We connect travel nurses, allied health specialists, and clinical
            professionals with premier health systems across the United States.
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={rise(0.62)}>
            <Link href="/jobs" className="btn-accent btn-lg group">
              Find Healthcare Jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/facilities#inquiry-form" className="btn-secondary btn-lg">
              Request Staffing
            </Link>
          </div>

          <ul className="rise mt-12 flex max-w-xl flex-wrap gap-x-7 gap-y-3 text-sm text-ink-3" style={rise(0.8, 0)}>
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

        {/* ── Portrait in an arch frame (never overlapped by copy) ── */}
        <div className="rise relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none" style={rise(0.2, 32)}>
          {/* Echo arch — a quiet architectural outline behind the photo */}
          <div
            className="arch absolute -right-4 -top-4 bottom-10 left-8 border border-brand/25 dark:border-brand/20 sm:-right-6 sm:-top-6"
            aria-hidden
          />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-accent-soft" aria-hidden />

          <div ref={frameRef} className="arch relative aspect-[4/5] overflow-hidden bg-surface-2 shadow-lift">
            <motion.div className="absolute inset-x-0 -inset-y-[4%]" style={{ y: imageY }}>
              <Image
                src="/images/hero-nurse.jpg"
                alt="Smiling registered nurse with long blonde hair in black scrubs"
                fill
                priority
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 416px"
                className="object-cover object-[50%_25%]"
              />
            </motion.div>
          </div>

          {/* Info chips hang off the frame edges, clear of the face */}
          <div
            className="rise absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 py-3 pl-3 pr-5 shadow-float backdrop-blur sm:-left-10"
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
            className="rise absolute -right-3 bottom-[22%] hidden items-center gap-3 rounded-2xl border border-line bg-surface/95 py-3 pl-3 pr-5 shadow-float backdrop-blur sm:-right-8 sm:flex"
            style={rise(1.05, 12)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
              <Wallet className="h-5 w-5" aria-hidden />
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
