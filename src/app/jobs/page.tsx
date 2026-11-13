import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Phone, SearchX } from "lucide-react";
import { getJobs } from "@/lib/db";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Find Healthcare Jobs | Travel Nursing & Allied Positions",
  description:
    "Search verified travel nurse, allied health, and direct-hire clinical jobs across leading US health systems. High pay packages and day-one benefits.",
};

export const revalidate = 30;

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    department?: string;
    specialty?: string;
    state?: string;
    employmentType?: string;
    sortBy?: "newest" | "pay";
  }>;
}

export default async function JobsPage(props: JobsPageProps) {
  const searchParams = await props.searchParams;

  const filters = {
    search: searchParams.search || "",
    department: searchParams.department || "all",
    specialty: searchParams.specialty || "all",
    state: searchParams.state || "all",
    employmentType: searchParams.employmentType || "all",
    sortBy: searchParams.sortBy || "newest",
  };

  const { jobs, total } = await getJobs(filters);

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-surface">
        <div className="container-page pb-10 pt-8 sm:pb-12 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-3">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span aria-current="page" className="font-medium text-ink">
              Clinical jobs
            </span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow rise">Verified hospital orders</p>
              <h1
                className="rise mt-4 font-display text-display font-bold text-ink"
                style={{ "--delay": "0.08s" } as React.CSSProperties}
              >
                Healthcare job opportunities
              </h1>
              <p
                className="rise mt-4 text-lead text-ink-2"
                style={{ "--delay": "0.16s" } as React.CSSProperties}
              >
                Explore verified travel nursing, therapy, allied health, and permanent clinical positions. Filter by
                specialty, state, and contract type.
              </p>
            </div>
            <p className="rise flex items-center gap-2.5 text-sm text-ink-3" style={{ "--delay": "0.24s" } as React.CSSProperties}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright opacity-50 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-bright" />
              </span>
              <span>
                <strong className="font-semibold text-ink">{total}</strong> active{" "}
                {total === 1 ? "opening" : "openings"}
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-3xl border border-line bg-surface" />}>
          <JobFilters />
        </Suspense>

        {/* Results meta */}
        <div className="mb-6 flex items-center justify-between gap-4" aria-live="polite">
          <p className="text-[0.9375rem] text-ink-2">
            Showing <strong className="font-semibold text-ink">{jobs.length}</strong>{" "}
            {jobs.length === 1 ? "position" : "positions"}
            {total > jobs.length && ` of ${total}`}
          </p>
          <p className="hidden text-sm text-ink-3 sm:block">
            Sorted by{" "}
            <span className="font-medium text-ink">{filters.sortBy === "pay" ? "highest pay" : "most recent"}</span>
          </p>
        </div>

        {jobs.length > 0 ? (
          <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.06}>
            {jobs.map((job) => (
              <StaggerItem key={job.id} className="h-full">
                <JobCard job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mx-auto my-8 max-w-lg rounded-[1.75rem] border border-line bg-surface p-10 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
              <SearchX className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">No matching clinical jobs found</h2>
            <p className="mt-2 leading-relaxed text-ink-3">
              We couldn&apos;t find positions matching your criteria. Try adjusting or resetting your specialty and
              location filters.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/jobs" className="btn-accent">
                Clear all filters
              </Link>
              <Link href="/apply/general" className="btn-secondary">
                Submit a general profile
              </Link>
            </div>
          </div>
        )}

        {/* Recruiter banner — image and copy side by side, never overlapping */}
        <Reveal className="mt-20 overflow-hidden rounded-[2rem] bg-navy-950 text-white">
          <div className="grid lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:col-span-5 lg:aspect-auto">
              <Image
                src="/images/nurse-portrait-teal.jpg"
                alt="Smiling nurse in teal scrubs"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <div className="p-8 sm:p-12 lg:col-span-7 lg:p-14">
              <p className="eyebrow eyebrow-on-dark">Looking for something specific?</p>
              <h2 className="mt-4 font-display text-title font-bold text-white sm:text-[2.25rem] sm:leading-[1.12]">
                Speak directly with an Ideal Healthcare recruitment specialist.
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-slate-300">
                Our clinical placement coordinators maintain direct access to unadvertised hospital requests, rapid
                response units, and upcoming contract blocks across leading medical networks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/apply/general" className="btn-accent group">
                  Submit a general profile
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href={COMPANY_INFO.phoneHref} className="btn-on-dark">
                  <Phone className="h-4 w-4 text-green-400" aria-hidden />
                  Call {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
