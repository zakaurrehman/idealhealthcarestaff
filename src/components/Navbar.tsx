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
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const closeAlerts = useCallback(() => setAlertModalOpen(false), []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock scroll while it is open.
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

  const activeOrHovered = hovered ?? NAV_LINKS.find((l) => isActive(l.href))?.href ?? null;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || mobileMenuOpen
            ? "border-b border-line bg-surface/85 shadow-[0_1px_0_rgb(10_31_68/0.02),0_8px_24px_-16px_rgb(10_31_68/0.25)] backdrop-blur-xl"
            : "border-b border-transparent bg-canvas/0"
        }`}
      >
        <div className="container-page">
          <div className="flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
            <Logo priority />

            {/* Desktop navigation */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHovered(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={`relative z-10 block rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                          active ? "text-ink" : "text-ink-2 hover:text-ink"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {activeOrHovered === link.href && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-surface-2"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      {active && (
                        <span className="absolute bottom-0.5 left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-bright" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 lg:flex">
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
              <Link href="/facilities#inquiry-form" className="btn-accent btn-sm ml-2 group">
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-y-auto border-t border-line bg-surface lg:hidden"
            >
              <nav aria-label="Mobile" className="container-page flex min-h-full flex-col py-6">
                <ul className="space-y-1">
                  {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl font-semibold transition-colors ${
                          isActive(link.href) || (link.href === "/" && pathname === "/")
                            ? "bg-surface-2 text-ink"
                            : "text-ink hover:bg-surface-2"
                        }`}
                      >
                        {link.label}
                        <ArrowRight className="h-5 w-5 text-ink-3" aria-hidden />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-3">
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

                <div className="mt-auto space-y-3 border-t border-line pt-6 text-sm text-ink-2">
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
      </header>

      <JobAlertModal isOpen={alertModalOpen} onClose={closeAlerts} />
    </>
  );
}
