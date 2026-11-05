/** Homepage “Premium Travel Support” pillar cards (Clarity / Value / Trust). */
export const premiumTravelSupportCards = [
  {
    key: "clarity",
    title: "Clarity",
    body: "Your trip, personalized to fit your preferences.",
    iconKey: "clarity",
  },
  {
    key: "value",
    title: "Value",
    body: "Explore premium cabin options tailored to your plans.",
    iconKey: "value",
  },
  {
    key: "trust",
    title: "Trust",
    body: "White glove concierge service with a Dedicated Travel Coordinator.",
    iconKey: "trust",
  },
] as const;

export const homepageSteps = [
  {
    title: "Request a callback",
    body: "Share your route, dates, and travel preferences in one quick form.",
  },
  {
    title: "Approve the best deal",
    body: "A specialist curates flight options with value-added perks where available.",
  },
  {
    title: "Book and Relax!",
    body: "Choose the itinerary that fits you best—we handle ticketing so you can focus on the trip.",
  },
] as const;

/** Perks banner checkerboard — assets in `public/perks/`. */
export const homepagePerks = [
  {
    key: "chauffeur",
    title: "Complimentary Chauffeur",
    body: "Door-to-door transfers on select itineraries when your airline includes chauffeur service in the booked fare.",
    imageSrc: "/perks/perks-chauffeur.png",
    imageAlt: "Chauffeur in uniform beside a black luxury sedan on an airport apron with terminal and aircraft in the background",
    imageObjectPosition: "object-[center_35%]",
  },
  {
    key: "hotel",
    title: "Hotel Stays",
    body: "Where your routing qualifies, we help secure included hotel stays—especially valuable on long connections.",
    imageSrc: "/perks/perks-hotel.png",
    imageAlt: "Couple in hotel bathrobes on a balcony with breakfast overlooking the water",
    imageObjectPosition: "object-[center_45%]",
  },
  {
    key: "dining",
    title: "Dining Credit",
    body: "Airline dining credits or elevated meal service on carriers that extend dining benefits to eligible partner bookings.",
    imageSrc: "/perks/perks-restaurant.png",
    imageAlt: "Overhead view of an elegant restaurant with white tablecloths and a black-and-gold marble floor",
    imageObjectPosition: "object-center",
  },
  {
    key: "coordination",
    title: "We Handle the Details",
    body: "When partner benefits are available, we help you unlock chauffeur, hotel, dining, and other extras—so travel stays seamless from booking to arrival.",
    imageSrc: "/perks/perks-coordination.png",
    imageAlt: "Businesswoman working on a laptop in a premium aircraft cabin with leather seating and oval windows",
    imageObjectPosition: "object-[center_30%]",
  },
] as const;

export const homepageDestinations = [
  {
    city: "London",
    country: "United Kingdom",
    tagline: "Flat-bed comfort on one of the most requested long-haul routes.",
    priceFrom: 4890,
    href: "/business-class-flights-to-london",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Business class cabin interior for flights to London",
  },
  {
    city: "Los Angeles",
    country: "United States",
    tagline: "Popular west coast itineraries with personalised premium-fare sourcing.",
    priceFrom: 4520,
    href: "/business-class-flights-to-los-angeles",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Premium airline cabin for flights to Los Angeles",
  },
  {
    city: "Paris",
    country: "France",
    tagline: "Elegant long-haul options for leisure and business travellers alike.",
    priceFrom: 5010,
    href: "/business-class-flights-to-paris",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Luxury business class seating for flights to Paris",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    tagline: "Competitive premium-cabin fares with concierge support from search to ticketing.",
    priceFrom: 3980,
    href: "/business-class-flights-to-dubai",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Modern business class cabin for flights to Dubai",
  },
  {
    city: "New York",
    country: "United States",
    tagline: "High-demand corporate and leisure routes sourced by experienced agents.",
    priceFrom: 5360,
    href: "/business-class-flights-to-new-york",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Business class cabin lighting for flights to New York",
  },
  {
    city: "Tel Aviv",
    country: "Israel",
    tagline: "Tailored premium itineraries with strong value on complex long-haul travel.",
    priceFrom: 4710,
    href: "/business-class-flights-to-tel-aviv",
    imageSrc: "/hero-business-class-cabin.webp",
    imageAlt: "Premium aircraft interior for flights to Tel Aviv",
  },
] as const;
