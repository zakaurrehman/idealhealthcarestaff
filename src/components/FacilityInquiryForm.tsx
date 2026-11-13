"use client";

import { useState } from "react";
import { handleFacilityInquirySubmit } from "@/app/actions/facility";
import { US_STATES, FACILITY_TYPES, STAFFING_NEED_CATEGORIES } from "@/lib/constants";
import { AlertCircle, CheckCircle2, Loader2, Lock, Send } from "lucide-react";

export default function FacilityInquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; message: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await handleFacilityInquirySubmit(formData);

    setSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Submission failed. Please check your form fields.");
    } else {
      setSuccessData({
        id: res.inquiryId || "IHS-INQ",
        message: res.message || "Inquiry received.",
      });
    }
  };

  if (successData) {
    return (
      <div role="status" className="rounded-[1.75rem] border border-line bg-surface p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Staffing inquiry received</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-2">{successData.message}</p>
        <p className="mt-6 inline-block rounded-xl bg-surface-2 px-4 py-2.5 font-mono text-sm text-ink-2">
          Reference: <span className="font-semibold text-ink">{successData.id}</span>
        </p>
        <div className="mt-8">
          <button type="button" onClick={() => setSuccessData(null)} className="btn-secondary">
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-10"
      aria-describedby="facility-form-intro"
    >
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-medium text-ink">Request staffing support</h3>
        <p id="facility-form-intro" className="mt-2 text-[0.9375rem] leading-relaxed text-ink-3">
          Submit your staffing requirements to our clinical recruitment coordinators. We provide verified
          candidates within 24 to 48 hours for emergency surge needs. Fields marked * are required.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <label htmlFor="fi-facility" className="field-label">
            Healthcare facility / system name *
          </label>
          <input
            id="fi-facility"
            required
            type="text"
            name="facilityName"
            autoComplete="organization"
            placeholder="e.g. St. Jude Regional Medical Center"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-contact" className="field-label">
            Contact name *
          </label>
          <input
            id="fi-contact"
            required
            type="text"
            name="contactName"
            autoComplete="name"
            placeholder="e.g. Robert Miller"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-title" className="field-label">
            Title / department
          </label>
          <input
            id="fi-title"
            type="text"
            name="contactTitle"
            autoComplete="organization-title"
            placeholder="e.g. Chief Nursing Officer"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-email" className="field-label">
            Business email *
          </label>
          <input
            id="fi-email"
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@hospital.org"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-phone" className="field-label">
            Direct telephone *
          </label>
          <input
            id="fi-phone"
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(555) 000-0000"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-city" className="field-label">
            City *
          </label>
          <input
            id="fi-city"
            required
            type="text"
            name="city"
            autoComplete="address-level2"
            placeholder="e.g. Houston"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="fi-state" className="field-label">
            State *
          </label>
          <select id="fi-state" required name="state" defaultValue="TX" className="field-input">
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fi-type" className="field-label">
            Facility type *
          </label>
          <select id="fi-type" required name="facilityType" defaultValue="Acute Care Hospital" className="field-input">
            {FACILITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fi-needs" className="field-label">
            Primary staffing solution *
          </label>
          <select
            id="fi-needs"
            required
            name="staffingNeeds"
            defaultValue={STAFFING_NEED_CATEGORIES[0]}
            className="field-input"
          >
            {STAFFING_NEED_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="fi-urgency" className="field-label">
            Start timeline / coverage urgency
          </label>
          <select id="fi-urgency" name="urgency" defaultValue="Standard (2-4 Weeks)" className="field-input">
            <option value="Immediate / Crisis (24-48 hrs)">Immediate / Crisis Need (24 - 48 Hours)</option>
            <option value="Standard (2-4 Weeks)">Standard Assignment Start (2 - 4 Weeks)</option>
            <option value="Future Seasonal / Planned Expansion">Future Seasonal / Planned Unit Opening</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="fi-details" className="field-label">
            Staffing requirements &amp; unit specifications
          </label>
          <textarea
            id="fi-details"
            rows={4}
            name="details"
            placeholder="e.g. 4 ICU night-shift RNs, 2 Cath Lab techs, Epic or Cerner experience, ratio targets, onboarding requirements…"
            className="field-input resize-y"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-ink-3">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          Handled under non-disclosure confidentiality.
        </p>
        <button type="submit" disabled={submitting} className="btn-accent btn-lg">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending request…
            </>
          ) : (
            <>
              Submit staffing order
              <Send className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
