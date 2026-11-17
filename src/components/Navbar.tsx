"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bell, Lock, Menu, Phone, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import JobAlertModal from "@/components/JobAlertModal";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/facilities", label: "For Facilities" },
  { href: "/#specialties", label: "Specialties" },
  { href: "/privacy-policy", label: "Compliance" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const closeAlerts = useCallback(() => setAlertModalOpen(false), []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Slide away while reading down the page, return on any upward scroll.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) < 6) return;
      setHiddenOnScroll(y > lastY && y > 320);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation; lock scroll while it is open.
  useEffect(() => setMobileMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:translate-y-0 sm:px-4 ${
          hiddenOnScroll && !mobileMenuOpen ? "-translate-y-[130%]" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Floating pill bar (21st.dev-style navigation) */}
          <div
            className={`flex h-[4.25rem] items-center justify-between gap-4 rounded-full border pl-4 pr-2.5 transition-[background-color,box-shadow,border-color] duration-300 sm:pl-5 ${
              scrolled || mobileMenuOpen
                ? "border-line bg-surface/90 shadow-float backdrop-blur-xl"
                : "border-line/70 bg-surface/70 backdrop-blur-md"
            }`}
          >
            <Logo priority size="sm" className="sm:[&_img]:h-12" />

            {/* Desktop navigation */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  const showPill = hovered ? hovered === link.href : active;
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHovered(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                          active ? "text-ink" : "text-ink-2 hover:text-ink"
                        }`}
                      >
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
                        {link.label}
                      </Link>
                      {showPill && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-surface-2"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1 lg:flex">
              <a
                href={COMPANY_INFO.phoneHref}
                className="mr-1 hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink xl:inline-flex"
              >
                <Phone className="h-4 w-4 text-brand-ink" aria-hidden />
                {COMPANY_INFO.phone}
              </a>
              <button
                type="button"
                onClick={() => setAlertModalOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Subscribe to job alerts"
                title="Job alerts"
              >
                <Bell className="h-[18px] w-[18px]" />
              </button>
              <ThemeToggle />
              <Link href="/facilities#inquiry-form" className="btn-accent group ml-1.5 py-2.5">
                Request Staffing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-canvas transition-colors hover:bg-ink/90"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu — a floating card under the pill */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-[1.75rem] border border-line bg-surface p-3 shadow-lift lg:hidden"
              >
                <nav aria-label="Mobile">
                  <ul>
                    {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((link, i) => {
                      const active = isActive(link.href) || (link.href === "/" && pathname === "/");
                      return (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 + i * 0.04, duration: 0.35 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl font-medium text-ink transition-colors ${
                              active ? "bg-surface-2" : "hover:bg-surface-2"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
                              {link.label}
                            </span>
                            <ArrowRight className="h-5 w-5 text-ink-3" aria-hidden />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <div className="mt-3 grid gap-2.5 border-t border-line p-2 pt-5">
                    <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="btn-accent btn-lg">
                      Search Open Jobs
                    </Link>
                    <Link
                      href="/facilities#inquiry-form"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary btn-lg"
                    >
                      Request Staffing
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAlertModalOpen(true);
                      }}
                      className="btn btn-lg text-brand-ink hover:bg-brand-soft"
                    >
                      <Bell className="h-4 w-4" />
                      Subscribe to Job Alerts
                    </button>
                  </div>

                  <div className="space-y-2.5 border-t border-line px-4 pb-3 pt-5 text-sm">
                    <a href={COMPANY_INFO.phoneHref} className="flex items-center gap-2.5 font-semibold text-ink">
                      <Phone className="h-4 w-4 text-brand-ink" aria-hidden />
                      {COMPANY_INFO.phone}
                    </a>
                    <p className="text-ink-3">{COMPANY_INFO.address}</p>
                    <Link href="/admin" className="inline-flex items-center gap-1.5 text-ink-3 hover:text-ink">
                      <Lock className="h-3.5 w-3.5" aria-hidden />
                      Staff Portal
                    </Link>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <JobAlertModal isOpen={alertModalOpen} onClose={closeAlerts} />
    </>
  );
}
