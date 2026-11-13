import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  className = "",
  as: H = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""} ${centered ? "justify-center" : ""}`}>
          {eyebrow}
        </p>
      )}
      <H
        className={`mt-4 font-display text-display font-bold ${onDark ? "text-white" : "text-ink"}`}
      >
        {title}
      </H>
      {description && (
        <p className={`mt-5 text-lead ${onDark ? "text-slate-300" : "text-ink-2"}`}>{description}</p>
      )}
    </Reveal>
  );
}
