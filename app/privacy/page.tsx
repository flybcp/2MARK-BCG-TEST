import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { defaultOgImage } from "@/lib/og-image";

const path = "/privacy";
const title = "Privacy Policy";
const description =
  "How Business Class Global collects, uses, and protects personal information when you use our website or speak with our team.";

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

export default function PrivacyPage() {
  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path },
        ])}
      />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Effective April 2026. {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
          respects your privacy. This policy describes how we handle information
          collected through {site.domain} and when you contact us.
        </p>

        <section className="mt-10" aria-labelledby="privacy-controller">
          <h2
            id="privacy-controller"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Who we are
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            {site.name} arranges premium flight quotes and travel support. ABN{" "}
            {site.abn}. You can reach us at{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              {site.email}
            </a>
            .
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-collect">
          <h2
            id="privacy-collect"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Information we collect
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-base text-text-secondary">
            <li>
              Details you choose to provide — for example name, contact details,
              and travel preferences when you submit an enquiry or speak with us.
            </li>
            <li>
              Basic technical information associated with your visit (such as
              network and device data) where needed to operate the site securely
              and improve reliability.
            </li>
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="privacy-use">
          <h2
            id="privacy-use"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            How we use information
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            We use the information we hold to respond to your requests, prepare
            quotes, arrange travel where you ask us to, and run our business. We
            do not sell your personal information.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-sharing">
          <h2
            id="privacy-sharing"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Sharing and marketing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            We do not share your personal information with third parties for their
            own marketing. Your information is not sold to data brokers or
            advertising networks. We only share information with third parties where
            that is necessary to provide the services you have asked for — for
            example airlines, hotels, payment processors, and other suppliers
            involved in travel bookings and arrangements — or where the law
            requires us to do so.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-legal">
          <h2
            id="privacy-legal"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Retention and legal grounds
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Where the Australian Privacy Act or other laws apply, we collect and
            use personal information that is reasonably necessary to deliver our
            services and for related business purposes. We keep information only
            for as long as needed for client service, regulatory, or accounting
            requirements, then delete or de-identify it when appropriate.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-security">
          <h2
            id="privacy-security"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Security
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            We use industry-standard protections for data in transit and at rest
            where applicable. No method of transmission over the internet is
            completely secure; if you have concerns, you are welcome to contact us
            by phone instead.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-rights">
          <h2
            id="privacy-rights"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Your choices and rights
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            You may request access to or correction of the personal information we
            hold about you, or ask questions about this policy, by emailing{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              {site.email}
            </a>
            . We will respond within a reasonable period. Depending on where you
            live, you may have additional rights under local privacy laws.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-cookies">
          <h2
            id="privacy-cookies"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Cookies
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            We may use cookies or similar technologies where needed to operate
            the site securely and to remember preferences. We do not use
            third-party advertising cookies to track you across unrelated sites.
            If our practices change materially, we will update this policy.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="privacy-changes">
          <h2
            id="privacy-changes"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Changes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            We may update this policy from time to time. The effective date at
            the top will change when we do. Please review this page periodically.
          </p>
        </section>

        <p className="mt-12 rounded-xl border border-border bg-surface-muted p-4 text-sm text-text-tertiary">
          This policy is a general description of our practices and is not legal
          advice. For jurisdiction-specific rights, consult a qualified adviser.
        </p>
      </article>
    </main>
  );
}
