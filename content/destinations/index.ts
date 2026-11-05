import type { Destination } from "./types";
import { london } from "./london";
import { losAngeles } from "./los-angeles";
import { paris } from "./paris";
import { dubai } from "./dubai";
import { newYork } from "./new-york";
import { telAviv } from "./tel-aviv";
import { singapore } from "./singapore";
import { hongKong } from "./hong-kong";
import { tokyo } from "./tokyo";
import { frankfurt } from "./frankfurt";
import { bangkok } from "./bangkok";
import { rome } from "./rome";

const destinations: Destination[] = [
  london,
  losAngeles,
  paris,
  dubai,
  newYork,
  telAviv,
  singapore,
  hongKong,
  tokyo,
  frankfurt,
  bangkok,
  rome,
];

const bySlug = new Map<string, Destination>(destinations.map((d) => [d.slug, d]));

export function getDestination(slug: string): Destination | undefined {
  return bySlug.get(slug);
}

export function getAllDestinationSlugs(): string[] {
  return destinations.map((d) => d.slug);
}

export function getAllDestinations(): Destination[] {
  return destinations;
}
