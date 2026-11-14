import Image from "next/image";
import { ArrowUpRight, Check, HeartHandshake } from "lucide-react";
import { AFFILIATE } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";

const CARE_AREAS = [
  "Home-based & transitional care",
  "Telehealth & remote monitoring",
  "Chronic disease management",
  "Palliative & supportive care",
];

/** Full homepage section: affiliation badge beside the explanation. */
export function PartnerAffiliationFeature() {
  return (
    <section aria-labelledby="affiliation-heading" className="section pt-0">
      <div className="container-page">
        <Reveal className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-12">
          {/* Badge — shown whole, never cropped */}
          <div className="lg:col-span-6">
            <a
              href={AFFILIATE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-line transition-shadow hover:shadow-lift"
            >
              <Image
                src={AFFILIATE.image}
                alt={`Ideal Healthcare Staffing — proudly affiliated with ${AFFILIATE.name}®, ${AFFILIATE.tagline.toLowerCase()}`}
                width={1536}
                height={1024}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
              />
            </a>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow">Our affiliation</p>
            <h2 id="affiliation-heading" className="mt-5 font-display text-display font-medium text-ink">
              Proudly affiliated with <span className="em">{AFFILIATE.name}®</span>
            </h2>
            <p className="mt-5 text-lead text-ink-2">
              {AFFILIATE.name} is a coordinated care model that brings healthcare closer to patients — wherever they call
              home. Together, we connect qualified clinicians with care delivered beyond traditional hospital walls.
            </p>
            <ul className="mt-7 grid gap-3 text-[0.9375rem] text-ink-2 sm:grid-cols-2">
              {CARE_AREAS.map((area) => (
                <li key={area} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <a href={AFFILIATE.url} target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                Visit {AFFILIATE.name}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Compact strip for the facilities page. */
export function PartnerAffiliationStrip() {
  return (
    <section aria-label={`Affiliation with ${AFFILIATE.name}`} className="container-page pb-20 sm:pb-24">
      <Reveal className="flex flex-col items-center gap-6 rounded-[1.75rem] border border-line bg-surface p-6 sm:flex-row sm:gap-8 sm:p-8">
        <a
          href={AFFILIATE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[16rem] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-line"
        >
          <Image
            src={AFFILIATE.image}
            alt={`Proudly affiliated with ${AFFILIATE.name}®`}
            width={1536}
            height={1024}
            sizes="256px"
            className="h-auto w-full"
          />
        </a>
        <div className="flex-1 text-center sm:text-left">
          <p className="eyebrow justify-center sm:justify-start">Care beyond the hospital</p>
          <h2 className="mt-3 font-display text-title font-medium text-ink">
            Affiliated with {AFFILIATE.name}®
          </h2>
          <p className="mt-2 text-ink-2">
            Supporting coordinated home-based, transitional, and telehealth care programs with credentialed clinical
            staff.
          </p>
        </div>
        <a
          href={AFFILIATE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary btn-sm group shrink-0"
        >
          <HeartHandshake className="h-4 w-4 text-brand-ink" aria-hidden />
          Learn more
          <span className="sr-only">about {AFFILIATE.name} (opens in a new tab)</span>
        </a>
      </Reveal>
    </section>
  );
}
