import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — clothes for teens, women and men`, template: `%s | ${siteName}` },
  description: siteDescription,
  openGraph: { type: "website", siteName, locale: "en_IN", images: ["/seed/s-duo.svg"] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#26251F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable bg-ink text-paper px-4 py-3 rounded-[2px]">
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
