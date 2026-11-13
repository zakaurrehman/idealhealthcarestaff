"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { handleJobAlertSubscription } from "@/app/actions/alerts";
import { AlertCircle, Bell, CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import { SPECIALTIES, US_STATES } from "@/lib/constants";

export default function JobAlertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [isOpen, onClose]);

  // Reset state after closing so the dialog opens fresh next time.
  useEffect(() => {
    if (!isOpen) setStatus(null);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const res = await handleJobAlertSubscription(formData);

    setSubmitting(false);
    setStatus(res);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-spruce/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-alert-title"
            aria-describedby="job-alert-desc"
            className="relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-line bg-surface shadow-2xl sm:rounded-[1.75rem]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                <Bell className="h-6 w-6" aria-hidden />
              </span>
              <h2 id="job-alert-title" className="mt-5 font-display text-xl font-medium text-ink">
                Clinical job alerts
              </h2>
              <p id="job-alert-desc" className="mt-1.5 text-sm leading-relaxed text-ink-3">
                Get notified when new travel contracts or direct-hire openings match your specialty and preferred
                states.
              </p>

              {status ? (
                <div
                  role={status.success ? "status" : "alert"}
                  className={`mt-6 rounded-2xl border p-4 text-sm leading-relaxed ${
                    status.success
                      ? "border-brand/30 bg-brand-soft text-ink"
                      : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {status.success ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    )}
                    <span>{status.message}</span>
                  </div>
                  {status.success ? (
                    <button type="button" onClick={onClose} className="btn-secondary btn-sm mt-4">
                      Close
                    </button>
                  ) : (
                    <button type="button" onClick={() => setStatus(null)} className="mt-3 font-semibold underline">
                      Try again
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="alert-email" className="field-label">
                      Email address *
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="alert-email"
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="alert-specialty" className="field-label">
                      Target specialty
                    </label>
                    <select id="alert-specialty" name="specialty" defaultValue="" className="field-input">
                      <option value="">All specialties</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="alert-state" className="field-label">
                      Preferred state
                    </label>
                    <select id="alert-state" name="state" defaultValue="" className="field-input">
                      <option value="">Any state (nationwide)</option>
                      {US_STATES.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-accent w-full">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Saving preferences…
                      </>
                    ) : (
                      "Subscribe to job alerts"
                    )}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-ink-3">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-ink" aria-hidden />
                    Zero spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
