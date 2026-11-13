import type { Metadata } from "next";
import Link from "next/link";
import { getJobById } from "@/lib/db";
import ApplicationForm from "@/components/ApplicationForm";
import { ArrowLeft, Briefcase, Clock, MapPin, Phone, ShieldCheck, UserCheck, Wallet } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata(props: ApplyPageProps): Promise<Metadata> {
  const { jobId } = await props.params;
  const job = await getJobById(jobId);

  return {
    title: job ? `Apply for ${job.title}` : "Submit Clinical Application",
    description:
      "Submit your application and resume to Ideal Healthcare Staffing for review by our clinical placement specialists.",
    robots: { index: false, follow: true },
  };
}

export const revalidate = 60;

export default async function ApplyPage(props: ApplyPageProps) {
  const { jobId } = await props.params;
  const job = await getJobById(jobId);

  const jobTitle = job ? job.title : "General Clinical Candidate Application";
  const defaultSpecialty = job ? job.specialty : undefined;

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href={job ? `/jobs/${job.slug}` : "/jobs"}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {job ? "Back to job details" : "Back to all jobs"}
      </Link>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Context column */}
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <p className="eyebrow rise">{job ? "Applying for" : "General application"}</p>
          <h1
            className="rise mt-4 font-display text-title font-bold text-ink sm:text-[2.25rem] sm:leading-[1.12]"
            style={{ "--delay": "0.08s" } as React.CSSProperties}
          >
            {job ? job.title : "Share your clinical profile"}
          </h1>

          {job ? (
            <ul className="rise mt-6 space-y-3 text-[0.9375rem] text-ink-2" style={{ "--delay": "0.16s" } as React.CSSProperties}>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-ink-3" aria-hidden />
                {job.locationCity}, {job.locationState}
              </li>
              <li className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-ink-3" aria-hidden />
                {job.employmentType}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                {job.shift}
              </li>
              {job.payRange && (
                <li className="flex items-center gap-3 font-semibold text-ink">
                  <Wallet className="h-4 w-4 text-brand-ink" aria-hidden />
                  {job.payRange}
                </li>
              )}
            </ul>
          ) : (
            <p className="rise mt-4 leading-relaxed text-ink-2" style={{ "--delay": "0.16s" } as React.CSSProperties}>
              Not seeing the right role? Our coordinators have access to unadvertised hospital requests and upcoming
              contract blocks.
            </p>
          )}

          <div className="mt-8 space-y-4 rounded-3xl border border-line bg-surface p-6 text-sm text-ink-2">
            <p className="flex gap-3">
              <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" aria-hidden />A dedicated recruiter reviews
              every application personally.
            </p>
            <p className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
              Your resume is never shared without your prior consent.
            </p>
            <a href={COMPANY_INFO.phoneHref} className="flex gap-3 font-semibold text-ink hover:text-brand-ink">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
              Questions? Call {COMPANY_INFO.phone}
            </a>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <ApplicationForm jobId={jobId} jobTitle={jobTitle} defaultSpecialty={defaultSpecialty} />

          <p className="mt-6 text-center text-sm leading-relaxed text-ink-3">
            Review our{" "}
            <Link href="/privacy-policy" className="link">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy#eeo" className="link">
              Equal Employment Opportunity
            </Link>{" "}
            commitments.
          </p>
        </div>
      </div>
    </div>
  );
}
