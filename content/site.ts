/**
 * Single source of truth for site-wide constants.
 *
 * Any copy, contact info, legal identifiers, or link destinations that
 * appear in more than one place on the site must be referenced from here.
 * Brand rule: the only trading names in use are "BCG" and
 * "Business Class Global". Never reference any legacy trading name.
 */

export const site = {
  name: "BCG Flights",
  /**
   * Registered legal entity. The public brand remains `name`.
   * Shown under the footer wordmark, above the postal address,
   * and in the footer copyright line.
   */
  legalName: "Business Class Global Travel Pty Ltd",
  shortName: "BCG",
  domain: "businessclassglobal.com",
  url: "https://businessclassglobal.com",
  tagline: "Premium flights. Concierge service. Insider fares.",
  description:
    "Concierge business and first class flights at insider prices. Speak with a specialist and get a personalised quote.",

  /**
   * Australian Business Number — displayed in the accreditation bar and footer.
   * Source: `Docs/project-context.mdc`.
   */
  abn: "68 667 677 072",

  /** Contact numbers confirmed in the project context. */
  phones: {
    primary: {
      label: "+61 2 7265 1240",
      e164: "+61272651240",
      region: "AU",
    },
    secondary: {
      label: "+1 917 408 3716",
      e164: "+19174083716",
      region: "US",
    },
    us: {
      label: "+1 732 314 6891",
      e164: "+17323146891",
      region: "US",
    },
    au: {
      label: "+61 2 7265 1240",
      e164: "+61272651240",
      region: "AU",
    } as {
      label: string;
      e164: string;
      region: "AU";
    },
  },

  email: "Info@BCGFlights.com",

  /** Registered office. Shown in the footer and on the contact page. */
  address: {
    street: "7 Sarah Crescent",
    locality: "Templestowe",
    region: "VIC",
    postalCode: "3106",
    country: "Australia",
    countryCode: "AU",
  },

  /**
   * Expected callback window — shown on the thank-you page. Keep this tight;
   * Moshe's team commits to same-day follow-up during business hours.
   */
  callbackWindow: "within 24 hours",

  reviews: {
    trustpilot: {
      url: "https://www.trustpilot.com/review/businessclassglobal.com",
      /** Rating + review count are placeholders until real aggregates exist. */
      rating: 4.9,
      reviewCount: 82,
    },
    google: {
      /**
       * Google Business Profile is confirmed, but the direct review URL has not
       * been provided yet. Use a branded search result meanwhile so the section
       * can still link out to the public profile lookup.
       */
      url: "https://www.google.com/maps/search/?api=1&query=Business+Class+Global",
      rating: null as null | number,
      reviewCount: null as null | number,
    },
  },

  /**
   * Social links. Left intentionally empty in V1 — add as accounts are created.
   */
  social: {
    facebook: null as null | string,
    instagram: null as null | string,
    linkedin: null as null | string,
    x: null as null | string,
  },

  /**
   * Airline logos displayed on the homepage strip. Confirmed set in
   * `Docs/project-context.mdc`. `src` paths land under `/public/airlines/`.
   */
  airlines: [
    { name: "Etihad Airways", src: "/airlines/etihad.svg" },
    { name: "Virgin Australia", src: "/airlines/virgin-australia.svg" },
    { name: "Emirates", src: "/airlines/emirates.svg" },
    { name: "United Airlines", src: "/airlines/united.svg" },
    { name: "Cathay Pacific", src: "/airlines/cathay-pacific.svg" },
    { name: "Qantas", src: "/airlines/qantas.svg" },
  ],

  /**
   * Accreditation tokens used on the accreditation bar and about page.
   * `null` entries render a subtle placeholder until real values are supplied.
   */
  accreditation: {
    iata: true,
    abn: "68 667 677 072",
    acn: "667 677 072",
    ccra: "99937770",
  },

  /**
   * Primary nav + footer legal links. The router source of truth for
   * anything that should appear in the header or footer.
   */
  nav: {
    primary: [
      { label: "Get a Quote", href: "/get-a-quote" },
      { label: "Destinations", href: "/#destinations" },
      { label: "How it Works", href: "/#how-it-works" },
      { label: "About", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
    legal: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
} as const;

export type SitePhone = (typeof site.phones)["primary"];
