import Link from "next/link";
import { Globe, Lock, MapPin, Phone, Printer } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import Logo from "@/components/Logo";

const COLUMNS = [
  {
    title: "For Clinicians",
    links: [
      { href: "/jobs", label: "Explore Travel Jobs" },
      { href: "/jobs?search=ICU", label: "ICU & Critical Care" },
      { href: "/jobs?search=Emergency", label: "Emergency Room (ER)" },
      { href: "/jobs?search=OR", label: "Operating Room (OR)" },
      { href: "/jobs?department=Allied+Health", label: "Allied Health & Therapy" },
      { href: "/apply/general", label: "Submit a General Profile" },
    ],
  },
  {
    title: "For Facilities",
    links: [
      { href: "/facilities", label: "Hospital Solutions" },
      { href: "/facilities#services", label: "Rapid Response Coverage" },
      { href: "/facilities#services", label: "13-Week Travel Contracts" },
      { href: "/facilities#services", label: "Allied Staffing Placement" },
      { href: "/facilities#inquiry-form", label: "Submit Staffing Request" },
    ],
  },
  {
    title: "Governance",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy & HIPAA" },
      { href: "/privacy-policy#eeo", label: "Equal Opportunity Employer" },
      { href: "/privacy-policy#credentialing", label: "Primary-Source Verification" },
      { href: "/#specialties", label: "Specialty Directory" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-spruce text-spruce-50/75">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo variant="onDark" size="lg" />
            <p className="mt-7 font-display text-2xl font-medium text-white">{COMPANY_INFO.tagline}</p>
            <p className="mt-1.5 text-sm text-coral-300">{COMPANY_INFO.subtagline}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-spruce-50/60">
              Clinical recruitment and workforce solutions connecting travel nurses, allied health clinicians, and
              healthcare systems across the United States.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a
                  href={COMPANY_INFO.phoneHref}
                  className="inline-flex items-center gap-3 font-semibold text-white transition-colors hover:text-teal-200"
                >
                  <Phone className="h-4 w-4 text-teal-300" aria-hidden />
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Printer className="h-4 w-4 text-spruce-50/40" aria-hidden />
                <span>Fax {COMPANY_INFO.fax}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-spruce-50/40" aria-hidden />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Globe className="h-4 w-4 text-spruce-50/40" aria-hidden />
                  idealhealthcarestaff.com
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-12">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="font-display text-lg font-medium text-white">{col.title}</h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-spruce-50/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-spruce-50/60 md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. Equal Opportunity Employer.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/facilities#inquiry-form" className="transition-colors hover:text-white">
              Facility Coverage
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Lock className="h-3 w-3" aria-hidden />
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
