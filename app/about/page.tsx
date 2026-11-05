import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { defaultOgImage } from "@/lib/og-image";

const path = "/about";
const title = "About Us";
const description =
  "Meet Business Class Global — boutique consultants for business and first class flights, and same-day specialist callbacks.";

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: defaultOgImage.path,
          width: defaultOgImage.width,
          height: defaultOgImage.height,
          alt: defaultOgImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [defaultOgImage.path],
    },
  };
}

export default function AboutPage() {
  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path },
        ])}
      />
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent">
          {site.shortName}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary md:text-4xl">
          Boutique travel consultants for premium cabins
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Our goal is straightforward: save you money when flying business or
          first class. You are an expert in your field — travel pricing and
          inventory are ours. Global distribution systems and fare rules have
          grown more complex, not simpler; our team lives and breathes premium
          cabin travel so you do not have to.
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Contact us
          </Link>
        </div>

        <section className="mt-12" aria-labelledby="about-story">
          <h2
            id="about-story"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            How we work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Specialists are available six days a week to compare carriers,
            alliance options, and promotional inventory you will not see on
            consumer sites. Share your schedule — we return curated choices with
            transparent pricing and concierge support from quote to ticket.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="about-accreditation">
          <h2
            id="about-accreditation"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Accreditation and trust
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-base text-text-secondary">
            <li>Australian Business Number (ABN) {site.abn}.</li>
            <li>Australian Company Number (ACN) {site.accreditation.acn}.</li>
            <li>Credit Card Rebate Association (CCRA) {site.accreditation.ccra}.</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Read live reviews on{" "}
            <a
              href={site.reviews.trustpilot.url}
              className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              rel="noopener noreferrer"
            >
              Trustpilot
            </a>{" "}
            and see how travelers rate our responsiveness and value.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="about-testimonials">
          <h2
            id="about-testimonials"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            What clients say
          </h2>
          <figure className="mt-6 rounded-2xl border border-border bg-surface-muted p-6">
            <blockquote className="text-base leading-relaxed text-text-secondary">
              &ldquo;Great service and pricing. We most definitely recommend
              Business Class Global for all your travels.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium text-text-primary">
              — Laura
            </figcaption>
          </figure>
          <figure className="mt-6 rounded-2xl border border-border bg-surface-muted p-6">
            <blockquote className="text-base leading-relaxed text-text-secondary">
              &ldquo;These guys are awesome! Since my first ticket request, they
              have always been helpful, knowledgeable and extremely patient. My
              bookings were handled by professionals and cost saving was very
              good.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium text-text-primary">
              — Richard
            </figcaption>
          </figure>
        </section>
      </div>
    </main>
  );
}
