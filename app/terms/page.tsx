import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { site } from "@/content/site";
import { defaultOgImage } from "@/lib/og-image";

const path = "/terms";
const title = "Terms & Conditions";
const description =
  "Terms and conditions for bookings with Business Class Global — changes, baggage, supplier rules, payments, and liability.";

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

export default function TermsPage() {
  return (
    <main id="main-content" className="bcg-inner-page bg-surface px-4 pb-20 pt-8 md:pt-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path },
        ])}
      />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Last updated April 2026. These terms apply to travel services arranged
          by {site.name}.
        </p>

        <section className="mt-10" aria-labelledby="terms-changes">
          <h2
            id="terms-changes"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Changes and cancellations
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Cancellations, refunds, credits, and changes to existing bookings are
            covered by our{" "}
            <Link
              href="/refund-policy"
              className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              Refund, Cancellation &amp; Ticket Change Policy
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            No-show tickets cannot be refunded or exchanged unless the
            reservation is cancelled and rescheduled before the original departure
            date. Check email frequently for airline schedule changes and verify
            flights 72 hours before departure. Failure to use a segment may cancel
            onward and return reservations. Tickets must be used in sequence;
            out-of-sequence use is not permitted. For international flights, plan
            to arrive at check-in at least three hours before departure.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Airline tickets are subject to each carrier&apos;s conditions of
            carriage. The contract of carriage is between the airline and the
            passenger. Airlines may change times, equipment, or cancel flights;
            {site.name} is not responsible for carrier schedule changes.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            If a ticket is not honored, contact your agent immediately. Where
            applicable law and carrier rules allow, {site.name} will work to
            replace the ticket within 24 hours, offer a refund, or propose
            alternatives within 24 hours.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-baggage">
          <h2
            id="terms-baggage"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Baggage allowance
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Airport fees may apply if checked items exceed the airline&apos;s
            weight, size, or piece allowance. Some carriers do not include free
            checked baggage. Allowance and fee policies change without notice —
            confirm with your agent before ticketing.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-ff">
          <h2
            id="terms-ff"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Frequent flyer points
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Awards, miles, upgrades, certificates, and discounts may not apply to
            all fares. Mileage accrual is not guaranteed. Ask your agent how your
            ticket maps to your loyalty program.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-suppliers">
          <h2
            id="terms-suppliers"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Supplier rules and restrictions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Additional airline, hotel, and supplier terms apply to each booking.
            You agree to comply with payment deadlines, fare rules, and
            availability conditions imposed by suppliers. {site.name} may cancel
            unpaid reservations. Hotels may require a card or cash deposit at
            check-in for incidentals. Some activities require a separate liability
            waiver. Violations of supplier rules may result in cancellation,
            denial of boarding, forfeiture of amounts paid, or debit of costs we
            incur.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-destinations">
          <h2
            id="terms-destinations"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Travel destinations and visas
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Passengers must hold valid passports and any visas or health documents
            required at check-in. Requirements for transit and one-way travel vary
            — confirm with embassies or consulates. General guidance is available
            from the{" "}
            <a
              href="https://travel.state.gov/"
              className="font-medium text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              rel="noopener noreferrer"
            >
              U.S. Department of State travel advisory service
            </a>
            . Non-U.S. passport holders should contact embassies of destination and
            transit countries.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            By offering itineraries to international destinations, {site.name}{" "}
            does not warrant that travel to any location is advisable or free of
            risk, and is not liable for damages or losses that may result from
            travel to those destinations.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-liability">
          <h2
            id="terms-liability"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Liability disclaimer
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Carriers, hotels, and other suppliers are independent contractors, not
            agents or employees of {site.name}. {site.name} is not liable for
            suppliers&apos; acts, errors, omissions, or negligence, or for
            injury, death, property damage, or other losses arising from their
            services. {site.name} is not liable for delays, cancellations,
            overbooking, strikes, force majeure, or causes beyond its reasonable
            control, and is not responsible for additional expenses, rerouting, or
            government actions.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="terms-payments">
          <h2
            id="terms-payments"
            className="text-xl font-semibold text-text-primary md:text-2xl"
          >
            Bank, card fees, and payments
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            {site.name} accepts major cards and other methods as advised on your
            invoice. Banks may charge currency conversion or international
            transaction fees; amounts on your statement may differ from the
            invoice total due to exchange rates and fees imposed by your card
            issuer. For questions about fees or rates, contact your bank.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            By booking flights, hotels, car rentals, or related services, you
            acknowledge that you have read and agree to these terms and any
            supplier terms provided with your itinerary.
          </p>
        </section>

        <p className="mt-12 text-sm text-text-tertiary">
          Questions? Email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {site.email}
          </a>{" "}
          or visit the{" "}
          <Link
            href="/contact"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            contact page
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
