export interface Destination {
  slug: string;
  city: string;
  country: string;
  iata: string;
  heroImage: string;
  title: string;
  description: string;
  headline: string;
  body: string;
  faqs?: { q: string; a: string }[];
  relatedSlugs: string[];
  datePublished: string;
  dateModified?: string;
}
