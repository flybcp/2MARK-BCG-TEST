/**
 * Shared Zod schema for the lead form — used by React Hook Form on the client
 * and by `POST /api/lead` on the server (Phase 3+). Phase 2 ships a mock
 * route that validates with this schema only.
 */
import { z } from "zod";
import { emailTldTypoMessage } from "@/lib/email-domain";
import { getAirportByIata } from "@/lib/airports";
import { validInternationalPhone } from "@/lib/phone";

export function isISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
const airportCode = z.string().trim().toUpperCase().refine(code => Boolean(getAirportByIata(code)), "Select an airport from the suggestions");

export function todayISO(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Email and phone are BOTH required for every lead — the field-level rules
 * below enforce non-empty + format. Do not weaken this without updating
 * `.cursor/rules/project-context.mdc`, `.cursor/rules/form.mdc`, and the
 * matching copy in `Docs/`.
 */
const emailField = z
  .string()
  .trim()
  .min(1, "Please enter your email")
  .email("Please enter a valid email")
  .superRefine((val, ctx) => {
    const typoMsg = emailTldTypoMessage(val);
    if (typoMsg) {
      ctx.addIssue({ code: "custom", message: typoMsg });
    }
  });

/** National number: digits only, 6–15 digits (E.164-friendly). Required. */
const phoneField = z
  .string()
  .min(1, "Please enter your phone number")
  .regex(/^\d{6,15}$/, "Enter 6–15 digits (numbers only, no letters)");

/** Full flight lead — homepage / about embedded form. */
export const leadFormSchema = z
  .object({
    inquiryKind: z.literal("flight"),
    tripType: z.enum(["round-trip", "one-way"]),
    cabinClass: z.enum(["business", "first", "premium-economy"]),
    travelers: z.number().int().min(1).max(9),

    departureIata: airportCode,
    departureLabel: z.string().min(1, "Select a departure airport"),
    destinationIata: airportCode,
    destinationLabel: z.string().min(1, "Select a destination airport"),

    departDate: z
      .string()
      .min(1, "Choose a departure date")
      .refine(isISODate, "Choose a valid departure date")
      .refine((d) => d >= todayISO(), "Depart date must be today or later"),
    returnDate: z.string().default(""),

    name: z.string().trim().min(1, "Please enter your name"),
    email: emailField,
    phone: phoneField,
    dialCode: z.string().regex(/^\+[1-9]\d{0,3}$/, "Choose a country dial code").default("+61"),

    pageUrl: z.string().url(),

    /** Honeypot — real users leave blank. */
    website: z.string().default(""),
    formMountedAt: z.number(),

    /** Google Ads tracking — all optional, captured from URL params. */
    gclid: z.string().default(""),
    utmSource: z.string().default(""),
    utmMedium: z.string().default(""),
    utmCampaign: z.string().default(""),
    utmTerm: z.string().default(""),
    utmContent: z.string().default(""),
  })
  .refine(v => validInternationalPhone(v.dialCode, v.phone), { path: ["phone"], message: "Check your number and country code (maximum 15 digits total)" })
  .refine((v) => v.destinationIata !== v.departureIata, {
    path: ["destinationIata"],
    message: "Destination must differ from departure",
  })
  .refine(
    (v) => {
      if (v.tripType === "one-way") return true;
      return v.returnDate.length > 0;
    },
    { path: ["returnDate"], message: "Choose a return date" }
  )
  .refine(
    (v) => {
      if (v.tripType === "one-way") return true;
      if (!v.returnDate) return false;
      return isISODate(v.returnDate) && v.returnDate >= todayISO();
    },
    { path: ["returnDate"], message: "Return date must be today or later" }
  )
  .refine(
    (v) => {
      if (v.tripType === "one-way") return true;
      if (!v.returnDate) return false;
      return v.returnDate >= v.departDate;
    },
    { path: ["returnDate"], message: "Return date must be on or after departure" }
  );

export type LeadFormParsed = z.infer<typeof leadFormSchema>;

/** Contact page — name + email + phone; same HubSpot pipeline via `/api/lead`. */
export const callbackFormSchema = z.object({
  inquiryKind: z.literal("callback"),
  name: z.string().trim().min(1, "Please enter your name"),
  email: emailField,
  phone: phoneField,
  dialCode: z.string().regex(/^\+[1-9]\d{0,3}$/, "Choose a country dial code").default("+61"),
  pageUrl: z.string().url(),
  website: z.string().default(""),
  formMountedAt: z.number(),

  /** Google Ads tracking — all optional, captured from URL params. */
  gclid: z.string().default(""),
  utmSource: z.string().default(""),
  utmMedium: z.string().default(""),
  utmCampaign: z.string().default(""),
  utmTerm: z.string().default(""),
  utmContent: z.string().default(""),
}).refine(v => validInternationalPhone(v.dialCode, v.phone), { path: ["phone"], message: "Check your number and country code (maximum 15 digits total)" });

export type CallbackFormParsed = z.infer<typeof callbackFormSchema>;

function defaultFlightInquiryKind(data: unknown): unknown {
  if (data && typeof data === "object" && !("inquiryKind" in data)) {
    return { ...data, inquiryKind: "flight" };
  }
  return data;
}

/** POST `/api/lead` body — flight enquiry or contact callback. */
export const leadApiBodySchema = z.preprocess(
  defaultFlightInquiryKind,
  z.discriminatedUnion("inquiryKind", [leadFormSchema, callbackFormSchema])
);

export type LeadApiParsed = z.infer<typeof leadApiBodySchema>;

/** Flatten Zod issues to `{ field: message }` for API 400 responses. */
export function flattenFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const iss of error.issues) {
    const path = iss.path.filter((p): p is string | number => true);
    const key = path.length ? String(path[0]) : "_form";
    if (!out[key]) out[key] = iss.message;
  }
  return out;
}
