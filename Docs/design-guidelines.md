# Design Guidelines

Principles and page inventory. **Concrete Tailwind snippets, tokens, and component code live in `.cursor/rules/components.mdc`**. Form UX specifics live in `.cursor/rules/form.mdc`.

---

## Principles

1. **Mobile-first.** Design for 375px; enhance for desktop. Most traffic is mobile ad traffic.
2. **Form above all else.** The lead form is the single most important element. First thing visible. Centered on the hero. Never a sidebar.
3. **Trust through clarity.** Accreditation badges, real review ratings, recognizable airline logos. Nothing that looks cheap or aggregator-ish.
4. **White backgrounds for content.** Every major competitor uses white. Moshe is firm on this.
5. **Frosted glass chrome.** Header and footer use `backdrop-blur` + semi-transparent white. Never solid dark bars.
6. **Generous whitespace.** Let the page breathe.
7. **Clean, professional, not flashy.** Trustworthy premium travel, not a discount aggregator.

## Reference Sites (priority order)

1. **businessclassguru.com** — Primary layout reference. Form on hero, white layout, airline logos, how-it-works, destination cards with pricing.
2. **wholesale-flights.com** — Same company, same structure.
3. **skywithclass.com** — Reference for accreditation display (IATA, BBB A+, trust badges).
4. **business-class.com** — Secondary reference. Strong SEO + polished destination content.

---

## Page Inventory

### 1. Homepage (`/`)
Hero with form · airline logos strip · 3 value props · How it Works (3 steps) · Exclusive Perks banner · 6–12 destination deal cards · Trustpilot + Google Reviews · accreditation bar · footer.

### 2. About (`/about`)
Company story · concierge positioning · accreditation detail with plain-language explanations · footer CTA form.

### 3. Contact (`/contact`)
Phone · email · embedded `LeadForm`.

### 4. Terms & Conditions (`/terms`) · 5. Privacy Policy (`/privacy`)
Long-form prose template.

### 6. Thank You (`/thank-you`)
Warm confirmation copy · expected callback window.

### 7. Destination pages (`/business-class-flights-to-<slug>`)
Reusable SEO template for 12 migrated articles. Embedded form pre-filled with the destination. See `.cursor/rules/destinations.mdc`.

### 8. 404 (`/not-found`)
Friendly copy · popular destinations · homepage link.

---

## Visual Direction

**Colors (confirmed):** premium navy `#0b2545` with gold accent `#c9a24a`, matching the gold BCG logo. White surfaces, slate text.

**Logo:** `assets/bcg-logo.png` — gold wordmark with plane + compass arc on transparent background. Place on navy/dark surfaces (header on scroll, footer, hero) or produce a navy/white variant for use on white content areas.

**Typography:** Inter (sans), loaded via `next/font`. Scale defined in `.cursor/rules/components.mdc`.

**Layout caps:**
- Mobile: full width, `px-4`
- Tablet: `max-w-3xl` for prose
- Desktop: `max-w-6xl mx-auto`

---

## Form UX (non-negotiable)

1. Single step, all fields visible.
2. Auto-advance focus: departure → destination → depart (picker opens) → return (picker opens) → name → email/phone.
3. Return date picker opens automatically after depart date is picked.
4. IP-based geolocation pre-fills departure airport + phone dial code. Fallback SYD / +61. No browser permission popup.
5. Name, email, and phone are **all required** so the sales team can always reach the lead.
6. Defaults: Business Class · 1 traveler · round trip.
7. Submit label: **"Request a Callback"**.
8. On success: POST `/api/lead` → redirect `/thank-you`.

Full schema, autocomplete behaviour, anti-spam, and geolocation contract: `.cursor/rules/form.mdc`.

---

## Accessibility (non-negotiable)

- Focus visible on every interactive element.
- Touch targets ≥ 44×44px.
- Color contrast ≥ 4.5:1 for text. Hero headline over image passes via gradient overlay.
- Visible `<label>` on every form input (not placeholder-only).
- `aria-label` on icon-only buttons.
- Autocomplete follows WAI-ARIA combobox pattern.
- Skip-to-content link at top of every page.
- Respect `prefers-reduced-motion`.

---

## Motion

- Hover: `transition-colors duration-150`.
- Card hover: slight lift (`-translate-y-0.5`) + shadow.
- **No** entrance animations on core conversion elements — the form must appear instantly.
- **No** scroll-jacking.

---

## Responsive Breakpoints

```
default: 0–639px   (mobile — primary target; must work at 375px)
sm:      640px+
md:      768px+    (tablet)
lg:      1024px+   (desktop)
```

---

## Related

- `.cursor/rules/components.mdc` — tokens, typography scale, concrete Tailwind code for every component
- `.cursor/rules/form.mdc` — form UX details, Zod schema, autocomplete, phone input, geolocation
- `.cursor/rules/seo.mdc` — metadata, structured data, sitemap
- `.cursor/rules/destinations.mdc` — destination template specifics
