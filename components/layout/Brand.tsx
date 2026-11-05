import Link from "next/link";

export function Brand() {
  return <Link href="/" className="bcg-brand" aria-label="BCG Flights home"><span className="bcg-brand-mark" aria-hidden>✦</span><span>BCG<span className="bcg-brand-sub">FLIGHTS</span></span></Link>;
}
