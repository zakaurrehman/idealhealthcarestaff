import type { Config } from "tailwindcss";

/**
 * Ideal Healthcare Staffing — design tokens
 *
 * Semantic colours (canvas, surface, ink, brand, accent…) are driven by CSS
 * variables defined in globals.css so light/dark themes switch in one place.
 * Brand logic: green = clinicians & careers, navy/azure = facilities & trust.
 *
 * The legacy `navy`, `green`, `teal`, `warm` and `dark` scales are kept so the
 * admin portal continues to render unchanged.
 */
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

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
          soft: withAlpha("--accent-soft"),
        },

        // ── Fixed brand scales (logo navy + logo green) ─────────────
        navy: {
          50: "#f0f4fa",
          100: "#dbe5f5",
          200: "#bcd0ee",
          300: "#8cb3e2",
          400: "#5591d3",
          500: "#2d70c0",
          600: "#1f56a3",
          700: "#164182",
          800: "#102f61",
          900: "#0b2046",
          950: "#061530",
        },
        green: {
          50: "#f1faee",
          100: "#e0f4d9",
          200: "#c2e9b5",
          300: "#98d986",
          400: "#69c656",
          500: "#43b02a", // official logo green (decorative / large use)
          600: "#2e8520", // AA-compliant with white text
          700: "#256c1a",
          800: "#205718",
          900: "#1c4816",
          950: "#0c2809",
        },
        teal: {
          50: "#f1faee",
          100: "#e0f4d9",
          200: "#c2e9b5",
          300: "#98d986",
          400: "#69c656",
          500: "#43b02a",
          600: "#2e8520",
          700: "#256c1a",
          800: "#205718",
          900: "#1c4816",
        },
        warm: {
          50: "#fcfcfb",
          100: "#f6f6f4",
          200: "#ededeb",
          300: "#dededb",
        },
        dark: {
          bg: "#060E1C",
          surface: "#0B182C",
          card: "#10213A",
          border: "#1E3252",
          subtle: "#162744",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid type scale
        "display-xl": ["clamp(2.5rem, 1.35rem + 3.9vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
        "display": ["clamp(2.1rem, 1.3rem + 2.6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "title": ["clamp(1.5rem, 1.15rem + 1.1vw, 2rem)", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        "lead": ["clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.65" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(10 31 68 / 0.04), 0 8px 24px -12px rgb(10 31 68 / 0.12)",
        lift: "0 2px 4px rgb(10 31 68 / 0.04), 0 24px 48px -20px rgb(10 31 68 / 0.22)",
        float: "0 12px 40px -12px rgb(10 31 68 / 0.28)",
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
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
