import { site } from "@/content/site";
export function TrustpilotPill({variant="onLight"}:{variant?:"onLight"|"onHero"}){return <a href={site.reviews.trustpilot.url} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-xs ${variant==="onHero"?"border-white/30 text-white":"border-border text-brand"}`}>Read reviews on Trustpilot ↗</a>;}
export function TrustpilotMobileBanner(){return <div className="bg-surface py-2 text-center"><TrustpilotPill/></div>;}
