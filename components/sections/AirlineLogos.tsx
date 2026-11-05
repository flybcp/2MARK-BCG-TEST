import Image from "next/image";
import { site } from "@/content/site";
export function AirlineLogos(){return <section className="bcg-airlines" aria-label="Airlines"><div className="bcg-container"><p>EXPLORE YOUR NEXT JOURNEY WITH LEADING AIRLINES</p><ul>{site.airlines.filter(a=>a.name!=="Virgin Australia").map(airline=><li key={airline.name}><Image src={airline.src} alt={airline.name} width={150} height={45} unoptimized/></li>)}</ul><small>Airline availability and cabin features vary by route and aircraft.</small></div></section>;}
