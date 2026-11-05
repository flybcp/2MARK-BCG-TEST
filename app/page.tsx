import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomepageSchema } from "@/components/seo/schemas";
import { AirlineLogos } from "@/components/sections/AirlineLogos";
import { DestinationGrid } from "@/components/sections/DestinationGrid";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PerksBanner } from "@/components/sections/PerksBanner";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { Faq, Closing } from "@/components/sections/Faq";
import { ValueProps } from "@/components/sections/ValueProps";

const title = "Business Class Flights | Business Class Global";
const description =
  "Business and first class flight specialists offering personalised concierge support, insider fares, and premium travel advice.";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: "Business Class Flights | BCG Flights" },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      images: [
        {
          url: "/hero-business-class-cabin.webp",
          width: 2400,
          height: 1600,
          alt: "Premium business class cabin interior",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero-business-class-cabin.webp"],
    },
  };
}

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface"
    >
      <div
        data-test="token-check"
        className="pointer-events-none fixed left-0 top-0 -z-10 h-0 w-0 overflow-hidden bg-surface text-text-primary text-brand backdrop-blur-chrome"
        aria-hidden
      />
      <JsonLd data={getHomepageSchema()} />
      <Hero />
      <AirlineLogos />
      <ValueProps />
      <HowItWorks />
      <DestinationGrid />
      <PerksBanner />
      <ReviewsSection />
      <Faq />
      <Closing />
    </main>
  );
}
