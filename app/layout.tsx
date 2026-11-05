import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/content/site";
import "@/styles/globals.css";
import "@/styles/refresh.css";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(
  /\/$/,
  ""
);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2545",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${site.name}`,
    default: `${site.name} — ${site.tagline}`,
  },
  description: site.description,
  applicationName: site.name,
  generator: "Next.js",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: siteUrl,
    locale: "en_US",
    images: [
      {
        url: "/hero-business-class-cabin.webp",
        width: 2400,
        height: 1600,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/hero-business-class-cabin.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.jpg", sizes: "48x48", type: "image/jpeg" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body className="bg-surface font-sans text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[60] rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-text-inverse focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? <Analytics /> : null}
      </body>
    </html>
  );
}
