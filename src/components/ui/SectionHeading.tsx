import { Stagger, StaggerItem } from "@/components/motion/Reveal";

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
    <Stagger className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`} stagger={0.12}>
      {eyebrow && (
        <StaggerItem variant="left">
          <p className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""} ${centered ? "justify-center" : ""}`}>
            {eyebrow}
          </p>
        </StaggerItem>
      )}
      <StaggerItem variant="blur">
        <H className={`mt-5 font-display text-display font-medium ${onDark ? "text-white" : "text-ink"}`}>{title}</H>
      </StaggerItem>
      {description && (
        <StaggerItem variant="up">
          <p className={`mt-5 text-lead ${onDark ? "text-spruce-50/75" : "text-ink-2"}`}>{description}</p>
        </StaggerItem>
      )}
    </Stagger>
  );
}
