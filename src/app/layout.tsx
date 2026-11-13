import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import MotionProvider from "@/components/motion/MotionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://idealhealthcarestaff.com"),
  title: {
    default: "Ideal Healthcare Staffing | Exceptional People. Exceptional Care.",
    template: "%s | Ideal Healthcare Staffing",
  },
  description:
    "Ideal Healthcare Staffing connects healthcare professionals with rewarding travel nursing, allied health, and direct-hire clinical opportunities across premier US health systems. The Right Professionals. The Right Place. The Right Time.™",
  keywords: [
    "healthcare staffing",
    "travel nursing jobs",
    "allied health staffing",
    "hospital staffing agency",
    "Los Angeles healthcare staffing",
    "ICU nurse jobs",
    "per diem nursing",
    "clinical recruitment US",
  ],
  authors: [{ name: "Ideal Healthcare Staffing" }],
  icons: {
    icon: "/images/logo.webp",
  },
  openGraph: {
    title: "Ideal Healthcare Staffing | Exceptional People. Exceptional Care.",
    description:
      "The Right Professionals. The Right Place. The Right Time.™ Verified travel nursing and healthcare facility staffing solutions.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/hero-clinician.jpg", width: 1200, height: 1800 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F8FB" },
    { media: "(prefers-color-scheme: dark)", color: "#060E1C" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Anti-flash inline script to prevent theme flickering on page load
const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('ihs-theme-preference');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark) || (stored === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink-2 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
