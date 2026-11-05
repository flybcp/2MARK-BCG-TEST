import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { formatAirportLabel, getAirportByIata } from "@/lib/airports";
import { defaultOgImage } from "@/lib/og-image";
import { ThankYouAnalytics } from "@/components/analytics/ThankYouAnalytics";
import type { LeadFormKind } from "@/lib/lead-analytics";

const path = "/thank-you";
const title = "Thank You";
const description =
  "Your flight enquiry was received. A Business Class Global specialist will contact you shortly with tailored premium cabin options.";

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
    robots: { index: false, follow: true },
  };
}

type Props = {
  searchParams: Promise<{ dep?: string; dest?: string; kind?: string }>;
};

function labelFromIata(code: string | undefined): string | null {
  if (!code || code.length !== 3) return null;
  const a = getAirportByIata(code);
  return a ? formatAirportLabel(a) : code.toUpperCase();
}

export default async function ThankYouPage({ searchParams }: Props) {
  const sp = await searchParams;
  const depLabel = labelFromIata(sp.dep);
  const destLabel = labelFromIata(sp.dest);
  const formKind: LeadFormKind =
    sp.kind === "callback" ? "callback" : "flight";
  const hasRoute = Boolean(depLabel && destLabel);

  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <ThankYouAnalytics formKind={formKind} hasRoute={hasRoute} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Thank you", path },
        ])}
      />
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="inline-flex items-center justify-center rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand"
          role="status"
        >
          Enquiry received
        </p>
        <h1 className="mt-6 text-3xl font-bold text-text-primary md:text-4xl">
          Thank you — we&apos;re on it
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          A premium-cabin specialist will review your request and reach out{" "}
          <span className="font-semibold text-text-primary">
            {site.callbackWindow}
          </span>{" "}
          during business hours. Watch for a call or email matching the details
          you provided.
        </p>
        {depLabel && destLabel ? (
          <p className="mt-6 rounded-2xl border border-border bg-surface-muted px-4 py-4 text-sm text-text-secondary md:text-base">
            <span className="font-medium text-text-primary">Route on file:</span>{" "}
            {depLabel} → {destLabel}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 sm:w-auto"
          >
            Back to home
          </Link>
          <a
            href={`tel:${site.phones.primary.e164}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 sm:w-auto"
          >
            Call {site.phones.primary.label}
          </a>
        </div>
        <p className="mt-10 text-sm text-text-tertiary">
          Need to add details? Email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
