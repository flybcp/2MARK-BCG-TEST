# Implementation Plan

High-level architecture and contracts. **Concrete code patterns live in `.cursor/rules/`**, loaded when relevant files are open.

All dependencies install at **latest stable** — do not pin older majors. Next.js 16 ships with React 19 and Turbopack by default.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS (local config) |
| Forms | React Hook Form + Zod |
| Date picker | `react-day-picker` |
| Icons | Lucide React |
| Geolocation | IP lookup (`ipapi.co` or `ip-api.com`) |
| Airports | Static `airports.json` at repo root |
| CRM | HubSpot CRM **Contacts API v3** (Private App token) |
| Follow-up email | Resend API via official `resend` SDK (deferred phase) |
| Hosting | Vercel · **DNS** GoDaddy |

## Architecture

```
┌────────────────── Static Pages (SSG) ────────────────────┐
│  / · /about · /contact · /terms · /privacy · /thank-you  │
│  /business-class-flights-to-[slug] (12 destinations)     │
│                                                          │
│         all embed  <LeadForm />                          │
└─────────────────────────────┬────────────────────────────┘
                              │ submit
                              ▼
┌────────────── Vercel Serverless Functions ──────────────┐
│ POST /api/lead      → HubSpot CRM Contacts API v3       │
│                       then (deferred) → Resend            │
│ GET  /api/geolocate → ipapi.co + airport mapping        │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │ HubSpot Portal            │
                │ Contacts object + custom  │
                │ flight properties         │
                └───────────────────────────┘
```

No database, no auth, no persistence.

## API Contracts (summary)

**POST `/api/lead`** — see `.cursor/rules/form.mdc` for full schema and `.cursor/rules/api-routes.mdc` for route logic.

- Input: form payload (name, email?, phone?, dialCode, departure/destination IATA + labels, depart/return dates, travelers, cabin, pageUrl, honeypot, mount timestamp).
- Output: `{ ok: true }` or `{ ok: false, errors }` (400) or `{ ok: false, message }` (500/502).

**GET `/api/geolocate`** — reads request IP, returns `{ airport, dialCode, countryCode }`. Always 200; silent fallback on failure.

## HubSpot Integration (summary)

Submit leads via the **CRM Contacts API v3** (`POST https://api.hubapi.com/crm/v3/objects/contacts`) using a HubSpot Private App access token. No HubSpot form is used. Full payload shape lives in `.cursor/rules/api-routes.mdc`.

**Required custom contact properties** (create in HubSpot before go-live; field internal names must match exactly):

- `origin_city` — single-line text (label **Origin City**), e.g. `"SYD - Sydney"`
- `destination_city` — single-line text (label **Destination City**), e.g. `"LHR - London Heathrow"`
- `departure_date` — date picker, ISO `YYYY-MM-DD`
- `return_date` — date picker, ISO `YYYY-MM-DD` (blank for one-way; one-way deferred)
- `passengers` — single-line text (stored as string per HubSpot examples)
- `travel_class` — single-line text, e.g. `"Business Class"`

Built-in properties used: `firstname`, `lastname`, `email`, `phone`. The exact wire payload is `HubspotContactProperties` in `lib/types.ts` — nothing else is sent to HubSpot.

The `name` field from the form is split on the first whitespace into `firstname` / `lastname` server-side. `phone` is stored as `${dialCode}${number}` (E.164). The HubSpot Private App needs scopes `crm.objects.contacts.write` and `crm.objects.contacts.read`.

## Follow-up Email (see `tasks.md` Phase 8)

After a successful contact create, the server sends a templated follow-up email from `Business Class Global <info@bcgflights.com>` via the Resend API (official `resend` npm package). Failure to send must never fail the lead submission — the contact in HubSpot is the source of truth; email errors are logged and surfaced via monitoring only.

Template copy and variables are defined in `.cursor/rules/api-routes.mdc` and rendered from a plain HTML string (no MJML/React Email in V1).

## File Structure

```
/
├── app/
│   ├── layout.tsx                    # Root — header, footer, metadata, font
│   ├── page.tsx                      # Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   ├── thank-you/page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── business-class-flights-to-[slug]/page.tsx
│   └── api/
│       ├── lead/route.ts
│       └── geolocate/route.ts
├── components/
│   ├── ui/              # Button, Input, Select, Tooltip, Badge
│   ├── form/            # LeadForm, AirportAutocomplete, DatePicker, PhoneInput
│   ├── layout/          # Header, Footer
│   ├── sections/        # Hero, AirlineLogos, ValueProps, HowItWorks, PerksBanner, DestinationGrid, DestinationCard, ReviewsSection, AccreditationBar
│   └── seo/             # JsonLd, schemas
├── content/
│   ├── destinations/    # 12 typed destination modules
│   └── site.ts          # Phone, ABN, review URLs, constants
├── lib/
│   ├── airports.ts      # Load + search airports.json
│   ├── validation.ts    # Zod schemas (shared client/server)
│   ├── hubspot.ts       # HubSpot CRM Contacts API v3 wrapper
│   ├── email.ts         # Resend (`resend` SDK) — added in Phase 8
│   ├── geolocate.ts     # IP lookup wrapper
│   └── types.ts
├── public/              # hero, airlines/, accred/, destinations/, og/
├── styles/globals.css
├── airports.json
├── tailwind.config.ts
└── next.config.js
```

## SEO — Summary

Every page: unique metadata, canonical, OG, semantic HTML, JSON-LD, descriptive image alts. Full checklist and schemas in `.cursor/rules/seo.mdc`.

Lighthouse mobile targets: **≥ 90 on Performance, Accessibility, Best Practices, SEO**.

## Security

- HubSpot credentials server-only.
- Zod validation client **and** server.
- Rate limit `/api/lead`: 10/min/IP.
- Anti-spam: honeypot + form mount-time check (see `.cursor/rules/form.mdc`). **No visible CAPTCHA in V1** — friction kills conversion.

## Environment Variables

```
# Server-only — HubSpot
HUBSPOT_ACCESS_TOKEN          # Private App token (pat-xxxx); scopes: crm.objects.contacts.read/write
HUBSPOT_PORTAL_ID             # kept for future workflow/reporting links (not used by Contacts API request)

# Server-only — Resend (Phase 8, follow-up email)
RESEND_API_KEY                # re_... from Resend dashboard
EMAIL_FROM="Business Class Global <info@bcgflights.com>"   # must use a domain verified in Resend
EMAIL_REPLY_TO=info@bcgflights.com

# Server-only — BCG internal CRM (all leads mirrored to POST {BCG_CRM_URL}/api/leads/intake)
BCG_CRM_URL=https://bcg-crm.vercel.app   # host only
BCG_INTAKE_SECRET             # sent as x-bcg-intake-key header

# Public
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPPORT_PHONE
```

## Performance Targets

- LCP (hero): < 2.5s on mobile 4G
- CLS: < 0.1 · INP: < 200ms
- `/api/lead` P95 latency: < 800ms
- Form visible → interactive: < 500ms after HTML arrives

## Deployment

GitHub → Vercel (Moshe's account). Env vars in Production + Preview. DNS on GoDaddy: `@` → Vercel IPs, `www` → `cname.vercel-dns.com`. Verify HTTPS. Submit sitemap to Search Console.

## Out of Scope (V1)

CMS · multi-region / hreflang · A/B testing · live chat · additional destinations beyond the initial 12 · transactional email beyond the single templated follow-up (Phase 8) · third-party analytics or paid-media pixels · paid campaign management · ongoing maintenance.

## Scoped Rules (loaded when relevant)

- `.cursor/rules/nextjs.mdc` — App Router, metadata, fonts, images, scripts
- `.cursor/rules/components.mdc` — Tailwind tokens, component code patterns
- `.cursor/rules/form.mdc` — Lead form UX, Zod schema, autocomplete, phone input, geolocation, anti-spam
- `.cursor/rules/api-routes.mdc` — `/api/lead`, `/api/geolocate`, HubSpot payload, error shapes, rate limiting
- `.cursor/rules/seo.mdc` — metadata, JSON-LD, sitemap, robots, Lighthouse targets
- `.cursor/rules/destinations.mdc` — destination template, content schema, internal linking
