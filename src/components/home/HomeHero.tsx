"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, BadgeCheck, HeartPulse, MapPin, Phone, Wallet } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

/** Inline style helper for the CSS `.rise` entrance animation. */
const rise = (delay: number, distance = 24) =>
  ({ "--delay": `${delay}s`, "--rise": `${distance}px` }) as React.CSSProperties;

const HIRING = [
  "ICU Registered Nurses",
  "ER & Trauma Nurses",
  "OR & PACU Specialists",
  "Telemetry RNs",
  "Allied Health Therapists",
  "Cath Lab Technologists",
];

/** Splits a phrase into words that slide up from behind a mask, one after another. */
function Words({ text, start, step = 0.07 }: { text: string; start: number; step?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="word-mask">
            <span className="word-up" style={{ "--delay": `${start + i * step}s` } as React.CSSProperties}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}

function HiringTicker() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % HIRING.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="grid overflow-hidden font-semibold text-ink" aria-hidden>
      {/* Invisible sizer reserves the widest label so the pill never jumps */}
      <span className="invisible col-start-1 row-start-1">{HIRING[4]}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={HIRING[index]}
          className="col-start-1 row-start-1"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {HIRING[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HomeHero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start start", "end start"] });
  // Gentle parallax — the photo drifts slightly slower than the page.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // Pointer-driven 3D tilt; chips drift further than the frame for depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 140, damping: 18 });
  const smy = useSpring(my, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const chipX = useTransform(smx, [-0.5, 0.5], [-22, 22]);
  const chipY = useTransform(smy, [-0.5, 0.5], [-16, 16]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Drifting colour glow behind the hero */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="drift-a absolute -left-[12%] top-[2%] h-[32rem] w-[32rem] rounded-full bg-brand-bright/[0.14] blur-[110px]" />
        <div className="drift-b absolute -right-[10%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-accent/[0.13] blur-[120px]" />
        <div
          className="drift-a absolute bottom-[-12%] left-[30%] h-[26rem] w-[26rem] rounded-full bg-teal-300/[0.18] blur-[120px]"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <div className="container-page relative grid items-center gap-14 pb-32 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-40 lg:pt-16">
        {/* ── Copy ───────────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:pr-6">
          <div
            className="rise flex w-fit items-center gap-3 rounded-full border border-line bg-surface/80 py-1.5 pl-1.5 pr-4 text-sm shadow-soft backdrop-blur"
            style={rise(0, 10)}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-ink">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
              </span>
              Now hiring
            </span>
            <HiringTicker />
            <span className="sr-only">{HIRING.join(", ")}</span>
          </div>

          <p className="eyebrow rise mt-7 flex" style={rise(0.1, 8)}>
            {COMPANY_INFO.tagline}
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] font-medium leading-[1.04] tracking-[-0.025em] text-ink sm:text-[2.9rem] md:text-[3.4rem] lg:text-[2.8rem] xl:text-[3.5rem]">
            <span className="block">
              <Words text="The right professionals." start={0.15} />
            </span>
            <span className="block">
              <Words text="The right place." start={0.4} />
            </span>
            <span className="block">
              <Words text="The right" start={0.6} />{" "}
              <span className="word-mask">
                <span className="word-up em" style={{ "--delay": "0.76s" } as React.CSSProperties}>
                  time.
                </span>
              </span>
              <sup
                className="rise ml-1 align-super font-sans text-[0.22em] font-semibold not-italic text-ink-3"
                style={rise(1, 0)}
              >
                ™
              </sup>
            </span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lead text-ink-2" style={rise(0.85)}>
            Where dedication meets opportunity. We connect travel nurses, allied health specialists, and clinical
            professionals with premier health systems across the United States.
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={rise(1)}>
            <Link href="/jobs" className="btn-accent btn-lg btn-shine group">
              Find Healthcare Jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/facilities#inquiry-form" className="btn-secondary btn-lg">
              Request Staffing
            </Link>
          </div>

          <ul className="rise mt-12 flex max-w-xl flex-wrap gap-x-7 gap-y-3 text-sm text-ink-3" style={rise(1.15, 0)}>
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
          <motion.div
            className="relative"
            style={{ rotateX, rotateY, transformPerspective: 1100 }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            {/* Echo arch — a quiet architectural outline behind the photo */}
            <div
              className="arch absolute -right-4 -top-4 bottom-10 left-8 border border-brand/25 dark:border-brand/20 sm:-right-6 sm:-top-6"
              aria-hidden
            />
            <div className="drift-b absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-accent-soft" aria-hidden />

            <div ref={frameRef} className="arch relative aspect-[4/5] overflow-hidden bg-surface-2 shadow-lift">
              <div className="unveil absolute inset-0" style={{ "--delay": "0.35s" } as React.CSSProperties}>
                <motion.div className="absolute inset-x-0 -inset-y-[5%]" style={{ y: imageY }}>
                  <div className="zoom-settle absolute inset-0" style={{ "--delay": "0.35s" } as React.CSSProperties}>
                    <Image
                      src="/images/hero-nurse.jpg"
                      alt="Smiling registered nurse with long blonde hair in black scrubs"
                      fill
                      priority
                      sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 416px"
                      className="object-cover object-[50%_25%]"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Rotating seal — sits in the arch's empty upper corner, clear of the face */}
            <div
              className="rise absolute -right-6 top-4 z-10 hidden h-28 w-28 sm:block xl:-right-10"
              style={rise(1.3, 12)}
              aria-hidden
            >
              <div className="relative h-full w-full rounded-full border border-line bg-surface/95 shadow-float backdrop-blur">
                <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full">
                  <defs>
                    <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="fill-ink-2 font-sans text-[7px] font-semibold uppercase">
                    <textPath href="#seal-circle" textLength="230" lengthAdjust="spacing">
                      Exceptional people · Exceptional care ·
                    </textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-on">
                  <HeartPulse className="heartbeat h-5 w-5" />
                </span>
              </div>
            </div>

            {/* Info chips hang off the frame edges, clear of the face */}
            <div className="rise absolute -left-3 bottom-10 z-10 sm:-left-10" style={rise(1.2, 12)}>
              <motion.div style={{ x: chipX, y: chipY }}>
                <div className="float-y flex items-center gap-3 rounded-2xl border border-line bg-surface/95 py-3 pl-3 pr-5 shadow-float backdrop-blur">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                    <BadgeCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm leading-tight">
                    <span className="block font-semibold text-ink">Primary-source verified</span>
                    <span className="text-ink-3">Licenses &amp; credentials</span>
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="rise absolute -right-3 bottom-[22%] z-10 hidden sm:-right-8 sm:block" style={rise(1.4, 12)}>
              <motion.div style={{ x: chipX, y: chipY }}>
                <div
                  className="float-y flex items-center gap-3 rounded-2xl border border-line bg-surface/95 py-3 pl-3 pr-5 shadow-float backdrop-blur"
                  style={{ "--float-delay": "-2.7s" } as React.CSSProperties}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
                    <Wallet className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm leading-tight">
                    <span className="block font-semibold text-ink">Weekly pay</span>
                    <span className="text-ink-3">Day-one benefits</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
