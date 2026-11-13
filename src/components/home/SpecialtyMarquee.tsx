import Link from "next/link";
import { SPECIALTIES } from "@/lib/constants";

/**
 * Infinite, CSS-only marquee of the specialties we staff (21st.dev marquee
 * pattern). Every chip is a real link into the filtered job search. The
 * duplicate set exists only for the seamless loop and is hidden from AT.
 */
export default function SpecialtyMarquee() {
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {SPECIALTIES.map((s) => (
        <li key={s}>
          <Link
            href={`/jobs?specialty=${encodeURIComponent(s)}`}
            tabIndex={hidden ? -1 : undefined}
            className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-bright" aria-hidden />
            {s}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="mask-fade-x overflow-hidden" aria-label="Specialties we staff">
      <div className="marquee-track flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </nav>
  );
}
