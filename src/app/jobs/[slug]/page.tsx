import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobBySlug, getJobs } from "@/lib/db";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import JobCard from "@/components/JobCard";
import { Reveal } from "@/components/motion/Reveal";
import { COMPANY_INFO } from "@/lib/constants";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Ideal Healthcare Staffing",
    };
  }

  return {
    title: `${job.title} (${job.locationCity}, ${job.locationState})`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} - ${job.specialty}`,
      description: `${job.locationCity}, ${job.locationState} | ${job.employmentType} | ${job.payRange || "Competitive Pay"}`,
    },
  };
}

export const revalidate = 60;

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 leading-relaxed text-ink-2">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailPage(props: JobDetailPageProps) {
  const { slug } = await props.params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const { jobs: allJobs } = await getJobs();
  const relatedJobs = allJobs
    .filter((j) => j.id !== job.id && (j.department === job.department || j.locationState === job.locationState))
    .slice(0, 2);

  const specs = [
    { icon: MapPin, label: "Location", value: `${job.locationCity}, ${job.locationState}` },
    { icon: Briefcase, label: "Contract type", value: job.employmentType },
    { icon: Clock, label: "Shift schedule", value: job.shift },
    { icon: CalendarDays, label: "Duration", value: job.durationWeeks ? `${job.durationWeeks} weeks` : "Contract" },
  ];

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    employmentType: job.employmentType,
    hiringOrganization: { "@type": "Organization", name: COMPANY_INFO.name, sameAs: COMPANY_INFO.website },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.locationCity, addressRegion: job.locationState, addressCountry: "US" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      {/* Header */}
      <section className="border-b border-line bg-surface">
        <div className="container-page pb-10 pt-8 sm:pb-12 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-3">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/jobs" className="hover:text-ink">
              Healthcare jobs
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span aria-current="page" className="max-w-[16rem] truncate font-medium text-ink">
              {job.title}
            </span>
          </nav>

          <div className="rise mt-7 flex flex-wrap items-center gap-2">
            <span className="badge-navy">{job.department}</span>
            <span className="badge-neutral">{job.specialty}</span>
            {job.isUrgent && (
              <span className="badge-urgent">
                <Zap className="h-3.5 w-3.5" aria-hidden />
                Priority opening
              </span>
            )}
          </div>

          <h1
            className="rise mt-5 max-w-4xl font-display text-display font-bold text-ink"
            style={{ "--delay": "0.08s" } as React.CSSProperties}
          >
            {job.title}
          </h1>

          <dl
            className="rise mt-8 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4"
            style={{ "--delay": "0.16s" } as React.CSSProperties}
          >
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-3">
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wider text-ink-3">{label}</dt>
                  <dd className="mt-0.5 font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-page grid items-start gap-10 py-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-8">
          <Reveal>
            <h2 className="font-display text-xl font-bold text-ink">Role overview</h2>
            <p className="mt-4 max-w-prose text-lead text-ink-2">{job.description}</p>
          </Reveal>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <Reveal>
              <DetailList title="Key clinical responsibilities" items={job.responsibilities} />
            </Reveal>
          )}
          {job.qualifications && job.qualifications.length > 0 && (
            <Reveal>
              <DetailList title="Qualifications & licensure" items={job.qualifications} />
            </Reveal>
          )}
          {job.benefits && job.benefits.length > 0 && (
            <Reveal>
              <DetailList title="Comprehensive traveler benefits" items={job.benefits} />
            </Reveal>
          )}
        </div>

        {/* Sticky application panel */}
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-7">
            {job.payRange && (
              <div className="border-b border-line pb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-3">Estimated compensation</p>
                <p className="mt-1.5 font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink">{job.payRange}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  Includes taxable hourly base wage plus non-taxed housing &amp; meals stipends for eligible travelers.
                </p>
              </div>
            )}

            <div className={job.payRange ? "pt-6" : ""}>
              <h2 className="font-display text-lg font-bold text-ink">Interested in this opening?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">
                Submit your profile in under 2 minutes. A clinical recruitment specialist will review your
                credentials and discuss placement.
              </p>
              <div className="mt-6 grid gap-3">
                <Link href={`/apply/${job.id}`} className="btn-accent btn-lg group">
                  Apply for this position
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href={COMPANY_INFO.phoneHref} className="btn-secondary">
                  <Phone className="h-4 w-4 text-brand-ink" aria-hidden />
                  Call {COMPANY_INFO.phone}
                </a>
              </div>
            </div>

            <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm text-ink-2">
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                Primary-source credentialing support
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                Direct deposit weekly payroll
              </li>
              <li className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                Direct hospital system agreement
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {relatedJobs.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="container-page py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-title font-bold text-ink">Similar clinical positions</h2>
              <Link href="/jobs" className="link-arrow group text-sm">
                All jobs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedJobs.map((rj) => (
                <JobCard key={rj.id} job={rj} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky apply bar */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
        <Link href={`/apply/${job.id}`} className="btn-accent w-full">
          Apply for this position
        </Link>
      </div>
    </>
  );
}
