import type {Metadata} from "next";
import {LeadForm} from "@/components/form/LeadForm";
import {site} from "@/content/site";
export const metadata:Metadata={title:"Request a quote",description:"Tell us your plans and receive personalised premium cabin flight options.",alternates:{canonical:"/get-a-quote"},robots:{index:false,follow:true}};
export default function GetAQuotePage(){return <main id="main-content"><section className="bcg-hero bcg-quote-page"><div className="bcg-container bcg-hero-content"><p className="bcg-eyebrow">YOUR NEXT JOURNEY STARTS HERE</p><h1>A better way <em>to fly.</em></h1><p className="bcg-hero-description">Share your plans. Let a specialist take care of the details.</p><div id="quote-form" className="bcg-hero-form"><LeadForm/></div><p className="bcg-hero-footnote">Prefer a conversation? <a href={`tel:${site.phones.au.e164}`}>{site.phones.au.label}</a></p></div></section></main>;}
