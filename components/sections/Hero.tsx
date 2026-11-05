import { LeadForm } from "@/components/form/LeadForm";

export function Hero() {
 return <section className="bcg-hero"><div className="bcg-hero-rings" aria-hidden/><div className="bcg-container bcg-hero-content"><p className="bcg-eyebrow">BUSINESS & FIRST CLASS SPECIALISTS</p><h1>Your trip made easy.<br/><em>Your journey, elevated.</em></h1><p className="bcg-hero-description">Exceptional flights. Thoughtful service. A dedicated specialist to bring it all together.</p><div className="bcg-hero-points"><span>✓ Personalised flight options</span><span>✓ Premium cabin expertise</span><span>✓ A real person, every step</span></div><div id="lead-form" className="bcg-hero-form"><LeadForm/></div><p className="bcg-hero-footnote">A more personal way to book premium travel.</p></div></section>;
}
