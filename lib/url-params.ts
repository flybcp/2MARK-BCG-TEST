/**
 * Utility to capture Google Ads tracking parameters from the URL.
 *
 * Google Ads appends these parameters when auto-tagging is enabled:
 * - gclid: Google Click ID (unique per ad click)
 *
 * UTM parameters can be configured in Google Ads campaign URLs:
 * - utm_source: Traffic source (e.g., "google")
 * - utm_medium: Marketing medium (e.g., "cpc")
 * - utm_campaign: Campaign name
 * - utm_term: Search keywords
 * - utm_content: Ad variant/content
 */

export interface TrackingParams {
  /** Google Click ID — automatically added by Google Ads when auto-tagging is enabled. */
  gclid: string;
  /** Traffic source (e.g., "google"). */
  utmSource: string;
  /** Marketing medium (e.g., "cpc" for paid search). */
  utmMedium: string;
  /** Campaign name as configured in Google Ads. */
  utmCampaign: string;
  /** Search keywords that triggered the ad. */
  utmTerm: string;
  /** Ad content/variant identifier. */
  utmContent: string;
}

const TRACKING_STORAGE_KEY = "bcg_tracking_params";

/**
 * Capture tracking parameters from the current URL.
 * Should be called on initial page load.
 */
export function captureTrackingParams(): TrackingParams {
  if (typeof window === "undefined") {
    return emptyTrackingParams();
  }

  const url = new URL(window.location.href);
  const params: TrackingParams = {
    gclid: url.searchParams.get("gclid") ?? "",
    utmSource: url.searchParams.get("utm_source") ?? "",
    utmMedium: url.searchParams.get("utm_medium") ?? "",
    utmCampaign: url.searchParams.get("utm_campaign") ?? "",
    utmTerm: url.searchParams.get("utm_term") ?? "",
    utmContent: url.searchParams.get("utm_content") ?? "",
  };

  // If we captured any tracking params, persist them to sessionStorage
  // so they survive navigation within the site
  if (hasAnyTrackingParams(params)) {
    try {
      sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(params));
    } catch {
      // sessionStorage may be unavailable (private browsing, etc.)
    }
  }

  return params;
}

/**
 * Get tracking parameters, checking sessionStorage first (for params captured on landing),
 * then falling back to current URL params.
 */
export function getTrackingParams(): TrackingParams {
  if (typeof window === "undefined") {
    return emptyTrackingParams();
  }

  // First check sessionStorage for params captured on initial landing
  try {
    const stored = sessionStorage.getItem(TRACKING_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<TrackingParams>;
      if (hasAnyTrackingParams(parsed as TrackingParams)) {
        return {
          gclid: parsed.gclid ?? "",
          utmSource: parsed.utmSource ?? "",
          utmMedium: parsed.utmMedium ?? "",
          utmCampaign: parsed.utmCampaign ?? "",
          utmTerm: parsed.utmTerm ?? "",
          utmContent: parsed.utmContent ?? "",
        };
      }
    }
  } catch {
    // sessionStorage unavailable or parse error
  }

  // Fall back to current URL params
  return captureTrackingParams();
}

/**
 * Clear stored tracking params after successful form submission.
 * This ensures fresh tracking is captured on subsequent visits.
 */
export function clearTrackingParams(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(TRACKING_STORAGE_KEY);
  } catch {
    // sessionStorage may be unavailable
  }
}

function emptyTrackingParams(): TrackingParams {
  return {
    gclid: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };
}

function hasAnyTrackingParams(params: TrackingParams): boolean {
  return Boolean(
    params.gclid ||
      params.utmSource ||
      params.utmMedium ||
      params.utmCampaign ||
      params.utmTerm ||
      params.utmContent
  );
}
