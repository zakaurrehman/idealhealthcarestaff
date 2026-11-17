import Link from "next/link";
import { Job } from "@/types";
import { ArrowUpRight, Briefcase, Clock, MapPin, Zap } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift sm:p-7">
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-teal">{job.department}</span>
        <span className="badge-neutral">{job.specialty}</span>
        {job.isUrgent && (
          <span className="badge-urgent ml-auto">
            <Zap className="h-3.5 w-3.5 animate-pulse" aria-hidden />
            Priority need
          </span>
        )}
      </div>

      {/* Title — the whole card is clickable via the stretched link */}
      <h3 className="mt-5 font-display text-[1.375rem] font-medium leading-snug text-ink sm:text-2xl">
        <Link
          href={`/jobs/${job.slug}`}
          className="after:absolute after:inset-0 after:rounded-[1.75rem] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-bright"
        >
          {job.title}
        </Link>
      </h3>

      {/* Meta */}
      <dl className="mt-4 grid gap-2 text-sm text-ink-2">
        <div className="flex items-center gap-2.5">
          <dt className="sr-only">Location</dt>
          <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <dd className="font-medium text-ink">
            {job.locationCity}, {job.locationState}
          </dd>
        </div>
        <div className="flex items-center gap-2.5">
          <dt className="sr-only">Contract type</dt>
          <Briefcase className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
          <dd>
            {job.employmentType}
            {job.durationWeeks ? ` · ${job.durationWeeks} weeks` : ""}
          </dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Shift</dt>
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
          <dd className="line-clamp-1">{job.shift}</dd>
        </div>
      </dl>

      <p className="mb-6 mt-4 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-3">{job.description}</p>

      {/* Pay + actions */}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-3">
            {job.payRange ? "Estimated pay" : "Compensation"}
          </p>
          <p className="mt-1 font-display text-xl font-medium text-ink">{job.payRange || "Competitive rate"}</p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Link href={`/apply/${job.id}`} className="btn-accent btn-sm">
            Apply now
          </Link>
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-3 transition-colors group-hover:border-brand/40 group-hover:bg-brand-soft group-hover:text-brand-ink"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
