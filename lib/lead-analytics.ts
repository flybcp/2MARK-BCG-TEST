/**
 * Vercel Web Analytics custom events for lead forms.
 * Never send PII (email, phone, name) — only booleans, buckets, and step labels.
 */
import { track } from "@vercel/analytics";
import { z } from "zod";

export type LeadFormKind = "flight" | "callback";

export type LeadFunnelSnapshot = {
  tripType?: string;
  departureIata?: string;
  destinationIata?: string;
  departDate?: string;
  returnDate?: string;
  name?: string;
  email?: string;
  phone?: string;
  /** Flight form: true after the visitor touches any field except departure (not geo pre-fill). */
  userEngaged?: boolean;
};

export type ProgressBucket = 0 | 25 | 50 | 75 | 100;

const emailSchema = z.string().trim().email();

function isValidEmail(value: string | undefined): boolean {
  return emailSchema.safeParse(value ?? "").success;
}

function isValidPhone(value: string | undefined): boolean {
  return /^\d{6,15}$/.test(value ?? "");
}

function baseProps(formKind: LeadFormKind) {
  return { form_type: formKind };
}

export function leadTrack(
  name: string,
  formKind: LeadFormKind,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window === "undefined" || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") return;
  track(name, { ...baseProps(formKind), ...properties });
}

export function flightFunnelState(snapshot: LeadFunnelSnapshot): {
  bucket: ProgressBucket;
  lastStep: string;
  travelComplete: boolean;
  contactComplete: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  started: boolean;
} {
  const hasDep = snapshot.departureIata?.length === 3;
  const hasDest = snapshot.destinationIata?.length === 3;
  const hasDepartDate = Boolean(snapshot.departDate);
  const roundTrip = snapshot.tripType !== "one-way";
  const hasReturn = roundTrip ? Boolean(snapshot.returnDate) : true;
  const travelComplete =
    hasDep && hasDest && hasDepartDate && hasReturn;

  const hasName = Boolean(snapshot.name?.trim());
  const hasEmail = isValidEmail(snapshot.email);
  const hasPhone = isValidPhone(snapshot.phone);
  const contactComplete = hasName && hasEmail && hasPhone;

  let lastStep = "none";
  if (hasPhone) lastStep = "phone";
  else if (hasEmail) lastStep = "email";
  else if (hasName) lastStep = "name";
  else if (roundTrip && hasDepartDate && !snapshot.returnDate)
    lastStep = "return_date";
  else if (hasDepartDate) lastStep = "depart_date";
  else if (hasDest) lastStep = "destination";
  else if (hasDep) lastStep = "departure";

  if (!snapshot.userEngaged) {
    return {
      bucket: 0,
      lastStep: "none",
      travelComplete: false,
      contactComplete: false,
      hasEmail: false,
      hasPhone: false,
      started: false,
    };
  }

  // Departure alone is often geolocation pre-fill — not meaningful progress.
  const hasUserEngagement =
    hasDest ||
    hasDepartDate ||
    hasName ||
    Boolean(snapshot.email?.trim()) ||
    Boolean(snapshot.phone);

  let bucket: ProgressBucket = 0;
  if (contactComplete) bucket = 100;
  else if (hasEmail || (hasName && hasDepartDate)) bucket = 75;
  else if (travelComplete) bucket = 50;
  else if (hasUserEngagement) bucket = 25;

  return {
    bucket,
    lastStep,
    travelComplete,
    contactComplete,
    hasEmail,
    hasPhone,
    started: true,
  };
}

export function callbackFunnelState(snapshot: LeadFunnelSnapshot): {
  bucket: ProgressBucket;
  lastStep: string;
  contactComplete: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  started: boolean;
} {
  const hasName = Boolean(snapshot.name?.trim());
  const hasEmail = isValidEmail(snapshot.email);
  const hasPhone = isValidPhone(snapshot.phone);
  const contactComplete = hasName && hasEmail && hasPhone;

  let lastStep = "none";
  if (hasPhone) lastStep = "phone";
  else if (hasEmail) lastStep = "email";
  else if (hasName) lastStep = "name";

  let bucket: ProgressBucket = 0;
  if (contactComplete) bucket = 100;
  else if (hasEmail) bucket = 75;
  else if (hasName) bucket = 50;
  else if (Boolean(snapshot.email?.trim()) || Boolean(snapshot.phone))
    bucket = 25;

  const started = bucket > 0;

  return {
    bucket,
    lastStep,
    contactComplete,
    hasEmail,
    hasPhone,
    started,
  };
}

export function timeOnFormBucket(mountAtMs: number): string {
  if (mountAtMs <= 0) return "unknown";
  const sec = Math.floor((Date.now() - mountAtMs) / 1000);
  if (sec < 15) return "under_15s";
  if (sec < 60) return "15_60s";
  if (sec < 300) return "1_5m";
  return "over_5m";
}

export function submitLatencyBucket(startMs: number): string {
  const ms = Date.now() - startMs;
  if (ms < 500) return "under_500ms";
  if (ms < 1500) return "500_1500ms";
  return "over_1500ms";
}

export type SubmitErrorType =
  | "validation"
  | "validation_server"
  | "api_message"
  | "network";
