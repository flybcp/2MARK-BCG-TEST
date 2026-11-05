import type { Metadata } from "next";
import { CallbackForm } from "@/components/form/CallbackForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { defaultOgImage } from "@/lib/og-image";

const path = "/contact";
const title = "Contact";
const description =
  "Request a callback from Business Class Global, or reach us by phone or email for business and first class flight support.";

const phoneList = [site.phones.au, site.phones.us, site.phones.secondary];

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

export default function ContactPage() {
  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path },
        ])}
      />
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent">
          Get in touch
        </p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary md:text-4xl">
          Contact {site.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Use the form below for a quick callback request. If you already know
          your airports and dates,{" "}
          <a
            href="/#lead-form"
            className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            the full quote form on our homepage
          </a>{" "}
          will get you a faster quote.
        </p>

        <div className="mt-10">
          <CallbackForm className="rounded-2xl border border-border bg-white p-5 shadow-xl shadow-black/10 md:p-8" />
        </div>

        <section
          className="mt-14 rounded-2xl border border-border bg-surface-muted p-6 md:p-8"
          aria-labelledby="contact-direct"
        >
          <h2
            id="contact-direct"
            className="text-lg font-semibold text-text-primary md:text-xl"
          >
            Phone, email, and address
          </h2>
          <ul className="mt-4 space-y-3 text-base text-text-secondary">
            <li>
              <span className="font-medium text-text-primary">Email:</span>{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                {site.email}
              </a>
            </li>
            {phoneList.map((phone) => (
              <li key={phone.e164}>
                <span className="font-medium text-text-primary">
                  {phone.region}:
                </span>{" "}
                <a
                  href={`tel:${phone.e164}`}
                  className="text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  {phone.label}
                </a>
              </li>
            ))}
            <li>
              <span className="font-medium text-text-primary">Address:</span>
              <address className="mt-1 not-italic">
                {site.legalName}
                <br />
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}{" "}
                {site.address.postalCode}
                <br />
                {site.address.country}
              </address>
            </li>
          </ul>
          <p className="mt-4 text-sm text-text-tertiary">
            ABN {site.abn} · Callbacks {site.callbackWindow} on business days.
          </p>
        </section>
      </div>
    </main>
  );
}
