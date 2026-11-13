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

/** Closing call-to-action on permanent navy — used across pages. */
export default function CtaBand({
  eyebrow = "The right time is now",
  title,
  description,
  primary = { href: "/jobs", label: "Find Healthcare Jobs" },
  secondary = { href: "/facilities#inquiry-form", label: "Request Staffing" },
  showPhone = true,
}: CtaBandProps) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy-950 px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
        <div className="absolute inset-0 bg-dots-light opacity-60" aria-hidden />
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-green-500/20 blur-[100px]"
          aria-hidden
        />
        <PulseLine className="absolute inset-x-0 bottom-6 h-24 w-full text-white sm:bottom-10" />

        <div className="relative grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
            <h2 className="mt-4 font-display text-display font-bold text-white">{title}</h2>
            {description && <p className="mt-5 max-w-xl text-lead text-slate-300">{description}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link href={primary.href} className="btn-accent btn-lg group">
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href={secondary.href} className="btn-on-dark btn-lg">
              {secondary.label}
            </Link>
          </div>
        </div>

        {showPhone && (
          <p className="relative mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-6 text-sm text-slate-300">
            Prefer to talk?
            <a
              href={COMPANY_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              <Phone className="h-4 w-4 text-green-400" aria-hidden />
              {COMPANY_INFO.phone}
            </a>
          </p>
        )}
      </Reveal>
    </section>
  );
}
