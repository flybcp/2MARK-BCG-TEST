import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllDestinations } from "@/content/destinations";

/**
 * Base URL for generated sitemap entries.
 * Prefer NEXT_PUBLIC_SITE_URL so preview deploys advertise their own origin;
 * fall back to the canonical production URL.
 */
function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
}

/**
 * Sitemap scaffold. Destination slugs are added in Phase 6 (P6.8) once
 * `content/destinations/` exists. Until then we emit the static routes so
 * the endpoint is exercised and Search Console has something to ingest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];

  const destinationRoutes = getAllDestinations().map((d) => ({
    url: `${base}/business-class-flights-to-${d.slug}`,
    lastModified: new Date(d.dateModified ?? d.datePublished),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      changeFrequency,
      priority,
    })),
    ...destinationRoutes,
  ];
}
