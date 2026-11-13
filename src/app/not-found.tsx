import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-lg text-center">
        <p className="eyebrow justify-center">404 · Page not found</p>
        <h1 className="mt-5 font-display text-display font-medium text-ink">We couldn&apos;t find that page.</h1>
        <p className="mt-5 text-lead text-ink-2">
          The clinical resource, job listing, or page you requested may have moved or been filled.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/jobs" className="btn-accent">
            <Search className="h-4 w-4" aria-hidden />
            Search available jobs
          </Link>
          <Link href="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
