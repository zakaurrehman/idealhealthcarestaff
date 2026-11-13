import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy & Clinical Compliance",
  description:
    "Review Ideal Healthcare Staffing's privacy policy, candidate data protection practices, and clinical compliance protocols.",
};

const SECTIONS = [
  { id: "commitment", title: "Commitment to candidate privacy" },
  { id: "information", title: "Information we collect" },
  { id: "storage", title: "Private resume storage" },
  { id: "eeo", title: "Equal Opportunity Employer" },
  { id: "credentialing", title: "Primary source verification" },
  { id: "communication", title: "Communication & unsubscribe" },
  { id: "contact", title: "Contact our compliance office" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page pb-12 pt-8 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-3">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span aria-current="page" className="font-medium text-ink">
              Privacy &amp; compliance
            </span>
          </nav>
          <p className="eyebrow rise mt-8">Healthcare staffing data protection</p>
          <h1
            className="rise mt-4 max-w-3xl font-display text-display font-medium text-ink"
            style={{ "--delay": "0.08s" } as React.CSSProperties}
          >
            Privacy policy &amp; compliance terms
          </h1>
          <p className="rise mt-4 text-ink-3" style={{ "--delay": "0.16s" } as React.CSSProperties}>
            Last updated {new Date().getFullYear()} · Ideal Healthcare Staffing LLC
          </p>
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        {/* Table of contents */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">On this page</p>
            <ol className="mt-4 space-y-1 border-l border-line">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-ink-3 transition-colors hover:border-brand-bright hover:text-ink"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-prose space-y-12 text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-9">
          <section id="commitment" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">1. Commitment to clinical candidate privacy</h2>
            <p>
              Ideal Healthcare Staffing (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              respects the confidentiality of healthcare professionals and institutional facility partners. This
              Privacy Policy governs the collection, use, transmission, and secure retention of personally
              identifiable information (PII) and professional clinical credentials submitted through our digital portal
              and recruitment communication channels.
            </p>
          </section>

          <section id="information" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">2. Information we collect</h2>
            <p>
              To effectively match clinicians with hospital assignments and verify primary-source qualifications, we
              collect:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-brand-bright">
              <li>Full legal name, contact telephone numbers, postal address, and email addresses.</li>
              <li>State professional nursing or allied health license numbers and expiration dates.</li>
              <li>Clinical certifications (AHA BLS, ACLS, PALS, TNCC, CCRN, etc.).</li>
              <li>Curriculum vitae / resume, work history, clinical specialties, and unit experience.</li>
              <li>Facility contact details, staffing requirements, and census coverage specifications.</li>
            </ul>
          </section>

          <section id="storage" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">
              3. Private resume storage &amp; candidate representation
            </h2>
            <p>
              Resumes and clinical credential files uploaded through our portal are stored in private, encrypted cloud
              storage buckets. We enforce strict role-based access controls to guarantee that candidate files are never
              accessible to the public internet. Furthermore, we never submit a clinician&apos;s profile or credentials
              to any healthcare facility or vendor management system (VMS) without first discussing the assignment and
              obtaining explicit verbal or written authorization.
            </p>
          </section>

          <section id="eeo" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">4. Equal Opportunity Employer (EOE) policy</h2>
            <p>
              Ideal Healthcare Staffing is an Equal Opportunity Employer. We maintain a zero-tolerance policy against
              unlawful discrimination or harassment in recruitment, placement, pay rates, or terms of assignment based
              upon race, color, religion, sex, sexual orientation, gender identity, national origin, disability, veteran
              status, genetic information, or any other characteristic protected by federal, state, or local laws.
            </p>
          </section>

          <section id="credentialing" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">
              5. Primary source verification &amp; compliance standards
            </h2>
            <p>
              In accordance with Joint Commission healthcare staffing standards, all candidates placed in hospital
              settings undergo rigorous primary-source verification, including active license status checks directly
              with state licensing boards, Office of Inspector General (OIG) exclusions, General Services Administration
              (GSA) checks, and 10-panel drug screening.
            </p>
          </section>

          <section id="communication" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">6. Communication &amp; unsubscribe rights</h2>
            <p>
              By submitting an application or subscribing to job alerts, you consent to receive direct communications
              regarding clinical opportunities via email, phone, or SMS. You may opt out or unsubscribe from
              notifications at any time by following the instructions in alert messages or by contacting our office by
              phone at {COMPANY_INFO.phone}.
            </p>
          </section>

          <section id="contact" className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-ink">7. Contact our compliance office</h2>
            <p>
              For questions regarding candidate data protection, state privacy rights (such as CCPA requests), or
              credentialing verification, please contact:
            </p>
            <address className="not-italic rounded-3xl border border-line bg-surface p-6 text-[0.9375rem]">
              <p className="font-display text-lg font-semibold text-ink">{COMPANY_INFO.name}</p>
              <p className="mt-2">{COMPANY_INFO.address}</p>
              <p className="mt-1">
                Phone:{" "}
                <a href={COMPANY_INFO.phoneHref} className="link">
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="mt-1">Fax: {COMPANY_INFO.fax}</p>
              <p className="mt-1">
                Website:{" "}
                <a href={COMPANY_INFO.website} target="_blank" rel="noopener noreferrer" className="link">
                  idealhealthcarestaff.com
                </a>
              </p>
            </address>
          </section>
        </article>
      </div>
    </>
  );
}
