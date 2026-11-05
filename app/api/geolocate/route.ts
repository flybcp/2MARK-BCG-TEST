/**
 * GET /api/geolocate
 *
 * Best-effort IP → departure airport + dial code lookup used to pre-fill
 * the lead form. Always returns HTTP 200 with a valid `GeolocateResult`:
 * on any failure we fall back to Sydney / +61.
 *
 * Pipeline (Vercel geo headers — zero external API calls):
 *   1. Read city, country, lat/lon from Vercel's built-in `x-vercel-ip-*` headers.
 *   2. Map the response to the nearest airport in the dataset.
 *   3. Look up the dial code for the detected country (fallback "+61").
 *   4. Cache per-IP for 1 hour at the edge.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  MAJOR_HUBS,
  countryDialCode,
  geolocateFallback,
  hubRank,
  nearestAirportByCoords,
  readVercelGeoHeaders,
} from "@/lib/geolocate";
import { airports } from "@/lib/airports";
import type { Airport, GeolocateResult } from "@/lib/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest): Promise<NextResponse<GeolocateResult>> {
  const geo = readVercelGeoHeaders(request);
  const result = resolveGeo(geo);

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

function resolveGeo(
  geo: ReturnType<typeof readVercelGeoHeaders>
): GeolocateResult {
  if (!geo || !geo.countryCode) {
    return geolocateFallback();
  }

  const airport = pickAirport(geo);
  if (!airport) {
    return {
      ...geolocateFallback(),
      countryCode: geo.countryCode || "AU",
      dialCode: countryDialCode(geo.countryCode) || "+61",
    };
  }

  return {
    airport: {
      iata: airport.iata,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      countryCode: airport.countryCode,
    },
    dialCode: countryDialCode(geo.countryCode),
    countryCode: geo.countryCode,
  };
}

function preferMajorHub(list: readonly Airport[]): Airport | undefined {
  if (list.length === 0) return undefined;
  const hubs = list
    .filter((a) => MAJOR_HUBS.has(a.iata))
    .sort((x, y) => hubRank(x.iata) - hubRank(y.iata));
  if (hubs.length > 0) return hubs[0];
  const international = list.find((a) => /international/i.test(a.name));
  return international ?? list[0];
}

/**
 * Resolve the best departure airport from Vercel geo headers.
 *
 * Preference order:
 *   1. Exact city-name match in the detected country, with the
 *      major-hub / international preference applied.
 *   2. Nearest airport to the lat/lon centroid, same preference applied
 *      across the 10 closest candidates.
 *   3. First airport in the detected country.
 */
function pickAirport(geo: {
  city: string;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
}): Airport | undefined {
  const cityQuery = geo.city.trim().toLowerCase();
  if (cityQuery) {
    const cityMatches = airports.filter(
      (a) =>
        a.countryCode === geo.countryCode &&
        a.city.toLowerCase() === cityQuery
    );
    const picked = preferMajorHub(cityMatches);
    if (picked) return picked;
  }

  if (geo.latitude !== null && geo.longitude !== null) {
    const byCoords = nearestAirportByCoords(geo.latitude, geo.longitude);
    if (byCoords) return byCoords;
  }

  return airports.find((a) => a.countryCode === geo.countryCode);
}
