import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  HeartPulse,
  MapPin,
  Phone,
  Plus,
  Printer,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import FacilityInquiryForm from "@/components/FacilityInquiryForm";
import SectionHeading from "@/components/ui/SectionHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ProcessSteps from "@/components/ui/ProcessSteps";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Healthcare Facilities Staffing Solutions | Hospital Clinical Coverage",
  description:
    "Partner with Ideal Healthcare Staffing for pre-credentialed travel nurses, allied health specialists, and responsive staffing coverage across acute care hospitals.",
};

const SERVICES = [
  {
    icon: HeartPulse,
    title: "Travel Nursing (13-Week Contracts)",
    description:
      "Experienced Registered Nurses ready for immediate floor integration across ICU, Emergency, Med/Surg, Telemetry, OR, and NICU units.",
    points: [
      "Hospital bedside experience across specialized units",
      "Standard 36 or 48-hour weekly contract commitments",
      "Contract extensions and direct permanent conversion terms",
    ],
    cta: "Request travel nurses",
  },
  {
    icon: Clock,
    title: "Rapid Response Coverage",
    description:
      "Fast candidate matching for unexpected census surges, unit expansions, EMR rollouts, or critical hospital leaves.",
    points: [
      "Expedited candidate profile presentation",
      "Short-term and flexible duration crisis assignments",
      "Adaptable, pre-screened critical care clinicians",
    ],
    cta: "Request rapid coverage",
  },
  {
    icon: Stethoscope,
    title: "Allied Health & Therapy",
    description:
      "Diagnostic imaging technicians, respiratory care practitioners, and rehabilitation therapists to keep departmental workflows on schedule.",
    points: [
      "ARRT certified CT, MRI, and Rad Technologists",
      "Certified Respiratory Care Practitioners (RRT)",
      "Licensed PT, OT, and SLP rehabilitation therapists",
    ],
    cta: "Request allied staff",
  },
];

const STANDARDS = [
  {
    title: "Licensure & background",
    description:
      "Direct state licensing verification with disciplinary action checks and nationwide multi-jurisdiction criminal background clearance.",
  },
  {
    title: "Clinical health screenings",
    description:
      "Comprehensive 10-panel drug screens, TB clearance, immunization titers (MMR, Varicella, Hep B), and annual fit testing.",
  },
  {
    title: "Interview & confirmation",
    description:
      "Brief manager interviews with your unit director and clear working confirmations with start dates.",
  },
  {
    title: "Orientation & support",
    description:
      "Candidate reports for hospital orientation. Our staffing coordinator conducts ongoing check-ins to ensure quality care.",
  },
];

const FAQS = [
  {
    q: "What primary source credentialing documents are provided?",
    a: "Every candidate file includes direct state board license verification, AHA BLS/ACLS/PALS certification cards, 10-panel drug screening, nationwide criminal background checks, immunization/titer records, and clinical competency checklists.",
  },
  {
    q: "What happens if a placed clinician is not an optimal clinical fit?",
    a: "We maintain an orientation guarantee period during which the facility may request an immediate replacement if a clinician does not meet the unit’s clinical performance standards.",
  },
  {
    q: "Can our facility convert a traveler to full-time hospital staff?",
    a: "Yes. Our agreements outline straightforward permanent conversion terms after completion of standard contract commitments.",
  },
];

export default function FacilitiesPage() {
  return (
    <>
      {/* ================================================================
          HERO — deep spruce marks the facility (B2B) side of the brand
          ================================================================ */}
      <section className="px-3 pt-3 sm:px-4">
       <div className="relative mx-auto max-w-[90rem] overflow-hidden rounded-[2.25rem] bg-spruce text-white">
        <div className="absolute inset-0 bg-dots-light" aria-hidden />
        <div
          className="absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-400/15 blur-[120px]"
          aria-hidden
        />
        <div
          className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-coral-400/10 blur-[110px]"
          aria-hidden
        />

        <div className="container-page relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="eyebrow eyebrow-on-dark rise">Hospital &amp; facility workforce solutions</p>
            <h1
              className="rise mt-6 font-display text-display-xl font-medium text-white"
              style={{ "--delay": "0.1s" } as React.CSSProperties}
            >
              Dependable staffing that protects patient <span className="em em-on-dark">care</span> continuity.
            </h1>
            <p
              className="rise mt-6 max-w-xl text-lead text-spruce-50/75"
              style={{ "--delay": "0.25s" } as React.CSSProperties}
            >
              Ideal Healthcare Staffing delivers pre-screened, primary-source verified travel nurses, allied
              clinicians, and per diem staff to acute care health systems nationwide.
            </p>
            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ "--delay": "0.4s" } as React.CSSProperties}
            >
              <a href="#inquiry-form" className="btn-light btn-lg group">
                Request Staffing Coverage
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={COMPANY_INFO.phoneHref} className="btn-on-dark btn-lg">
                <Phone className="h-4 w-4 text-coral-300" aria-hidden />
                Call {COMPANY_INFO.phone}
              </a>
            </div>
            <ul
              className="rise mt-12 grid gap-4 border-t border-white/10 pt-8 text-sm text-spruce-50/80 sm:grid-cols-3"
              style={{ "--delay": "0.55s" } as React.CSSProperties}
            >
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 shrink-0 text-teal-300" aria-hidden />
                Primary-source verified
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 shrink-0 text-teal-300" aria-hidden />
                Responsive coordinators
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-5 w-5 shrink-0 text-teal-300" aria-hidden />
                Los Angeles &amp; nationwide
              </li>
            </ul>
          </div>

          {/* Photo stays in its own frame; the caption sits below it, never on faces */}
          <div
            className="rise relative lg:col-span-6"
            style={{ "--delay": "0.2s", "--rise": "32px" } as React.CSSProperties}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
              <Image
                src="/images/nurse-clinical-care.jpg"
                alt="Nurse in red scrubs taking a patient's blood pressure in a bright clinic room"
                fill
                priority
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-400/15 text-coral-300">
                <HeartPulse className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-lg font-medium text-white">Adaptive workforce partnerships</p>
                <p className="mt-1 text-sm leading-relaxed text-spruce-50/70">
                  From single traveler placements to multi-unit census coverage, matched to your exact clinical and
                  shift requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
       </div>
      </section>

      {/* ================================================================
          SERVICES
          ================================================================ */}
      <section id="services" className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Clinical solutions"
            title="Staffing services built around real hospital operations."
            description="Structured around actual operational hospital requirements and verifiable compliance standards."
          />

          <Stagger className="mt-14 grid gap-6 lg:grid-cols-3" as="ul">
            {SERVICES.map(({ icon: Icon, ...svc }) => (
              <StaggerItem as="li" key={svc.title} className="h-full">
                <SpotlightCard className="flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand/35 sm:p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-[1.375rem] font-medium text-ink">{svc.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{svc.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-ink-2">
                    {svc.points.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a href="#inquiry-form" className="link-arrow group mt-auto pt-8 text-sm">
                    {svc.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================================================
          CREDENTIALING STANDARDS
          ================================================================ */}
      <section className="section border-y border-line bg-surface">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Quality assurance"
            title="Rigorous credentialing standards"
            description="Every clinician file submitted to your hospital undergoes comprehensive primary-source verification before presentation."
          />
          <div className="mt-16">
            <ProcessSteps steps={STANDARDS} />
          </div>
        </div>
      </section>

      {/* ================================================================
          INQUIRY FORM
          ================================================================ */}
      <section id="inquiry-form" className="section">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Facility inquiries"
                title="Submit a staffing request"
                description="Our staffing coordinators will review your clinical requirements and contact you promptly with qualified candidate profiles."
              />

              <Reveal delay={0.1} className="mt-10 space-y-6">
                <ol className="space-y-5">
                  {[
                    ["Share your requirements", "Specialties, shifts, EMR and start timeline."],
                    ["Coordinator review", "We match against verified, available clinicians."],
                    ["Profiles presented", "Within 24–48 hours for emergency surge needs."],
                  ].map(([title, text], i) => (
                    <li key={title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-medium text-brand-ink">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{title}</span>
                        <span className="text-sm text-ink-3">{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="rounded-3xl border border-line bg-surface p-6">
                  <p className="text-sm text-ink-3">Prefer to speak with a coordinator?</p>
                  <a
                    href={COMPANY_INFO.phoneHref}
                    className="mt-2 inline-flex items-center gap-2 font-display text-xl font-medium text-ink hover:text-brand-ink"
                  >
                    <Phone className="h-5 w-5 text-brand-ink" aria-hidden />
                    {COMPANY_INFO.phone}
                  </a>
                  <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
                    <Printer className="h-4 w-4" aria-hidden />
                    Fax {COMPANY_INFO.fax}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-ink-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    All inquiries are handled under non-disclosure confidentiality.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <FacilityInquiryForm />
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section className="section border-t border-line bg-surface">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Facility questions" title="Frequently asked questions" />
          </div>
          <Stagger className="divide-y divide-line border-y border-line lg:col-span-8">
            {FAQS.map((faq) => (
              <StaggerItem key={faq.q}>
                <details className="group py-2 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-xl py-5 font-display text-lg font-semibold text-ink">
                    {faq.q}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 transition-transform duration-300 group-open:rotate-45 group-open:border-brand/40 group-open:text-brand-ink">
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="max-w-prose pb-6 pr-12 leading-relaxed text-ink-2">{faq.a}</p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
