/**
 * Geolocation helpers used by `/api/geolocate` and by the lead form.
 *
 * This module exposes:
 *   - `countryDialCode(code)` — maps an ISO 3166-1 alpha-2 country code to
 *     its E.164 international dial code (e.g. "AU" → "+61"). Unknown or
 *     missing codes fall back to "+61" so the phone input always has a
 *     sensible default.
 *   - `nearestAirportByCoords(lat, lon)` — given a latitude/longitude pair
 *     (from `ipapi.co`), returns the closest airport in the dataset using a
 *     fast approximate distance. Used server-side only.
 *   - `fetchIpGeoData(ip)` — server-side ipapi.co lookup returning city,
 *     country, state/region, and timezone for HubSpot IP enrichment.
 *   - Fallback constants for the silent SYD / +61 default required by the
 *     lead-form UX contract.
 */
import { airports, getAirportByIata } from "./airports";
import { MAJOR_HUBS, hubRank } from "./hub-rank";
import type { Airport, GeolocateResult } from "./types";

export { MAJOR_HUB_PRIORITY, MAJOR_HUBS, hubRank } from "./hub-rank";

/**
 * ISO 3166-1 alpha-2 country code → E.164 dial code (with leading "+").
 *
 * Covers every country with a registered commercial airport in the dataset
 * plus every country Moshe currently advertises into. When the input is
 * unknown, `countryDialCode` returns the `"+61"` fallback below.
 *
 * Codes are kept in alphabetical order for easy maintenance; when adding a
 * new country, keep this shape. Multi-code territories (NANP members,
 * French overseas departments, etc.) use their own local dial code, not the
 * parent country's — e.g. Puerto Rico uses "+1", French Polynesia uses
 * "+689".
 */
const DIAL_CODES: Readonly<Record<string, string>> = {
  AC: "+247", AD: "+376", AE: "+971", AF: "+93",  AG: "+1",   AI: "+1",
  AL: "+355", AM: "+374", AO: "+244", AQ: "+672", AR: "+54",  AS: "+1",
  AT: "+43",  AU: "+61",  AW: "+297", AX: "+358", AZ: "+994",
  BA: "+387", BB: "+1",   BD: "+880", BE: "+32",  BF: "+226", BG: "+359",
  BH: "+973", BI: "+257", BJ: "+229", BL: "+590", BM: "+1",   BN: "+673",
  BO: "+591", BQ: "+599", BR: "+55",  BS: "+1",   BT: "+975", BW: "+267",
  BY: "+375", BZ: "+501",
  CA: "+1",   CC: "+61",  CD: "+243", CF: "+236", CG: "+242", CH: "+41",
  CI: "+225", CK: "+682", CL: "+56",  CM: "+237", CN: "+86",  CO: "+57",
  CR: "+506", CU: "+53",  CV: "+238", CW: "+599", CX: "+61",  CY: "+357",
  CZ: "+420",
  DE: "+49",  DJ: "+253", DK: "+45",  DM: "+1",   DO: "+1",   DZ: "+213",
  EC: "+593", EE: "+372", EG: "+20",  EH: "+212", ER: "+291", ES: "+34",
  ET: "+251",
  FI: "+358", FJ: "+679", FK: "+500", FM: "+691", FO: "+298", FR: "+33",
  GA: "+241", GB: "+44",  GD: "+1",   GE: "+995", GF: "+594", GG: "+44",
  GH: "+233", GI: "+350", GL: "+299", GM: "+220", GN: "+224", GP: "+590",
  GQ: "+240", GR: "+30",  GS: "+500", GT: "+502", GU: "+1",   GW: "+245",
  GY: "+592",
  HK: "+852", HN: "+504", HR: "+385", HT: "+509", HU: "+36",
  ID: "+62",  IE: "+353", IL: "+972", IM: "+44",  IN: "+91",  IO: "+246",
  IQ: "+964", IR: "+98",  IS: "+354", IT: "+39",
  JE: "+44",  JM: "+1",   JO: "+962", JP: "+81",
  KE: "+254", KG: "+996", KH: "+855", KI: "+686", KM: "+269", KN: "+1",
  KP: "+850", KR: "+82",  KW: "+965", KY: "+1",   KZ: "+7",
  LA: "+856", LB: "+961", LC: "+1",   LI: "+423", LK: "+94",  LR: "+231",
  LS: "+266", LT: "+370", LU: "+352", LV: "+371", LY: "+218",
  MA: "+212", MC: "+377", MD: "+373", ME: "+382", MF: "+590", MG: "+261",
  MH: "+692", MK: "+389", ML: "+223", MM: "+95",  MN: "+976", MO: "+853",
  MP: "+1",   MQ: "+596", MR: "+222", MS: "+1",   MT: "+356", MU: "+230",
  MV: "+960", MW: "+265", MX: "+52",  MY: "+60",  MZ: "+258",
  NA: "+264", NC: "+687", NE: "+227", NF: "+672", NG: "+234", NI: "+505",
  NL: "+31",  NO: "+47",  NP: "+977", NR: "+674", NU: "+683", NZ: "+64",
  OM: "+968",
  PA: "+507", PE: "+51",  PF: "+689", PG: "+675", PH: "+63",  PK: "+92",
  PL: "+48",  PM: "+508", PN: "+64",  PR: "+1",   PS: "+970", PT: "+351",
  PW: "+680", PY: "+595",
  QA: "+974",
  RE: "+262", RO: "+40",  RS: "+381", RU: "+7",   RW: "+250",
  SA: "+966", SB: "+677", SC: "+248", SD: "+249", SE: "+46",  SG: "+65",
  SH: "+290", SI: "+386", SJ: "+47",  SK: "+421", SL: "+232", SM: "+378",
  SN: "+221", SO: "+252", SR: "+597", SS: "+211", ST: "+239", SV: "+503",
  SX: "+1",   SY: "+963", SZ: "+268",
  TC: "+1",   TD: "+235", TF: "+262", TG: "+228", TH: "+66",  TJ: "+992",
  TK: "+690", TL: "+670", TM: "+993", TN: "+216", TO: "+676", TR: "+90",
  TT: "+1",   TV: "+688", TW: "+886", TZ: "+255",
  UA: "+380", UG: "+256", US: "+1",   UY: "+598", UZ: "+998",
  VA: "+39",  VC: "+1",   VE: "+58",  VG: "+1",   VI: "+1",   VN: "+84",
  VU: "+678",
  WF: "+681", WS: "+685",
  XK: "+383",
  YE: "+967", YT: "+262",
  ZA: "+27",  ZM: "+260", ZW: "+263",
};

/**
 * Representative flag to show when several countries share one dial prefix.
 * The submitted value is still only the E.164 dial code; this only controls
 * the single compact option shown in the phone selector.
 */
const PREFERRED_DIAL_COUNTRY: Readonly<Record<string, string>> = {
  "+1": "US",
  "+7": "RU",
  "+39": "IT",
  "+44": "GB",
  "+47": "NO",
  "+61": "AU",
  "+64": "NZ",
  "+212": "MA",
  "+262": "RE",
  "+358": "FI",
  "+500": "FK",
  "+590": "GP",
  "+599": "CW",
  "+672": "NF",
};

/** Silent fallbacks mandated by the lead-form UX contract. */
export const DEFAULT_COUNTRY_CODE = "AU";
export const DEFAULT_DIAL_CODE = "+61";
export const DEFAULT_AIRPORT_IATA = "SYD";

/**
 * Map an ISO 3166-1 alpha-2 country code to an E.164 dial code.
 * Unknown / blank input → `"+61"` (Australia) per the lead-form defaults.
 */
export function countryDialCode(countryCode: string | null | undefined): string {
  if (!countryCode) return DEFAULT_DIAL_CODE;
  const upper = countryCode.trim().toUpperCase();
  return DIAL_CODES[upper] ?? DEFAULT_DIAL_CODE;
}

/**
 * Fallback `GeolocateResult` used whenever the geolocation pipeline fails
 * for any reason (no IP headers, ipapi.co timeout, unknown country, no
 * matching airport). The form treats this as a silent no-op.
 */
export function geolocateFallback(): GeolocateResult {
  const airport = getAirportByIata(DEFAULT_AIRPORT_IATA);
  if (!airport) {
    return {
      airport: {
        iata: DEFAULT_AIRPORT_IATA,
        name: "Sydney Kingsford Smith International Airport",
        city: "Sydney",
        country: "Australia",
        countryCode: DEFAULT_COUNTRY_CODE,
      },
      dialCode: DEFAULT_DIAL_CODE,
      countryCode: DEFAULT_COUNTRY_CODE,
    };
  }
  return {
    airport,
    dialCode: DEFAULT_DIAL_CODE,
    countryCode: DEFAULT_COUNTRY_CODE,
  };
}

/**
 * Find the closest airport to a `(lat, lon)` point using an equirectangular
 * approximation. Accuracy is more than enough for picking a departure
 * airport from an ipapi.co city centroid — we're not navigating anything.
 *
 * We prefer large international airports over business-jet / regional
 * fields: among the 10 closest candidates we return the first whose name
 * contains "International", falling back to the outright nearest if none
 * qualify. This keeps the form pre-filling "London (LHR)" for a London
 * lookup instead of "Biggin Hill".
 *
 * If the dataset is empty (shouldn't happen in prod) returns `undefined`.
 */
/** One row for the phone dial-code `<select>` (country + E.164 code). */
export type DialCodeOption = {
  countryCode: string;
  dialCode: string;
  label: string;
};

/**
 * All ISO → dial mappings as select options.
 *
 * Labels intentionally avoid `Intl.DisplayNames`: Node's ICU and the browser
 * can disagree (e.g. Falkland Islands), which breaks React hydration for SSR.
 */
export function listDialCodeOptions(): DialCodeOption[] {
  const rows: DialCodeOption[] = Object.entries(DIAL_CODES).map(
    ([countryCode, dialCode]) => ({
      countryCode,
      dialCode,
      label: `${countryCode} (${dialCode})`,
    })
  );
  /** One compact `<option>` per E.164 prefix — many territories share e.g. `+1`. */
  const byDial = new Map<string, DialCodeOption>();
  for (const o of rows) {
    const preferredCountry = PREFERRED_DIAL_COUNTRY[o.dialCode];
    const current = byDial.get(o.dialCode);
    if (!current || o.countryCode === preferredCountry) {
      byDial.set(o.dialCode, o);
    }
  }
  const out = [...byDial.values()];
  out.sort((a, b) => {
    const na = Number(a.dialCode.replace(/\D/g, "")) || 0;
    const nb = Number(b.dialCode.replace(/\D/g, "")) || 0;
    if (na !== nb) return na - nb;
    return a.countryCode.localeCompare(b.countryCode, "en");
  });
  return out;
}

/** IP geo enrichment data for HubSpot contact properties. */
export type IpGeoData = {
  ip: string;
  city: string;
  country: string;
  state: string;
  timezone: string;
};

const countryDisplayNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryCodeToName(code: string): string {
  try {
    return countryDisplayNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Raw Vercel geo header values used for airport matching in /api/geolocate. */
export type VercelGeoHeaders = {
  ip: string;
  city: string;
  countryCode: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
};

/**
 * Read raw Vercel geo headers for airport matching.
 * Returns `null` in local dev (headers not present).
 */
export function readVercelGeoHeaders(request: Request): VercelGeoHeaders | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const rawCity = request.headers.get("x-vercel-ip-city") ?? "";
  const countryCode = (request.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  const region = request.headers.get("x-vercel-ip-country-region") ?? "";
  const timezone = request.headers.get("x-vercel-ip-timezone") ?? "";
  const latStr = request.headers.get("x-vercel-ip-latitude");
  const lonStr = request.headers.get("x-vercel-ip-longitude");

  if (!ip && !rawCity && !countryCode) return null;

  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const latitude = latStr ? parseFloat(latStr) : null;
  const longitude = lonStr ? parseFloat(lonStr) : null;

  return {
    ip,
    city,
    countryCode,
    region,
    latitude: latitude !== null && Number.isFinite(latitude) ? latitude : null,
    longitude: longitude !== null && Number.isFinite(longitude) ? longitude : null,
    timezone,
  };
}

/**
 * Read IP geolocation from Vercel's built-in request headers.
 * Zero-latency, no external API call, unlimited usage.
 * Returns `null` in local dev (headers not present).
 */
export function readIpGeoFromHeaders(request: Request): IpGeoData | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const rawCity = request.headers.get("x-vercel-ip-city") ?? "";
  const countryCode = request.headers.get("x-vercel-ip-country") ?? "";
  const region = request.headers.get("x-vercel-ip-country-region") ?? "";
  const timezone = request.headers.get("x-vercel-ip-timezone") ?? "";

  if (!ip && !rawCity && !countryCode) return null;

  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const country = countryCode ? countryCodeToName(countryCode) : "";

  return { ip, city, country, state: region, timezone };
}

export function nearestAirportByCoords(
  lat: number,
  lon: number
): Airport | undefined {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return undefined;

  const latRad = (lat * Math.PI) / 180;
  const cosLat = Math.cos(latRad);
  const candidates: Array<{ a: Airport; dist: number }> = [];

  for (const a of airports) {
    if (typeof a.lat !== "number" || typeof a.lon !== "number") continue;
    const dx = (a.lon - lon) * cosLat;
    const dy = a.lat - lat;
    candidates.push({ a, dist: dx * dx + dy * dy });
  }

  if (candidates.length === 0) return undefined;

  candidates.sort((x, y) => x.dist - y.dist);
  const shortlist = candidates.slice(0, 10);

  const hubMatches = shortlist
    .filter(({ a }) => MAJOR_HUBS.has(a.iata))
    .sort((x, y) => hubRank(x.a.iata) - hubRank(y.a.iata));
  if (hubMatches.length > 0) return hubMatches[0].a;

  const international = shortlist.find(({ a }) => /international/i.test(a.name));
  return (international ?? shortlist[0]).a;
}
