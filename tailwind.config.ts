import type { Config } from "tailwindcss";

/**
 * Ideal Healthcare Staffing — design tokens ("Coastal Care" palette)
 *
 *  Teal   — primary. Clinical calm, trust, cleanliness. Bridges the logo's
 *           navy and green so the mark still sits naturally on the site.
 *  Coral  — accent. Human warmth and energy; used sparingly for emphasis.
 *  Ivory  — warm neutrals instead of sterile white: premium, hospitable.
 *  Spruce — deep teal-black for dark sections and the footer.
 *
 * Semantic colours are CSS variables (globals.css) so light/dark themes switch
 * in one place. Legacy `navy` / `green` / `teal` / `dark` scales are kept and
 * re-pointed at the new palette so the admin portal inherits the new look.
 */
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const tealScale = {
  50: "#effaf9",
  100: "#d6f0ef",
  200: "#b0e2e1",
  300: "#7fcdcd",
  400: "#43b1b4",
  500: "#1496a0",
  600: "#0e6e78", // primary — 5.9:1 with white text
  700: "#0b5961",
  800: "#0d4950",
  900: "#0e3d43",
  950: "#062226",
};

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic, theme-aware tokens ─────────────────────────────
        canvas: withAlpha("--canvas"),
        surface: {
          DEFAULT: withAlpha("--surface"),
          2: withAlpha("--surface-2"),
        },
        line: {
          DEFAULT: withAlpha("--line"),
          strong: withAlpha("--line-strong"),
        },
        ink: {
          DEFAULT: withAlpha("--ink"),
          2: withAlpha("--ink-2"),
          3: withAlpha("--ink-3"),
        },
        brand: {
          DEFAULT: withAlpha("--brand"),
          hover: withAlpha("--brand-hover"),
          bright: withAlpha("--brand-bright"),
          soft: withAlpha("--brand-soft"),
          ink: withAlpha("--brand-ink"),
          on: withAlpha("--on-brand"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          ink: withAlpha("--accent-ink"),
          soft: withAlpha("--accent-soft"),
        },

        // ── Fixed palette scales ────────────────────────────────────
        spruce: {
          DEFAULT: "#0b2a31",
          50: "#eef5f5",
          700: "#14424b",
          800: "#0f353d",
          900: "#0b2a31",
          950: "#071d22",
        },
        coral: {
          50: "#fdf3ef",
          100: "#fce4db",
          200: "#f8c6b4",
          300: "#f3a284",
          400: "#ec8160",
          500: "#d9684a",
          600: "#b0482c",
          700: "#8f3a24",
        },
        ivory: {
          50: "#fdfcfa",
          100: "#faf8f4",
          200: "#f3efe8",
          300: "#e8e2d8",
          400: "#d6cec1",
        },
        teal: tealScale,
        // Legacy aliases (admin portal) mapped onto the new palette
        green: tealScale,
        navy: {
          50: "#eef5f5",
          100: "#d5e6e7",
          200: "#aecfd1",
          300: "#7eb0b4",
          400: "#4f8d93",
          500: "#2f6f76",
          600: "#1f5a61",
          700: "#174a51",
          800: "#123c42",
          900: "#0f353d",
          950: "#0b2a31",
        },
        warm: {
          50: "#fdfcfa",
          100: "#faf8f4",
          200: "#f3efe8",
          300: "#e8e2d8",
        },
        dark: {
          bg: "#09161a",
          surface: "#0e1f24",
          card: "#14292f",
          border: "#213a41",
          subtle: "#1a3238",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
      },
      fontSize: {
        // Fluid type scale — tuned for the serif display face
        "display-xl": ["clamp(2.75rem, 1.6rem + 4vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display": ["clamp(2.25rem, 1.5rem + 2.6vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "title": ["clamp(1.625rem, 1.25rem + 1.1vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "lead": ["clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.65" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(15 42 51 / 0.04), 0 10px 30px -14px rgb(15 42 51 / 0.14)",
        lift: "0 2px 6px rgb(15 42 51 / 0.05), 0 28px 56px -24px rgb(15 42 51 / 0.28)",
        float: "0 14px 40px -14px rgb(15 42 51 / 0.32)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
