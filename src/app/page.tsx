import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock,
  FileCheck2,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { getJobs } from "@/lib/db";
import JobCard from "@/components/JobCard";
import HomeHero from "@/components/home/HomeHero";
import AudienceTabs from "@/components/home/AudienceTabs";
import SpecialtyMarquee from "@/components/home/SpecialtyMarquee";
import SectionHeading from "@/components/ui/SectionHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ProcessSteps from "@/components/ui/ProcessSteps";
import CtaBand from "@/components/ui/CtaBand";
import { PartnerAffiliationFeature } from "@/components/PartnerAffiliation";
import CountUp from "@/components/motion/CountUp";
import { PopIn, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import PulseLine from "@/components/ui/PulseLine";
import { SPECIALTIES, US_STATES } from "@/lib/constants";

export const revalidate = 60;

const SPECIALTY_CARDS = [
  {
    icon: HeartPulse,
    title: "Critical Care & ICU",
    description: "Experienced Registered Nurses for Medical ICU, Surgical ICU, Neuro ICU, and Cardiovascular ICU units.",
    href: "/jobs?search=ICU",
    cta: "View ICU contracts",
  },
  {
    icon: Activity,
    title: "Emergency & Trauma",
    description: "Triage, Level I/II Trauma, and Emergency Department clinicians ready for acute hospital census demands.",
    href: "/jobs?search=Emergency",
    cta: "View ER contracts",
  },
  {
    icon: Stethoscope,
    title: "Surgical Services & OR",
    description: "Circulating nurses, scrub nurses, and PACU recovery specialists for acute perioperative hospital suites.",
    href: "/jobs?search=OR",
    cta: "View OR contracts",
  },
  {
    icon: Clock,
    title: "Telemetry & Progressive Care",
    description: "Cardiac telemetry, intermediate stepdown, and continuous cardiac monitoring expertise.",
    href: "/jobs?search=Telemetry",
    cta: "View telemetry contracts",
  },
  {
    icon: UserCheck,
    title: "Allied Health & Therapy",
    description: "Physical therapists (PT), occupational therapists (OT), and certified speech pathologists.",
    href: "/jobs?department=Allied+Health",
    cta: "View allied health",
  },
  {
    icon: FileCheck2,
    title: "Diagnostic Imaging & Cath Lab",
    description: "ARRT certified Radiologic Technologists, CT specialists, MRI techs, and Cath Lab technologists.",
    href: "/jobs?department=Imaging",
    cta: "View imaging contracts",
  },
];

const PROCESS = [
  {
    title: "Intake & goal alignment",
    description:
      "We review clinical experience, certifications, target shift hours, and location preferences to identify the right match.",
  },
  {
    title: "Primary-source verification",
    description:
      "Direct state licensing verification, background screenings, health clearance, and clinical competency checklists.",
  },
  {
    title: "Submittal & interview",
    description:
      "Direct file presentation to hospital hiring managers, interview coordination, and transparent contract confirmations.",
  },
  {
    title: "Assignment support",
    description:
      "On-time weekly payroll, liaison check-ins, floor orientation assistance, and seamless contract extension options.",
  },
];

const CREDENTIAL_FILE = [
  { label: "State license", detail: "Verified directly with the state board" },
  { label: "BLS / ACLS / PALS", detail: "AHA certification cards validated" },
  { label: "Background check", detail: "Nationwide, multi-jurisdiction" },
  { label: "Health clearance", detail: "10-panel drug screen, TB & titers" },
  { label: "OIG / GSA exclusions", detail: "Federal exclusion lists checked" },
  { label: "Skills checklist", detail: "Specialty competency & references" },
];

const TRENDING = [
  { href: "/jobs?search=ICU", label: "ICU Registered Nurse" },
  { href: "/jobs?search=Emergency", label: "Emergency Room (ER)" },
  { href: "/jobs?search=OR", label: "Operating Room (OR)" },
  { href: "/jobs?department=Allied+Health", label: "Allied Health & Therapy" },
];

export default async function HomePage() {
  const { jobs, total } = await getJobs();
  const featuredJobs = jobs.slice(0, 4);
  const openPositions = total || jobs.length;

  return (
    <>
      <HomeHero />

      {/* ================================================================
          SEARCH · SPECIALTY MARQUEE · KEY FACTS
          ================================================================ */}
      <section aria-labelledby="search-heading" className="relative z-10 -mt-16 lg:-mt-24">
        <div className="container-page">
          <Reveal className="rounded-[2rem] border border-line bg-surface p-5 shadow-lift sm:p-8">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="search-heading" className="font-display text-2xl font-medium text-ink">
                Find your next assignment
              </h2>
              <p className="text-sm text-ink-3">Direct hospital orders · Weekly competitive pay</p>
            </div>

            <form action="/jobs" method="GET" className="grid gap-3 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <label htmlFor="home-search" className="sr-only">
                  Role or specialty
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                  aria-hidden
                />
                <input
                  id="home-search"
                  type="text"
                  name="search"
                  placeholder="Role or specialty — e.g. ICU RN, Med Surg, ER"
                  className="field-input pl-11"
                />
              </div>
              <div className="md:col-span-3">
                <label htmlFor="home-specialty" className="sr-only">
                  Specialty
                </label>
                <select id="home-specialty" name="specialty" defaultValue="all" className="field-input">
                  <option value="all">All specialties</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="home-state" className="sr-only">
                  State
                </label>
                <select id="home-state" name="state" defaultValue="all" className="field-input">
                  <option value="all">All states</option>
                  {US_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-accent md:col-span-2 md:rounded-xl">
                <Search className="h-4 w-4" aria-hidden />
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 text-ink-3">Popular:</span>
              {TRENDING.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="rounded-full bg-surface-2 px-3.5 py-1.5 text-ink-2 transition-colors hover:bg-brand-soft hover:text-brand-ink"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <p className="container-page mb-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">
            Now staffing across {SPECIALTIES.length} clinical specialties
          </p>
          <SpecialtyMarquee />
        </div>

        {/* Facts — all derived from real data or stated service levels */}
        <div className="container-page">
          <Stagger className="mt-16 grid grid-cols-2 gap-y-10 lg:grid-cols-4" as="ul">
            {[
              { value: <CountUp value={openPositions} />, label: "Open positions right now" },
              { value: <CountUp value={SPECIALTIES.length} />, label: "Clinical specialties supported" },
              { value: "24–48h", label: "Candidate presentation for urgent needs" },
              { value: "Day 1", label: "Medical, dental & vision eligibility" },
            ].map((stat, i) => (
              <StaggerItem
                as="li"
                key={stat.label}
                className={`px-2 text-center sm:px-6 lg:text-left ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
              >
                <p className="font-display text-5xl font-medium tracking-tight text-brand-ink sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mx-auto mt-3 max-w-[14rem] text-sm text-ink-3 lg:mx-0">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================================================
          TWO AUDIENCES — interactive split panels
          ================================================================ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Two audiences, one mission"
            title={
              <>
                Staffing that works for <span className="em">everyone</span> in the room.
              </>
            }
            description="Whether you are advancing your travel career or staffing an acute care hospital unit, Ideal Healthcare Staffing delivers responsive service and professional integrity."
          />
          <Reveal delay={0.1} className="mt-12">
            <AudienceTabs />
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          AFFILIATION — Hospitals Without Walls®
          ================================================================ */}
      <PartnerAffiliationFeature />

      {/* ================================================================
          FEATURED JOBS
          ================================================================ */}
      <section className="section border-y border-line bg-surface-2/60">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Verified clinical openings"
              title="Featured hospital positions"
              description="Verified 13-week travel contracts and direct hospital orders with competitive weekly compensation."
            />
            <Reveal>
              <Link href="/jobs" className="btn-secondary group shrink-0">
                View all open positions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {featuredJobs.map((job) => (
              <StaggerItem key={job.id} className="h-full">
                <JobCard job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================================================
          SPECIALTIES
          ================================================================ */}
      <section id="specialties" className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Clinical disciplines"
            title="Specialties we staff every day."
            description="We specialize across high-demand clinical units, providing primary credentialing and responsive placement coordination."
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" as="ul">
            {SPECIALTY_CARDS.map(({ icon: Icon, ...card }, i) => (
              <StaggerItem as="li" key={card.title} className="h-full">
                <SpotlightCard className="h-full rounded-[1.75rem] border border-line bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand/35">
                  <Link href={card.href} className="group flex h-full flex-col p-7 sm:p-8">
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-[10deg] group-hover:scale-[1.18] ${
                          i % 3 === 1 ? "bg-accent-soft text-accent-ink" : "bg-brand-soft text-brand-ink"
                        }`}
                      >
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="font-display text-sm text-ink-3 transition-colors duration-300 group-hover:text-accent-ink">0{i + 1}</span>
                    </div>
                    <h3 className="mt-7 font-display text-[1.375rem] font-medium text-ink">{card.title}</h3>
                    <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-3">{card.description}</p>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                      {card.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================================================
          PROCESS — deep spruce band for rhythm
          ================================================================ */}
      <section className="px-3 sm:px-4">
        <div className="relative mx-auto max-w-[90rem] overflow-hidden rounded-[2.25rem] bg-spruce py-20 sm:py-24 lg:py-28">
          <div className="absolute inset-0 bg-dots-light" aria-hidden />
          <div className="drift-a absolute -left-24 top-0 h-80 w-80 rounded-full bg-teal-400/20 blur-[110px]" aria-hidden />
          <div className="drift-b absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-coral-400/10 blur-[110px]" aria-hidden />
          <PulseLine className="absolute inset-x-0 bottom-3 h-16 w-full text-white opacity-60" />
          <div className="container-page relative">
            <SectionHeading
              onDark
              align="center"
              eyebrow="Our methodology"
              title={
                <>
                  The Ideal <span className="em em-on-dark">staffing</span> process
                </>
              }
              description="A straightforward, transparent process designed to support clinician careers and hospital staffing continuity."
            />
            <div className="mt-16">
              <ProcessSteps steps={PROCESS} onDark />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CREDENTIALING & GOVERNANCE
          ================================================================ */}
      <section className="section">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Clinical governance"
              title="Primary-source verified clinicians. Rigorous healthcare standards."
              description="Every clinician represented by Ideal Healthcare Staffing undergoes comprehensive background checks, direct state licensure validation, specialty skills verification, and healthcare compliance clearance before assignment presentation."
            />
            <Reveal delay={0.1} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className="btn-accent">
                Browse current contracts
              </Link>
              <Link href="/facilities#inquiry-form" className="btn-secondary">
                Staffing coverage inquiry
              </Link>
            </Reveal>
          </div>

          {/* Illustrative "clinician file" — what each submission includes */}
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-dots" aria-hidden />
              <div className="relative rounded-[2rem] border border-line bg-surface p-6 shadow-lift sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                      <ShieldCheck className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-lg font-medium text-ink">Every clinician file includes</p>
                      <p className="text-sm text-ink-3">Reviewed before any submission</p>
                    </div>
                  </div>
                  <span className="badge-coral hidden sm:inline-flex">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Joint Commission aligned
                  </span>
                </div>
                <Stagger as="ul" className="divide-y divide-line" stagger={0.09}>
                  {CREDENTIAL_FILE.map((item) => (
                    <StaggerItem as="li" variant="left" key={item.label} className="flex items-center gap-4 py-4">
                      <PopIn className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-on">
                        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                      </PopIn>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{item.label}</span>
                        <span className="block text-sm text-ink-3">{item.detail}</span>
                      </span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Exceptional people.
            <br className="hidden sm:block" /> Exceptional <span className="em em-on-dark">care.</span>
          </>
        }
        description="Find your next assignment or secure dependable coverage for your units — our coordinators respond quickly."
      />
    </>
  );
}
