# Masterplan

## Vision

Rebuild businessclassglobal.com as a modern, professional concierge flight lead-generation site. The site does **not** process bookings. It captures leads via a form and delivers them to HubSpot, where the Business Class Global team follows up personally. Every design and engineering decision optimizes for one outcome: a qualified lead landing in HubSpot.

## Product

A fast, mobile-first marketing site with a single dominant lead-capture form on the hero, supporting content pages (about, terms, privacy, contact), and 12 migrated SEO-focused destination articles. The form is the product; everything else exists to build trust around it.

**Client:** Moshe Wagner, Business Class Global
**Domain:** businessclassglobal.com (DNS via GoDaddy)

## Users

Prospective premium travelers arriving primarily from paid search and display ads:

- Most are on mobile (narrow viewport is the primary design target)
- Price-conscious but brand-sensitive: they want business/first class but don't trust discount aggregators
- Ready to convert on the first visit if friction is low
- A meaningful share prefer phone callbacks over email follow-up

## Core Jobs

1. **Land the lead** — Show a prominent, trustworthy form within the first viewport on every device
2. **Reduce form friction to near-zero** — Autocomplete airports, geolocate defaults, auto-advance focus, and a single short fields stack (name, email, phone) so the lead is ready for a call or reply the moment it lands
3. **Build trust quickly** — Accreditation badges (IATA, ABN, ACN, ARC), Trustpilot and Google review ratings, airline partner logos
4. **Communicate value** — Clear "How it works" flow, exclusive perks (chauffeur, hotel night, dining credit), sample destination pricing
5. **Hand off cleanly** — Create a HubSpot Contact directly via the CRM Contacts API, redirect to the thank-you page, and (in a later phase) send a templated follow-up email from `info@bcgflights.com` via [Resend](https://resend.com)
6. **Rank in search** — Aggressive technical SEO on every page; destination articles as long-tail traffic drivers

## Current State

Legacy businessclassglobal.com site exists with 12 blog/destination articles worth migrating. No modern codebase; no existing Next.js app. HubSpot account is live; the new site writes contacts directly via the CRM Contacts API (no HubSpot-hosted form).

## Target State

| Component | Description |
|-----------|-------------|
| Homepage | Hero with form, airline logos, value props, how-it-works, perks banner, destination deals, reviews, accreditation, footer |
| Lead form | Single-step, autocompleting airport inputs, geolocated defaults, auto-advancing focus, submit → HubSpot Contact |
| About page | Company story, accreditation detail, concierge positioning |
| Contact page | Phone, email, repeated form |
| Legal pages | Terms & Conditions, Privacy Policy |
| Destination pages | 12 migrated articles on a reusable SEO-optimized template, each with the form embedded |
| HubSpot integration | CRM Contacts API v3 (Private App token); custom contact properties for flight-specific fields; dedupe on email via PATCH on 409 |
| Follow-up email | Phase 8 — templated HTML sent from `info@bcgflights.com` via Resend after a successful contact create |
| Thank-you page | Confirmation message; noindex |

## Reference Sites (priority order)

1. **businessclassguru.com** — Primary layout reference. Form front and center on hero, clean white layout, airline logos below, 3-step how-it-works, destination cards with pricing. Moshe trusts their 20-year conversion optimization.
2. **wholesale-flights.com** — Same company, same structure, slightly different branding.
3. **skywithclass.com** — Reference for prominent accreditation display (IATA, BBB A+, trust badges).
4. **business-class.com** — Secondary reference. Strong SEO. Good destination content pages. Moshe likes their "coolness" mixed with the layout of the first two.

## Non-Goals

- **Not a booking engine** — No pricing, inventory, or payment processing
- **Not a blog/CMS platform** — Destination pages are hand-migrated static content, not a dynamic editorial system
- **Not a multi-region build** — Single site; hreflang deferred
- **Not an authenticated experience** — No user accounts
- **Not rebuilding HubSpot workflows** — HubSpot is a CRM destination only; follow-up email is sent by our own server via Resend, not by a HubSpot workflow

## Future Versions (not V1)

- Additional destination content beyond the 12 migrated articles
- Full CMS (e.g., Sanity/Contentful) for editorial workflow
- Multi-region variants with `hreflang`
- Live chat / callback scheduling widget
- A/B testing harness for form variants

## Constraints

- **Mobile-first** — Most ad traffic is mobile; 375px width must look and function beautifully
- **Vercel hosting** — Moshe's account; developer access granted
- **HubSpot CRM Contacts API v3** via Private App token — no HubSpot-hosted form, no third-party connectors
- **Resend** for the Phase 8 follow-up email — API key in Vercel env; sending domain verified in the Resend dashboard (SPF/DKIM as they specify)
- **IP geolocation (no browser prompt)** — Avoid the browser Geolocation API
- **One revision round in scope** — Keep decisions crisp

## Success Metrics

- **Lead conversion**: Form submission rate from paid ad traffic meets or exceeds legacy site
- **Time to first lead**: Every page fully usable within 3 seconds on mobile 4G
- **Form completion time**: Under 45 seconds from landing to submit
- **Lighthouse mobile**: 90+ on Performance, Accessibility, Best Practices, SEO
- **HubSpot data integrity**: 100% of submits land in HubSpot with all flight fields populated
- **SEO**: Destination pages indexed and ranking for long-tail "business class flights to [city]" queries within 60 days of launch

## Source Content (migrate / reference when building pages)

- `Current Web Pages/Terms & Conditions.md` — **migrate and polish** for `/terms`. Keep substance, refresh tone, add a "Last updated" line.
- `Current Web Pages/Current About Page.md` — source copy for `/about` (testimonials + positioning). Can be expanded.
- `Current Web Pages/Current Landing Page.md` — legacy homepage; source of canonical destination samples (SYD–LAX, SYD–LHR, USA–AUS), testimonials, and airline list.
- `Current Web Pages/Current Services Page.md` — reference for services copy.
- `Current Web Pages/Current Contact Us Page.md` — source of contact info.
- `Current Blog Pages/*.md` — legacy articles to migrate onto the destination template (see `.cursor/rules/destinations.mdc`).

## Confirmed Assets & Decisions

- [x] **HubSpot developer access** — received
- [x] **GoDaddy developer access** — received
- [x] **ABN** 68 667 677 072
- [x] **Trustpilot profile:** https://www.trustpilot.com/review/businessclassglobal.com
- [x] **Google Business Profile** confirmed
- [x] **Logo:** gold "BCG" wordmark with plane + compass arc, transparent background — stored at `assets/bcg-logo.png`. Needs a dark (navy) or all-white variant for contrast on white content areas; the gold-on-transparent original works best over dark hero imagery or a navy chip.
- [x] **Brand palette confirmed:** premium navy `#0b2545` + gold accent `#c9a24a`. Aligns with the gold logo. Tokens in `.cursor/rules/components.mdc`.
- [x] **Design authority:** full approval to make all design choices.
- [x] **Terms & Conditions:** source exists; migrate and polish.
- [x] **Privacy Policy:** approved to draft. Standard travel-agency template; cover data collected (form fields, UTM if captured in future), HubSpot as processor, Australian Privacy Act (APP) language, opt-out/contact instructions.
- [x] **Thank-you page copy:** approved to draft (warm, professional, expected-callback window).
- [x] **Hero image:** approved to source premium aviation / business-class cabin stock imagery.
- [x] **Airline logos (confirmed list from legacy landing page):** Etihad · Virgin Australia · Emirates · United. Reasonable to add Cathay Pacific and Qantas (both referenced in legacy route copy) given the destination samples are SYD-heavy.
- [x] **Contact info:**
  - Phone (AU): `+61 2 7265 1240` — **primary number for Australian visitors** (show first when geolocation detects AU)
  - Phone (US): `+1 732 314 6891` · `+1 917 408 3716`
  - Email: `Info@BCGFlights.com`
- [x] **Brand identity:** BCG / Business Class Global only. Any legacy brand names found in source content are stripped on migration; footer copyright reads `© Business Class Global Travel Pty Ltd`.

## Still Open (flag to Moshe)

- [ ] **ACN** and **ARC** numbers
- [ ] **IATA** accreditation number (or host agency IATA)
- [ ] **Team bios** for `/about` (optional).

## Related Documents

- **[implementation-plan.md](implementation-plan.md)** — Stack, architecture, HubSpot integration, file structure, SEO technicals
- **[design-guidelines.md](design-guidelines.md)** — White-background design system, frosted-glass chrome, form UX, component patterns
- **[tasks.md](tasks.md)** — Phased execution plan with dependencies
