import type { DestinationCardProps } from "@/components/sections/DestinationCard";
import type { Destination } from "@/content/destinations/types";

/** First sentence or trimmed excerpt from meta description for homepage cards. */
function taglineFromDescription(description: string, maxLen = 160): string {
  const t = description.replace(/\s+/g, " ").trim();
  const end = t.indexOf(". ");
  if (end > 0 && end + 1 <= maxLen) {
    return t.slice(0, end + 1);
  }
  if (t.length <= maxLen) {
    return t;
  }
  return `${t.slice(0, maxLen - 1).trim()}…`;
}

export function destinationToCardProps(d: Destination): DestinationCardProps {
  return {
    city: d.city,
    country: d.country,
    tagline: taglineFromDescription(d.description),
    href: `/business-class-flights-to-${d.slug}`,
    imageSrc: d.heroImage,
    imageAlt: `Business class flights to ${d.city} — ${d.city} destination`,
  };
}
