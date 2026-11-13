"use client";

import { useState } from "react";
import Link from "next/link";
import { handleApplicationSubmit } from "@/app/actions/application";
import { US_STATES, SPECIALTIES } from "@/lib/constants";
import { AlertCircle, CheckCircle2, FileText, Loader2, Lock, UploadCloud, X } from "lucide-react";

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  defaultSpecialty?: string;
}

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ApplicationForm({ jobId, jobTitle, defaultSpecialty }: ApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; message: string; isPersisted?: boolean } | null>(null);

  const acceptFile = (file: File | undefined | null) => {
    if (!file) return false;
    if (file.size > MAX_SIZE) {
      setErrorMsg("The selected resume file exceeds the 5MB size limit. Please upload a smaller document.");
      setSelectedFile(null);
      return false;
    }
    if (!VALID_TYPES.includes(file.type)) {
      setErrorMsg("Invalid file format. Please upload your resume in PDF (.pdf) or Word (.doc, .docx) format.");
      setSelectedFile(null);
      return false;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!acceptFile(e.target.files?.[0])) e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set("jobId", jobId);
    formData.set("jobTitle", jobTitle);
    if (selectedFile) {
      formData.set("resume", selectedFile);
    }

    const res = await handleApplicationSubmit(formData);
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Submission failed. Please verify your details and try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSuccessData({
        id: res.applicationId || "IHS-APP",
        message: res.message || "Application received.",
        isPersisted: res.isPersisted,
      });
    }
  };

  if (successData) {
    return (
      <div role="status" className="rounded-[1.75rem] border border-line bg-surface p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <h2 className="mt-5 font-display text-2xl font-medium text-ink">Application received</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-2">
          {successData.isPersisted
            ? "Thank you for applying. Your application has been securely recorded in our clinical database. A dedicated clinical recruiter will review your credentials and contact you directly."
            : "Thank you for applying. Your application has been received and routed to our clinical recruitment team. A dedicated clinical recruiter will review your credentials and contact you directly."}
        </p>
        <p className="mt-6 inline-block rounded-xl bg-surface-2 px-4 py-2.5 font-mono text-sm text-ink-2">
          Application ID: <span className="font-semibold text-ink">{successData.id}</span>
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/jobs" className="btn-accent">
            Explore more jobs
          </Link>
          <Link href="/" className="btn-secondary">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-10">
      <div className="border-b border-line pb-6">
        <h2 className="font-display text-2xl font-medium text-ink">Candidate application</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-3">
          Fields marked * are required. Your information is processed under confidential healthcare staffing privacy
          safeguards.
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

      <fieldset className="mt-8">
        <legend className="font-display text-base font-semibold text-ink">Contact details</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ap-name" className="field-label">
              Full legal name *
            </label>
            <input
              id="ap-name"
              required
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="e.g. Christine Adams, RN"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="ap-email" className="field-label">
              Email address *
            </label>
            <input
              id="ap-email"
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="ap-phone" className="field-label">
              Mobile / telephone *
            </label>
            <input
              id="ap-phone"
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="(555) 000-0000"
              className="field-input"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-10 border-t border-line pt-8">
        <legend className="sr-only">Clinical background</legend>
        <p className="font-display text-base font-semibold text-ink" aria-hidden>
          Clinical background
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ap-specialty" className="field-label">
              Primary specialty *
            </label>
            <select
              id="ap-specialty"
              required
              name="specialty"
              defaultValue={defaultSpecialty || SPECIALTIES[0]}
              className="field-input"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ap-years" className="field-label">
              Years of experience *
            </label>
            <select id="ap-years" required name="yearsOfExperience" defaultValue="2-4 Years" className="field-input">
              <option value="1-2 Years">1 - 2 Years</option>
              <option value="2-4 Years">2 - 4 Years</option>
              <option value="5-8 Years">5 - 8 Years</option>
              <option value="8+ Years">8+ Years</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ap-license" className="field-label">
              Primary nursing / clinical license state
            </label>
            <select id="ap-license" name="primaryLicenseState" defaultValue="TX" className="field-input">
              <option value="Compact (eNLC)">Multistate Compact License (eNLC)</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Resume upload */}
          <div className="sm:col-span-2">
            <span className="field-label" id="ap-resume-label">
              Resume / CV
            </span>
            {!selectedFile ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-4 focus-within:ring-brand/15 ${
                  dragging ? "border-brand bg-brand-soft" : "border-line-strong bg-surface-2/50 hover:border-brand/60"
                }`}
              >
                <UploadCloud className="h-8 w-8 text-brand-ink" aria-hidden />
                <span className="mt-3 font-semibold text-ink">Drop your resume here, or browse</span>
                <span className="mt-1 text-sm text-ink-3">PDF, DOC or DOCX — up to 5MB</span>
                <input
                  type="file"
                  aria-labelledby="ap-resume-label"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand/30 bg-brand-soft p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-6 w-6 shrink-0 text-brand-ink" aria-hidden />
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-semibold text-ink">{selectedFile.name}</p>
                    <p className="text-ink-3">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface hover:text-ink"
                  aria-label="Remove uploaded file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ap-note" className="field-label">
              Note to your recruiter <span className="font-normal text-ink-3">(optional)</span>
            </label>
            <textarea
              id="ap-note"
              rows={3}
              name="coverNote"
              placeholder="Available start date, shift preference, certifications (CCRN, TNCC, BLS, ACLS), or facility preferences…"
              className="field-input resize-y"
            />
          </div>
        </div>
      </fieldset>

      <div className="mt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            required
            type="checkbox"
            name="consent"
            defaultChecked
            className="mt-1 h-4 w-4 shrink-0 rounded border-line-strong accent-[rgb(var(--brand))]"
          />
          <span className="text-sm leading-relaxed text-ink-3">
            I certify that the information provided is accurate and authorize Ideal Healthcare Staffing to contact me
            via phone, email, or SMS regarding healthcare staffing opportunities. Resumes are stored in secure, private
            candidate storage in compliance with our{" "}
            <Link href="/privacy-policy" className="link">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-ink-3">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          Encrypted transmission
        </p>
        <button type="submit" disabled={submitting} className="btn-accent btn-lg">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </div>
    </form>
  );
}
