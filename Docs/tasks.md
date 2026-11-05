# Tasks

Canonical phased execution plan. Keep this in sync as work progresses.

**Rules**

- Each task delivers **exactly one behavior or slice**.
- Tag format: `[TAG:Name]` maps to areas in `implementation-plan.md`.
- Order matters within phases; dependencies are explicit.
- **Done when** criteria are inline.
- **Check off tasks** as they complete. Add new tasks as scope emerges — do not silently extend.
- Concrete code patterns live in `.cursor/rules/*.mdc`; this file only lists *what* to do, not *how*.

---

## Phase 0 — Project Setup

> Foundation: Next.js app, Tailwind config, repo hygiene, env scaffolding.

- [x] **P0.1** `[TAG:Setup]` Initialize Next.js **16** (latest stable) project with TypeScript, App Router, Turbopack, React 19. All dependencies at latest stable. — _Done when:_ `npm run dev` serves a blank page at `/` and `package.json` reflects Next 16.x.

- [x] **P0.2** `[TAG:Setup]` Configure Tailwind CSS (local config). Add tokens from `design-guidelines.md` (colors, fonts, backdropBlur). — _Done when:_ Custom `bg-surface`, `text-text-primary`, `text-brand`, `backdrop-blur-chrome` classes work.

- [x] **P0.3** `[TAG:Setup]` Add Inter via `next/font`. Set as default sans in Tailwind config. — _Done when:_ Body copy renders in Inter with `font-display: swap`.

- [x] **P0.4** `[TAG:Setup]` Create `app/layout.tsx`: white bg, `<html lang="en">`, base meta tags, font class on body. — _Done when:_ Layout renders and passes HTML validation.

- [x] **P0.5** `[TAG:Setup]` Install dependencies: `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `react-day-picker` (or chosen date lib). — _Done when:_ Packages in `package.json`, no install errors.

- [x] **P0.6** `[TAG:Setup]` Create `.env.local` with placeholders: `HUBSPOT_PORTAL_ID`, `HUBSPOT_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPPORT_PHONE`, plus Resend placeholders for Phase 8 (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`). Add to `.gitignore`. — _Done when:_ File exists, not tracked.

- [x] **P0.7** `[TAG:Types]` Create `lib/types.ts` with shared types: `Airport`, `LeadFormValues`, `HubspotContactProperties`, `HubspotContactRequest`, `GeolocateResult`. — _Done when:_ Types defined per `implementation-plan.md`.

- [x] **P0.8** `[TAG:Setup]` Add `content/site.ts` with constants: phone, email, ABN, review URLs, social links. — _Done when:_ Single source of truth for site-wide constants.

- [x] **P0.9** `[TAG:SEO]` Create `app/sitemap.ts` and `app/robots.ts` scaffolds. — _Done when:_ `/sitemap.xml` and `/robots.txt` respond locally.

- [x] **P0.10** `[TAG:SEO]` Configure default `metadata` in `app/layout.tsx` (title template, description, OG defaults, canonical base). — _Done when:_ View-source on `/` shows expected tags.

---

## Phase 1 — Airports + Geolocation

> Data foundations the form depends on.

- [x] **P1.1** `[TAG:Data]` Create `lib/airports.ts`: load `airports.json`, expose `searchAirports(q: string, limit = 8)` with substring match across iata + city + country + airport name (lowercase). — _Done when:_ Unit-tested search returns expected results for "SYD", "sydney", "kingsford".

- [x] **P1.2** `[TAG:Data]` Add `formatAirportLabel(a: Airport)` helper → `"Sydney (SYD) — Kingsford Smith, Australia"`. — _Done when:_ Helper returns the canonical label for every sample airport.

- [x] **P1.3** `[TAG:API]` Create `app/api/geolocate/route.ts`: read request IP, call `ipapi.co`, map to nearest airport + dial code, cache 1h. Fallback to `SYD` / `+61` on any failure. — _Done when:_ `GET /api/geolocate` returns valid JSON in both success and failure paths.

- [x] **P1.4** `[TAG:Data]` Add country → dial code map in `lib/geolocate.ts`. — _Done when:_ Given `"AU"` returns `"+61"`; unknown country returns `"+61"` fallback.

---

## Phase 2 — Lead Form Primitives

> The single most important surface on the site.

- [x] **P2.1** `[TAG:UI]` Create `components/ui/Button.tsx` (Primary, Secondary variants, sizes `md`/`lg`, `fullWidth`, loading state). — _Done when:_ All variants render per design-guidelines; loading spinner works.

- [x] **P2.2** `[TAG:UI]` Create `components/ui/Input.tsx` styled text input with label and error slot. — _Done when:_ Renders with focus states, forwards ref.

- [x] **P2.3** `[TAG:UI]` Create `components/ui/Select.tsx` styled native select wrapper. — _Done when:_ Renders travelers/class selects per spec.

- [x] **P2.4** `[TAG:UI]` Create `components/ui/Tooltip.tsx` (hover + keyboard-accessible). — _Done when:_ Phone-privacy tooltip renders and announces via `aria-describedby`.

- [x] **P2.5** `[TAG:Form]` Create `components/form/AirportAutocomplete.tsx`: combobox pattern, 60ms debounce, 8 results, keyboard nav, ARIA compliant. — _Done when:_ Typing filters results; keyboard ↑/↓/Enter/Esc work; selection fires `onChange`.

- [x] **P2.6** `[TAG:Form]` Create `components/form/DatePicker.tsx`: wraps `react-day-picker`. Exposes `onSelect`. — _Done when:_ Picker opens on focus, selects date, closes.

- [x] **P2.7** `[TAG:Form]` Create `components/form/PhoneInput.tsx`: dial-code selector + number input; default dial code from prop; info tooltip inline. — _Done when:_ Value shape matches `{ dialCode, number }`.

- [x] **P2.8** `[TAG:Form]` Create Zod schema in `lib/validation.ts` matching rules in `implementation-plan.md` (name, email, and phone all required; date constraints; etc.). — _Done when:_ Schema parses valid payloads; rejects invalid with expected field errors.

- [x] **P2.9** `[TAG:Form]` Create `components/form/LeadForm.tsx` composing all inputs with `react-hook-form` + Zod resolver. Add honeypot field + mount-time timer. — _Done when:_ Form renders all fields; client-side validation shows inline errors.

- [x] **P2.10** `[TAG:UX]` Implement auto-advance focus flow: departure → destination → depart date (picker auto-opens) → return date (picker auto-opens) → name → email → phone. — _Done when:_ Flow works without any extra clicks between fields.

- [x] **P2.11** `[TAG:UX]` On mount, call `/api/geolocate` and pre-fill departure airport + phone dial code. Silent fallback to SYD/+61. — _Done when:_ Fresh page load shows pre-filled departure and dial code in < 1s when geo available.

- [x] **P2.12** `[TAG:UX]` Wire submit: POST to `/api/lead`, disable button + show spinner while pending, redirect to `/thank-you?dep=&dest=` on success. — _Done when:_ Happy path works end-to-end against a mock API.

---

## Phase 3 — HubSpot Integration (CRM Contacts API v3)

> Wire the form to HubSpot by creating a Contact directly via `POST /crm/v3/objects/contacts`. No HubSpot-hosted form is used.

- [x] **P3.1** `[TAG:CRM]` In HubSpot portal (Moshe's account), create a **Private App** with scopes `crm.objects.contacts.read` and `crm.objects.contacts.write`. Capture the access token (`pat-...`). — _Done when:_ Token stored in `.env.local` as `HUBSPOT_ACCESS_TOKEN`; portal ID recorded in `HUBSPOT_PORTAL_ID`.

- [x] **P3.2** `[TAG:CRM]` Create custom contact properties on the Contact object matching `HubspotContactProperties` in `lib/types.ts` (`origin_city` / **Origin City**, `destination_city` / **Destination City**, `departure_date`, `return_date`, `passengers`, `travel_class`). — _Done when:_ All listed properties exist in Settings → Properties and a test API create succeeds.

- [x] **P3.3** `[TAG:API]` Create `lib/hubspot.ts` exporting `createContact(payload)`:
  - Build `{ properties }` exactly as `HubspotContactProperties` in `lib/types.ts` (built-ins + flight fields only).
  - Split form `name` on first whitespace → `firstname` / `lastname` (lastname may be empty string).
  - Compose `phone` as `${dialCode}${number}` (E.164, digits only).
  - POST to `https://api.hubapi.com/crm/v3/objects/contacts` with `Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}` and `Content-Type: application/json`.
  - Return typed result `{ ok: true, id } | { ok: false, status, message }`. On HubSpot `409 CONFLICT` (existing email), treat as success after a `PATCH /crm/v3/objects/contacts/{id}` with the same properties so repeat enquiries update the record.
  — _Done when:_ Function creates a new contact and updates an existing one from a server context.

- [x] **P3.4** `[TAG:API]` Create `app/api/lead/route.ts` (Node runtime): parse body, validate with Zod, run anti-spam guards, call `createContact`, return structured response. — _Done when:_ Bad payloads return 400 with field errors; valid payloads return `{ ok: true }`; HubSpot failures return 502 with user-safe message.

- [x] **P3.5** `[TAG:Security]` Add IP rate limiting to `/api/lead` (10/min per IP via in-route token bucket, keyed on `x-forwarded-for`). — _Done when:_ 11th rapid submit from same IP returns 429.

- [x] **P3.6** `[TAG:Security]` Drop submissions where the `website` honeypot is non-empty or `Date.now() - formMountedAt < 1500`. — _Done when:_ Both conditions silently return `{ ok: true }` without calling HubSpot.

- [x] **P3.7** `[TAG:UTM]` **N/A for CRM** — HubSpot receives only `HubspotContactProperties` (`lib/types.ts`). UTM / campaign capture is not extra contact properties unless deliberately added to the type and portal.

- [x] **P3.8** `[TAG:Test]` Submit a test lead end-to-end. Verify it appears in HubSpot with all fields populated and formatted per payload spec (`origin_city` = `"SYD - Sydney"`, etc.). — _Done when:_ Test contact visible in HubSpot UI with every custom property populated.

- [ ] **P3.9** `[TAG:Test]` Re-submit using the same email address. Verify the existing contact is updated (not duplicated) and latest fields overwrite stale ones. — _Done when:_ HubSpot shows a single contact record with the most recent flight details.

- [x] **P3.10** `[TAG:CRM]` Mirror all leads (`LeadForm`, `QuoteForm`, `CallbackForm`) to the BCG internal CRM: `lib/crm.ts` → `POST ${BCG_CRM_URL}/api/leads/intake` with `x-bcg-intake-key`, scheduled via `after()` in `/api/lead`. — _Done when:_ Code merged; env vars documented.

- [ ] **P3.11** `[TAG:Deploy]` Add `BCG_CRM_URL` + `BCG_INTAKE_SECRET` to Vercel (Production + Preview), confirm the bcg-crm production domain, and submit a test lead. — _Done when:_ Lead appears in bcg-crm and logs show `crm_success`.

---

## Phase 4 — Homepage

> The primary conversion surface.

- [x] **P4.1** `[TAG:Layout]` Create `components/layout/Header.tsx`: brand-navy header with logo, primary nav, white phone CTA/menu controls, and floating WhatsApp/back-to-top actions. — _Done when:_ Header uses the confirmed navy theme, the phone CTA remains prominent, and floating actions are accessible.

- [x] **P4.2** `[TAG:Layout]` Create `components/layout/Footer.tsx`: frosted glass footer with nav, contact, accreditation, legal links. — _Done when:_ Footer renders with all required links.

- [x] **P4.3** `[TAG:Section]` Create `components/sections/Hero.tsx`: background image, gradient overlay, star rating badge, headline, centered `LeadForm`. — _Done when:_ Hero renders at design spec; form is visible within first viewport at 375px, 768px, 1440px.

- [x] **P4.4** `[TAG:Section]` Create `components/sections/AirlineLogos.tsx`: row of grayscale airline logos with caption. — _Done when:_ Logos wrap gracefully on mobile, single row on desktop.

- [x] **P4.5** `[TAG:Section]` Create `components/sections/ValueProps.tsx`: three checkmark items ("Save 30–70% off retail", "Free chauffeur & hotel night with select bookings", "Personalized concierge service"). — _Done when:_ Section matches spec on all breakpoints.

- [x] **P4.6** `[TAG:Section]` Create `components/sections/HowItWorks.tsx`: three numbered steps (Request a callback → Review the best deals → Book and save). — _Done when:_ Numbered circles render, copy matches draft.

- [x] **P4.7** `[TAG:Section]` Create `components/sections/PerksBanner.tsx`: navy card with premium-partnership copy on chauffeur / hotel / dining credit. — _Done when:_ Banner feels premium (not couponish) and matches design pattern in guidelines.

- [x] **P4.8** `[TAG:Section]` Create `components/sections/DestinationCard.tsx` + `DestinationGrid.tsx` + `DestinationCarousel.tsx`: all destinations from `getAllDestinations()`, carousel shows 3 at a time on `md+` (1 on narrow mobile) with prev/next controls. — _Done when:_ Every destination slug is reachable from the homepage block; cards keep photo, "Business Class to [City]", "from $X,XXX".

- [x] **P4.9** `[TAG:Section]` Create `components/sections/ReviewsSection.tsx`: Trustpilot + Google Reviews ratings with link-outs and optional quote cards. — _Done when:_ Ratings display with links; quotes optional until Moshe supplies.

- [x] **P4.10** `[TAG:Section]` Create `components/sections/AccreditationBar.tsx`: IATA logo, ABN 68667677072, ACN, ARC. — _Done when:_ Bar renders with placeholder values for unknowns.

- [x] **P4.11** `[TAG:Screen]` Compose `app/page.tsx` in section order: Hero → AirlineLogos → ValueProps → HowItWorks → PerksBanner → DestinationGrid → ReviewsSection → AccreditationBar. — _Done when:_ Homepage renders all sections in the correct order.

---

## Phase 5 — Supporting Pages

> About, Contact, Legal.

- [x] **P5.1** `[TAG:Screen]` Build `app/about/page.tsx`: company story, concierge positioning, accreditation detail. Primary CTA: **Contact us** link to `/contact` (full quote form remains on homepage). — _Done when:_ Page renders with draft copy and passes lint.

- [x] **P5.2** `[TAG:Screen]` Build `app/contact/page.tsx`: phone, email, and embedded `LeadForm`. — _Done when:_ Form on contact page submits successfully to HubSpot.

- [x] **P5.3** `[TAG:Screen]` Build `app/terms/page.tsx` from existing legacy content (migrate or draft). — _Done when:_ Long-form prose template renders cleanly; TOC optional.

- [x] **P5.3a** `[TAG:Screen]` Build `app/refund-policy/page.tsx` (merchant-account requirement) from client-supplied copy; remove conflicting fee/credit rules from `/terms` and link to the policy instead. — _Done when:_ Page renders, appears in footer and sitemap.

- [x] **P5.4** `[TAG:Screen]` Build `app/privacy/page.tsx`. — _Done when:_ Draft privacy policy renders per legal template.

- [x] **P5.5** `[TAG:Screen]` Build `app/thank-you/page.tsx`: warm confirmation copy + expected callback window. — _Done when:_ Page renders with placeholder timing from `site.ts`.

- [x] **P5.6** `[TAG:SEO]` Add `generateMetadata` + canonical + OG tags to every supporting page. — _Done when:_ Each page has unique title, description, OG image.

- [x] **P5.7** `[TAG:404]` Build `app/not-found.tsx` with friendly copy + popular destinations. — _Done when:_ Unknown route renders the custom 404.

---

## Phase 6 — Destination / Blog Pages

> Migrate the 12 existing articles onto a reusable SEO template.

- [x] **P6.1** `[TAG:Content]` Create `content/destinations/` directory and define the frontmatter/TS schema: `slug`, `city`, `country`, `heroImage`, `priceFrom`, `title`, `description`, `body` (MDX or structured), `relatedSlugs`. — _Done when:_ TypeScript-typed content module compiles.

- [x] **P6.2** `[TAG:Screen]` Create `app/business-class-flights-to-[slug]/page.tsx` template: hero with contextual headline, article body, embedded `LeadForm` (destination pre-filled), related destinations, accreditation bar. — _Done when:_ Template renders for any slug with test content.

- [x] **P6.3** `[TAG:Content]` Migrate 12 articles from the legacy site into `content/destinations/*`. Clean up copy to match new tone; add missing H2/H3 structure where needed. — _Done when:_ All 12 pages render at their new URLs.

- [x] **P6.4** `[TAG:SEO]` Per destination: unique keyword-rich `<title>` and `<meta description>`; `<h1>` with primary keyword; descriptive image `alt` text; clean slug (`/business-class-flights-to-london`). — _Done when:_ Each page passes on-page SEO checklist.

- [x] **P6.5** `[TAG:SEO]` Add structured data per destination: `Article` (or `FAQPage` where an FAQ exists) + `BreadcrumbList`. — _Done when:_ Rich Results Test validates both schemas.

- [x] **P6.6** `[TAG:Link]` Add internal linking: each destination links to 3–5 related destinations and back to homepage. — _Done when:_ Every destination page has a "Related Destinations" block with valid links.

- [x] **P6.7** `[TAG:UX]` Pre-fill the embedded form's destination field with the current destination's IATA. — _Done when:_ Landing on `/business-class-flights-to-london` shows LHR in the destination input.

- [x] **P6.8** `[TAG:SEO]` Add all destination slugs to `app/sitemap.ts`. — _Done when:_ `/sitemap.xml` lists every destination page.

---

## Phase 7 — Vercel, homepage SEO/perf, polish & QA

> Preview deploy and env wiring first, then homepage structured data and LCP, then production readiness checks.

- [ ] **P7.1** `[TAG:Deploy]` Push to GitHub and connect the repo to Vercel (Moshe's account). — _Done when:_ A preview deployment succeeds.

- [ ] **P7.2** `[TAG:Deploy]` Add Production + Preview env vars in Vercel: `HUBSPOT_PORTAL_ID`, `HUBSPOT_ACCESS_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPPORT_PHONE`. — _Done when:_ Preview deploy submits to HubSpot successfully and triggers the follow-up email.

- [ ] **P7.3** `[TAG:SEO]` Add `generateMetadata` + JSON-LD (`LocalBusiness`/`TravelAgency`) to homepage with phone, ABN, aggregate rating. — _Done when:_ Rich Results Test validates the structured data.

- [ ] **P7.4** `[TAG:Perf]` Optimize hero image: `next/image` with `priority`, `sizes`, explicit dimensions. — _Done when:_ Lighthouse mobile shows no LCP warnings.

- [ ] **P7.5** `[TAG:Error]` Add `app/error.tsx` global error boundary with retry CTA and fallback phone number. — _Done when:_ A thrown error renders the boundary in dev.

- [ ] **P7.6** `[TAG:Error]` Surface `/api/lead` failures in the form UI with friendly copy + phone fallback. — _Done when:_ Forcing a 500 shows the fallback message without losing entered data.

- [ ] **P7.7** `[TAG:Mobile]` Mobile audit at 375px: form fully usable, no horizontal scroll, tap targets ≥ 44px, focus order correct. — _Done when:_ Full flow completes on iPhone SE viewport without zooming.

- [ ] **P7.8** `[TAG:A11y]` Accessibility audit: axe / Lighthouse. Focus visible on every interactive element; labels on every input; alt text on every image; combobox ARIA correct. — _Done when:_ No serious/critical violations; Lighthouse Accessibility ≥ 95.

- [ ] **P7.9** `[TAG:Perf]` Lighthouse mobile audit: Performance ≥ 90, Best Practices ≥ 95, SEO ≥ 95. Optimize images / defer scripts as needed. — _Done when:_ All four categories meet targets on homepage.

- [ ] **P7.10** `[TAG:SEO]` Validate structured data across homepage, a destination page, and a legal page with Google Rich Results Test. — _Done when:_ No errors; warnings documented or resolved.

- [ ] **P7.11** `[TAG:QA]` Cross-browser smoke: Chrome, Safari (desktop + iOS), Firefox, Edge. Submit the form once per browser. — _Done when:_ All four browsers produce a HubSpot contact.

---

## Phase 8 — Follow-up Email (Resend)

> Sits between QA and Deploy so production launches with the automated follow-up already wired. Until this phase lands, Moshe follows up manually from HubSpot.
>
> **Rule:** the email send is a best-effort side-effect of a successful HubSpot contact create. A Resend/API failure must **never** bubble up to the browser as a form error — the lead is already safe in HubSpot.
>
> **Contact page:** `/contact` submits `inquiryKind: "callback"` (short callback form, no flight fields). Automated follow-up in Phase 8 must cover **two** paths: the existing flight-quote email for `inquiryKind: "flight"`, and a **separate** callback-oriented email for `inquiryKind: "callback"` — tracked as **P8.8** below.

- [x] **P8.1** `[TAG:Email]` Create a Resend account, generate an **API key**, and verify the sending domain (e.g. `businessclassglobal.com`) in the Resend dashboard so `EMAIL_FROM` is allowed. — _Done when:_ Test send from the Resend UI succeeds; API key stored locally in `.env.local` as `RESEND_API_KEY`.

- [x] **P8.2** `[TAG:Setup]` Install the official `resend` package at latest stable. Add to `.env.local`: `RESEND_API_KEY`, `EMAIL_FROM="Business Class Global <info@bcgflights.com>"` (or another verified-from address), `EMAIL_REPLY_TO=info@bcgflights.com`. — _Done when:_ Package installed and env populated locally.

- [x] **P8.3** `[TAG:Email]` Create `lib/email.ts`:
  - Export `sendFollowUpEmail(lead)` that builds the subject `Your Flight to ${destinationCity}` and renders the HTML template defined in `.cursor/rules/api-routes.mdc`.
  - Parse `destinationCity` from `destinationLabel` (text before first `"("` or `" - "`).
  - Use a single `Resend` client instance created at module scope (reused across invocations per Fluid Compute reuse).
  — _Done when:_ A unit test or manual script calling `sendFollowUpEmail` against a test recipient sends a valid message.

- [x] **P8.4** `[TAG:API]` Wire `sendFollowUpEmail` into `/api/lead` **after** `createContact` resolves ok and **only** when `email` was provided. Wrap the call in try/catch — log failures to the server console and continue; never change the response to the client. — _Done when:_ Lead submit returns `{ ok: true }` even if Resend is down or misconfigured; HubSpot contact is still created; failure is visible in Vercel logs.

- [x] **P8.5** `[TAG:Email]` Idempotency: prevent duplicate follow-ups if the same email resubmits within 5 minutes (lookup HubSpot contact `hs_lastmodifieddate` or keep an in-memory LRU per server instance). — _Done when:_ Re-submitting within the window updates the HubSpot contact but does not send a second email.

- [x] **P8.6** `[TAG:Test]` Local end-to-end test with a personal email. Confirm the follow-up arrives within 60s, renders correctly on Gmail mobile/desktop + Apple Mail iOS, and the reply-to is `info@bcgflights.com`. — _Done when:_ Moshe signs off on the rendered email.

- [x] **P8.7** `[TAG:Email]` DNS for deliverability: complete Resend’s domain verification on the sending domain (SPF/DKIM records they provide in the dashboard) and add a DMARC record (start `p=none`) if not already present. (DNS records often live in GoDaddy; configure alongside Phase 9 `P9.1` if easier.) — _Done when:_ `mail-tester.com` score ≥ 8/10 from a test send once the DNS work is live.

- [x] **P8.8** `[TAG:Email]` **Callback / contact form follow-up:** add `sendCallbackFollowUpEmail` (or equivalent) with subject and HTML body appropriate for “we received your callback request” (no route/dates). Wire in `/api/lead` after successful `createContact` when `inquiryKind === "callback"` and `email` is present — same try/catch / never-fail-response rule as flight follow-up. Extend idempotency (**P8.5**) so the flight and callback templates do not double-send inappropriately. — _Done when:_ Test submit from `/contact` triggers only the callback email; homepage flight submit still triggers only the flight email.

- [x] **P8.9** `[TAG:Email]` **Existing contact team alert:** when HubSpot reports an existing contact and `/api/lead` updates it via PATCH, send an internal Resend email to `info@bcgflights.com` with contact details and requested itinerary details. — _Done when:_ Duplicate-email lead submit updates HubSpot and alerts the team without changing the browser response.

---

## Phase 9 — DNS, search & handoff

> Production domain, Search Console, and launch sign-off. Vercel project connection and env vars are **Phase 7** (`P7.1`–`P7.2`).

- [ ] **P9.1** `[TAG:DNS]` Point `businessclassglobal.com` and `www.businessclassglobal.com` to Vercel via GoDaddy DNS; verify HTTPS. — _Done when:_ Production domain serves the site over TLS.

- [ ] **P9.2** `[TAG:SEO]` Verify the property in Google Search Console and submit `sitemap.xml`. — _Done when:_ Search Console shows "Success" for sitemap ingestion.

- [ ] **P9.3** `[TAG:Handoff]` Walk Moshe through: HubSpot inbox with a real test lead, a real follow-up email in the test inbox, admin access to Vercel project, GoDaddy DNS state, and how to request copy/content edits. — _Done when:_ Moshe signs off on launch.

- [ ] **P9.4** `[TAG:Test]` Post-launch smoke: landing → form submit → HubSpot contact → follow-up email. — _Done when:_ Every step succeeds on the production domain.

---

## Definition of Done (per task)

- Single behavior shipped
- Mobile responsive (where applicable)
- No TypeScript errors
- No console errors
- Lighthouse regressions triaged
- Matches `design-guidelines.md`
```
