import Image from "next/image";
import Link from "next/link";

/**
 * Brand mark on a transparent background.
 *  - `auto`   : full-colour logo in light mode, light-ink logo in dark mode
 *  - `onDark` : always the light-ink logo (for permanently dark surfaces)
 */
export default function Logo({
  className = "",
  size = "md",
  variant = "auto",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "onDark";
  priority?: boolean;
}) {
  const height = size === "lg" ? "h-[4.5rem]" : size === "sm" ? "h-11" : "h-14";
  const img = (src: string, extra: string) => (
    <Image
      src={src}
      alt="Ideal Healthcare Staffing"
      width={279}
      height={196}
      priority={priority}
      className={`${height} w-auto object-contain ${extra}`}
    />
  );

  return (
    <Link
      href="/"
      aria-label="Ideal Healthcare Staffing — home"
      className={`inline-flex shrink-0 items-center rounded-xl ${className}`}
    >
      {variant === "onDark" ? (
        img("/images/logo-dark.webp", "")
      ) : (
        <>
          {img("/images/logo-light.webp", "dark:hidden")}
          {img("/images/logo-dark.webp", "hidden dark:block")}
        </>
      )}
    </Link>
  );
}
