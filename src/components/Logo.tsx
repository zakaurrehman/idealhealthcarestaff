import Image from "next/image";
import Link from "next/link";

/**
 * The supplied logo artwork has an opaque white background, so on dark
 * surfaces it sits on an intentional white tile rather than a raw white box.
 */
export default function Logo({
  className = "",
  size = "md",
  tile = "auto",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** "auto" = tile only in dark mode, "always" = always on a tile. */
  tile?: "auto" | "always";
  priority?: boolean;
}) {
  const height = size === "lg" ? "h-16" : size === "sm" ? "h-11" : "h-14";
  const tileClass =
    tile === "always"
      ? "bg-white rounded-2xl p-2 shadow-soft"
      : "dark:bg-white dark:rounded-xl dark:px-1.5 dark:py-1";

  return (
    <Link
      href="/"
      aria-label="Ideal Healthcare Staffing — home"
      className={`inline-flex shrink-0 items-center rounded-xl ${tileClass} ${className}`}
    >
      <Image
        src="/images/logo-trim.webp"
        alt="Ideal Healthcare Staffing"
        width={279}
        height={196}
        priority={priority}
        className={`${height} w-auto object-contain`}
      />
    </Link>
  );
}
