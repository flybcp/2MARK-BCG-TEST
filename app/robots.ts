import type { MetadataRoute } from "next";
import { site } from "@/content/site";

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl()}/sitemap.xml`,
    host: baseUrl(),
  };
}
