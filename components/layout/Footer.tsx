import Link from "next/link";
import { Brand } from "./Brand";
import { site } from "@/content/site";

export function Footer() {
 return <footer className="bcg-footer"><div className="bcg-container"><div className="bcg-footer-top"><div><Brand/><p>Premium flights. Personal service.</p></div><div className="bcg-footer-links"><h2>Explore</h2>{site.nav.primary.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</div><div className="bcg-footer-contact"><h2>Let’s plan your journey</h2><a href={`tel:${site.phones.au.e164}`}>AU: {site.phones.au.label}</a><a href={`tel:${site.phones.us.e164}`}>US: {site.phones.us.label}</a><a href={`https://wa.me/${site.phones.secondary.e164.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer">WhatsApp: {site.phones.secondary.label}</a><a href={`mailto:${site.email}`}>{site.email}</a></div></div><div className="bcg-footer-bottom"><span>© {new Date().getFullYear()} {site.legalName}.</span><nav aria-label="Legal">{site.nav.legal.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav></div><p className="bcg-footer-address">{site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}, {site.address.country} · ABN {site.abn}</p></div></footer>;
}
