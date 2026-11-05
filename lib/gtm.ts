/**
 * Google Tag Manager dataLayer helpers.
 *
 * Mirrors the privacy stance of `lib/lead-analytics.ts`: never push PII
 * (name, email, phone) into the dataLayer — only non-identifying context that
 * is useful for conversion attribution and audience segmentation.
 */
import { sendGTMEvent } from "@next/third-parties/google";

type LeadSubmitParams = {
  /** Which form instance produced the lead, for GTM segmentation. */
  formName: "quote_form" | "lead_form";
  tripType?: string;
  cabinClass?: string;
  travelers?: number;
  departureIata?: string;
  destinationIata?: string;
};

/**
 * Push a `lead_submit` event to the GTM dataLayer after a lead is successfully
 * captured. Use this as the conversion trigger for GA4 / Google Ads in GTM.
 */
export function trackLeadSubmit(params: LeadSubmitParams): void {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GTM_ID) return;
  sendGTMEvent({
    event: "lead_submit",
    form_type: "flight",
    form_name: params.formName,
    trip_type: params.tripType,
    cabin_class: params.cabinClass,
    travelers: params.travelers,
    departure: params.departureIata,
    destination: params.destinationIata,
  });
}
