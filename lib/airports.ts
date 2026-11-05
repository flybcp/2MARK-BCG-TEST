/**
 * Airport dataset access + search.
 *
 * The raw dataset lives in the repo root as `airports.json` and ships as-is
 * to every consumer. It contains ~7,000 airports with a 3-letter IATA code —
 * enough to cover every commercial destination BCG would ever route for
 * without ballooning the client bundle.
 *
 * Two public helpers:
 *   - `searchAirports(q, limit)` for the form autocomplete (case-insensitive
 *     substring match against IATA + city + country + airport name).
 *   - `formatAirportLabel(a)` for the canonical label shape used everywhere
 *     in the UI, HubSpot payloads, and the thank-you page.
 */
import airportsData from "../airports.json";
import { hubRank } from "./hub-rank";
import type { Airport } from "./types";

/** Static, frozen airport dataset. */
export const airports: readonly Airport[] = airportsData as Airport[];

/** O(1) lookup by uppercase IATA. */
const byIata = new Map<string, Airport>(
  airports.map((a) => [a.iata.toUpperCase(), a])
);

/** Return the airport record for an IATA code (case-insensitive). */
export function getAirportByIata(iata: string): Airport | undefined {
  return byIata.get(iata.trim().toUpperCase());
}

/**
 * Build the canonical display label for an airport.
 *
 * Shape: `"Sydney (SYD) — Kingsford Smith, Australia"`.
 *
 * The "short name" strips the city prefix and any trailing
 * `" International Airport"` / `" Airport"` suffix so that labels stay tight
 * in the autocomplete dropdown and in HubSpot CRM records. When the raw
 * airport name collapses to an empty string after trimming (rare — some
 * regional fields only duplicate the city), we fall back to the original
 * name so the label never ends with an orphaned em dash.
 */
export function formatAirportLabel(a: Airport): string {
  const shortName = shortenAirportName(a.name, a.city);
  return `${a.city} (${a.iata}) — ${shortName}, ${a.country}`;
}

function shortenAirportName(name: string, city: string): string {
  let shortened = name.trim();

  const cityPrefix = city.trim();
  if (
    cityPrefix.length > 0 &&
    shortened.toLowerCase().startsWith(cityPrefix.toLowerCase() + " ")
  ) {
    shortened = shortened.slice(cityPrefix.length + 1).trim();
  }

  const suffixes = [
    " International Airport",
    " International",
    " Regional Airport",
    " Regional",
    " Municipal Airport",
    " Municipal",
    " Airport",
  ];
  for (const suffix of suffixes) {
    if (shortened.toLowerCase().endsWith(suffix.toLowerCase())) {
      shortened = shortened.slice(0, -suffix.length).trim();
      break;
    }
  }

  return shortened.length > 0 ? shortened : name;
}

/**
 * Monotonic score: higher ≈ larger / more commercially relevant airport.
 * Uses the shared major-hub list first, then name heuristics (no pax data in JSON).
 */
function airportSizeScore(a: Airport): number {
  const r = hubRank(a.iata);
  if (r !== Number.POSITIVE_INFINITY) {
    return 1_000_000 - r;
  }
  let score = 0;
  const n = a.name;
  if (/international/i.test(n)) score += 12_000;
  if (/\bintl\b/i.test(n)) score += 10_000;
  if (/regional/i.test(n)) score -= 4_000;
  if (/municipal/i.test(n)) score -= 3_000;
  if (/air base|afb\b|joint base|raaf|usaf|naval air/i.test(n)) score -= 8_000;
  return score;
}

function bySizeDesc(a: Airport, b: Airport): number {
  const ds = airportSizeScore(b) - airportSizeScore(a);
  if (ds !== 0) return ds;
  return a.iata.localeCompare(b.iata, "en");
}

/**
 * Case-insensitive substring search across IATA, city, country, and airport
 * name. Exact IATA matches first, then city / IATA prefix matches, then other
 * substring matches. Within each tier, results are **descending by size**
 * (major hubs and “international” names rank higher).
 */
export function searchAirports(q: string, limit = 8): Airport[] {
  const query = q.trim().toLowerCase();
  if (query.length === 0) return [];

  const exactIata: Airport[] = [];
  const cityPrefix: Airport[] = [];
  const other: Airport[] = [];

  for (const a of airports) {
    const iata = a.iata.toLowerCase();
    const city = a.city.toLowerCase();
    const country = a.country.toLowerCase();
    const name = a.name.toLowerCase();

    if (iata === query) {
      exactIata.push(a);
    } else if (city.startsWith(query) || iata.startsWith(query)) {
      cityPrefix.push(a);
    } else if (
      city.includes(query) ||
      country.includes(query) ||
      name.includes(query) ||
      iata.includes(query)
    ) {
      other.push(a);
    }
  }

  exactIata.sort(bySizeDesc);
  cityPrefix.sort(bySizeDesc);
  other.sort(bySizeDesc);

  return [...exactIata, ...cityPrefix, ...other].slice(0, limit);
}
