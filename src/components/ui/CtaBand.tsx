import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import PulseLine from "@/components/ui/PulseLine";

interface CtaBandProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  showPhone?: boolean;
}

/** Closing call-to-action on deep spruce — used across pages. */
export default function CtaBand({
  eyebrow = "The right time is now",
  title,
  description,
  primary = { href: "/jobs", label: "Find Healthcare Jobs" },
  secondary = { href: "/facilities#inquiry-form", label: "Request Staffing" },
  showPhone = true,
}: CtaBandProps) {
  return (
    <section className="px-3 pb-20 sm:px-4 sm:pb-24">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-spruce px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
        <div className="absolute inset-0 bg-dots-light" aria-hidden />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-400/20 blur-[100px]" aria-hidden />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-coral-400/10 blur-[100px]" aria-hidden />
        <PulseLine className="absolute inset-x-0 bottom-6 h-24 w-full text-white sm:bottom-10" />

        <div className="relative grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
            <h2 className="mt-5 font-display text-display font-medium text-white">{title}</h2>
            {description && <p className="mt-5 max-w-xl text-lead text-spruce-50/75">{description}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link href={primary.href} className="btn-light btn-lg group">
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href={secondary.href} className="btn-on-dark btn-lg">
              {secondary.label}
            </Link>
          </div>
        </div>

        {showPhone && (
          <p className="relative mt-12 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-6 text-sm text-spruce-50/75">
            Prefer to talk?
            <a
              href={COMPANY_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              <Phone className="h-4 w-4 text-coral-300" aria-hidden />
              {COMPANY_INFO.phone}
            </a>
          </p>
        )}
      </Reveal>
    </section>
  );
}
