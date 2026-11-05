import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getArticleSchema,
  getFaqPageSchema,
  getBreadcrumbSchema,
} from "@/components/seo/schemas";
import { AccreditationBar } from "@/components/sections/AccreditationBar";
import { AustralianRegisteredTravelAgentPill } from "@/components/sections/AustralianRegisteredTravelAgentPill";
import { LeadForm } from "@/components/form/LeadForm";
import { DestinationCard } from "@/components/sections/DestinationCard";
import {
  getAllDestinationSlugs,
  getAllDestinations,
  getDestination,
} from "@/content/destinations";
import { formatAirportLabel, getAirportByIata } from "@/lib/airports";
import { site } from "@/content/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllDestinationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};

  const canonicalPath = `/business-class-flights-to-${d.slug}`;
  return {
    title: { absolute: d.title.replace("Business Class Global", "BCG Flights") },
    description: d.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: d.title,
      description: d.description,
      url: canonicalPath,
      type: "article",
      publishedTime: d.datePublished,
      modifiedTime: d.dateModified,
      images: [
        {
          url: d.heroImage,
          width: 2400,
          height: 1600,
          alt: `Business class flights to ${d.city} — ${d.city} destination`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.description,
      images: [d.heroImage],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();

  const airport = getAirportByIata(d.iata);
  const initialDestination = airport
    ? { iata: d.iata, label: formatAirportLabel(airport) }
    : { iata: d.iata, label: `${d.city} (${d.iata})` };

  const allDestinations = getAllDestinations();
  const relatedDestinations = d.relatedSlugs
    .map((s) => allDestinations.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => x !== undefined)
    .slice(0, 5);

  const canonicalPath = `/business-class-flights-to-${d.slug}`;

  return (
    <main id="main-content" className="bcg-destination-page">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/#destinations" },
          { name: d.city, path: canonicalPath },
        ])}
      />
      <JsonLd
        data={getArticleSchema({
          title: d.title,
          description: d.description,
          slug: d.slug,
          heroImage: d.heroImage,
          datePublished: d.datePublished,
          dateModified: d.dateModified,
        })}
      />
      {d.faqs && d.faqs.length > 0 && (
        <JsonLd data={getFaqPageSchema(d.faqs)} />
      )}

      {/* Hero */}
      <section
        className="relative flex min-h-[480px] items-center justify-center bg-brand px-4 py-14 md:min-h-[560px]"
        aria-label={`Business class flights to ${d.city}`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={d.heroImage}
            alt={`Business class flights to ${d.city} — ${d.city}, ${d.country}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand/60 via-brand/50 to-brand/80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            {d.country}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {d.headline}
          </h1>
          <p className="mt-3 text-base text-white/80">
            Lie-flat comfort · Concierge sourcing · Personalised quote
          </p>

          <div className="mt-8 text-left">
            <LeadForm initialDestination={initialDestination} />
          </div>
          <div className="mt-6 flex justify-center">
            <AustralianRegisteredTravelAgentPill />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-surface px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <article
            className="destination-body"
            dangerouslySetInnerHTML={{ __html: d.body }}
          />

          {d.faqs && d.faqs.length > 0 && (
            <section className="mt-12" aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="text-xl font-semibold text-text-primary md:text-2xl"
              >
                Frequently asked questions
              </h2>
              <dl className="mt-6 space-y-6">
                {d.faqs.map(({ q, a }) => (
                  <div
                    key={q}
                    className="rounded-2xl border border-border bg-surface-muted p-6"
                  >
                    <dt className="font-semibold text-text-primary">{q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </section>

      {/* Related destinations */}
      {relatedDestinations.length > 0 && (
        <section
          className="bg-surface-muted px-4 py-14"
          aria-labelledby="related-destinations-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="related-destinations-heading"
              className="text-xl font-semibold text-text-primary md:text-2xl"
            >
              Related destinations
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedDestinations.map((rd) => (
                <DestinationCard
                  key={rd.slug}
                  city={rd.city}
                  country={rd.country}
                  tagline={rd.description.split(".")[0] + "."}
                  href={`/business-class-flights-to-${rd.slug}`}
                  imageSrc={rd.heroImage}
                  imageAlt={`Business class flights to ${rd.city} — ${rd.city} destination`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA form */}
      <section className="bg-surface px-4 py-14" aria-labelledby="footer-cta-heading">
        <div className="mx-auto max-w-5xl">
          <h2
            id="footer-cta-heading"
            className="text-center text-xl font-semibold text-text-primary md:text-2xl"
          >
            Ready to fly business class to {d.city}?
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Speak with a specialist. We source premium cabin fares you won&apos;t find online.
          </p>
          <div className="mt-6">
            <LeadForm initialDestination={initialDestination} />
          </div>
          <p className="mt-4 text-center text-xs text-text-tertiary">
            Or call us directly:{" "}
            <a
              href={`tel:${site.phones.primary.e164}`}
              className="font-medium text-brand hover:underline"
            >
              {site.phones.primary.label}
            </a>
          </p>
        </div>
      </section>

      <AccreditationBar showTravelAgentPill={false} />
    </main>
  );
}
