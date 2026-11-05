import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { defaultOgImage } from "@/lib/og-image";

const path = "/refund-policy";
const title = "Refund, Cancellation & Ticket Change Policy";
const description =
  "How Business Class Global handles cancellations, future travel credits, refundable tickets, and changes to existing flight bookings.";

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

const bodyClass = "mt-4 text-base leading-relaxed text-text-secondary";
const headingClass = "text-xl font-semibold text-text-primary md:text-2xl";
const linkClass =
  "font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2";

export default function RefundPolicyPage() {
  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Refund Policy", path },
        ])}
      />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
          Refund, Cancellation &amp; Ticket Change Policy
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Last updated October 2026. {site.name} · ABN {site.abn}
        </p>

        <p className="mt-8 text-base leading-relaxed text-text-secondary">
          At {site.name}, we understand that travel plans can change. We strive
          to provide a personalized, seamless travel experience and will assist
          our clients with cancellations, changes, and refund or credit requests
          in accordance with the applicable airline rules, ticket conditions, and
          our agreements with our travel partners.
        </p>
        <p className={bodyClass}>
          Bookings are confirmed and paid through your {site.name} travel
          consultant. This policy applies to those bookings; no purchases are
          made directly on this website.
        </p>

        <section className="mt-10" aria-labelledby="refund-cancellations">
          <h2 id="refund-cancellations" className={headingClass}>
            1. Cancellations &amp; future travel credits
          </h2>
          <p className={bodyClass}>
            Unless your booking confirmation states otherwise, cancellations will
            generally result in a credit toward future travel rather than a cash
            refund.
          </p>
          <p className={bodyClass}>
            Many tickets qualify for a future travel credit if cancelled within
            the fare rules. However, the amount of credit available can vary
            depending on the airline, fare type, ticket conditions, cancellation
            timing, and any applicable fees or restrictions.
          </p>
          <p className={bodyClass}>
            Future travel credits are valid for 12 months from the original
            purchase date, unless the airline&apos;s rules allow a longer period.
          </p>
          <p className={bodyClass}>
            Credits are not guaranteed, and some tickets may be non-refundable or
            may have little or no remaining value after cancellation.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="refund-refundable">
          <h2 id="refund-refundable" className={headingClass}>
            2. Refundable tickets &amp; special arrangements
          </h2>
          <p className={bodyClass}>
            If you require a refundable ticket or wish to understand the refund
            conditions before booking, please discuss this with us in advance.
          </p>
          <p className={bodyClass}>
            Where a ticket is confirmed as refundable, we will communicate the
            applicable refund terms, including any airline penalties,
            cancellation fees, or other conditions that apply to that specific
            booking.
          </p>
          <p className={bodyClass}>
            Refund eligibility and the amount ultimately refundable are
            determined by the ticket conditions and the relevant airline or
            travel supplier&apos;s rules.
          </p>
          <p className={bodyClass}>
            Approved refunds are returned to the original payment method within
            30 business days of us receiving the funds from the airline or travel
            supplier.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="refund-changes">
          <h2 id="refund-changes" className={headingClass}>
            3. Changes to existing bookings
          </h2>
          <p className={bodyClass}>
            Changes to flights, dates, destinations, or other ticket details are
            subject to airline availability, fare rules, and the conditions of
            the original ticket.
          </p>
          <p className={bodyClass}>Changes may incur:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-text-secondary">
            <li>
              <strong className="font-semibold text-text-primary">
                Airline change fees:
              </strong>{" "}
              where applicable under the ticket&apos;s fare rules.
            </li>
            <li>
              <strong className="font-semibold text-text-primary">
                Fare differences:
              </strong>{" "}
              if the replacement itinerary costs more than the original ticket.
            </li>
            <li>
              <strong className="font-semibold text-text-primary">
                Additional service fees:
              </strong>{" "}
              where applicable under our agency&apos;s fee arrangements.
            </li>
          </ul>
          <p className={bodyClass}>
            We will advise you of applicable charges and conditions before
            proceeding with a requested change whenever reasonably possible.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="refund-airline-rules">
          <h2 id="refund-airline-rules" className={headingClass}>
            4. Airline rules &amp; ticket restrictions
          </h2>
          <p className={bodyClass}>
            Every ticket is subject to its own fare conditions. Refund
            eligibility, cancellation penalties, credit validity, change
            restrictions, and other limitations vary by airline and ticket type.
          </p>
          <p className={bodyClass}>
            We will make reasonable efforts to explain the conditions and assist
            with processing requests. However, we cannot guarantee a refund,
            credit, or change unless permitted under the ticket conditions or
            required by law.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="refund-non-refundable">
          <h2 id="refund-non-refundable" className={headingClass}>
            5. Non-refundable situations
          </h2>
          <p className={bodyClass}>
            The following are not eligible for a refund or credit:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-text-secondary">
            <li>
              <strong className="font-semibold text-text-primary">
                No-shows:
              </strong>{" "}
              tickets not cancelled before the original departure time.
            </li>
            <li>
              <strong className="font-semibold text-text-primary">
                Partly used tickets:
              </strong>{" "}
              itineraries where one or more flights have already been flown.
            </li>
            <li>
              <strong className="font-semibold text-text-primary">
                Name changes:
              </strong>{" "}
              tickets cannot be transferred to another passenger.
            </li>
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="refund-airline-changes">
          <h2 id="refund-airline-changes" className={headingClass}>
            6. Airline cancellations &amp; schedule changes
          </h2>
          <p className={bodyClass}>
            If the airline cancels or changes your flight, you have the right to
            a new ticket in accordance with the airline&apos;s rules. We will
            contact you to arrange the replacement.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="refund-commitment">
          <h2 id="refund-commitment" className={headingClass}>
            7. Our commitment to you
          </h2>
          <p className={bodyClass}>
            Our goal is to make managing your travel as straightforward and
            stress-free as possible. If your plans change, please contact your
            travel consultant or email us at{" "}
            <a href={`mailto:${site.email}`} className={linkClass}>
              {site.email}
            </a>{" "}
            as soon as possible so we can review the available options and help
            you determine the most suitable course of action.
          </p>
          <p className={`${bodyClass} italic`}>
            By proceeding with a booking, clients acknowledge that cancellation,
            refund, and change conditions may apply as described above and in
            the specific fare rules communicated for their ticket. Nothing in
            this policy limits any rights that clients may have under applicable
            law.
          </p>
        </section>
      </article>
    </main>
  );
}
