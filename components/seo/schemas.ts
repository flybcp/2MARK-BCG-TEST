import { site } from "@/content/site";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

export function getHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}/hero-business-class-cabin.webp`,
    description: site.description,
    telephone: site.phones.primary.e164,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    taxID: site.abn.replace(/\s+/g, ""),
    areaServed: ["Australia", "United States", "Worldwide"],
    sameAs: [site.reviews.trustpilot.url, site.reviews.google.url],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phones.au.e164,
        contactType: "customer service",
        areaServed: "AU",
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        telephone: site.phones.us.e164,
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: ["en"],
      },
    ],
  };
}

function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${siteUrl}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${p}`;
}

/** Article JSON-LD for destination pages. */
export function getArticleSchema({
  title,
  description,
  slug,
  heroImage,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  heroImage: string;
  datePublished: string;
  dateModified?: string;
}) {
  const pageUrl = absoluteUrl(`/business-class-flights-to-${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: pageUrl,
    image: heroImage.startsWith("http") ? heroImage : absoluteUrl(heroImage),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/bcg-logo-transparent.png"),
      },
    },
  };
}

/** FAQPage JSON-LD for destination pages that include FAQs. */
export function getFaqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

/** Breadcrumb JSON-LD for inner pages (About, Contact, Legal, Thank you). */
export function getBreadcrumbSchema(
  items: readonly { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
