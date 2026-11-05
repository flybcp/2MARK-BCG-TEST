import { IndustryPartnerMarks } from "@/components/sections/IndustryPartnerMarks";

/**
 * Inline partner marks below accreditation in the hero. SVGs use currentColor — set text-* on the wrapper.
 */
export function HeroPartnerLogos() {
  return (
    <IndustryPartnerMarks className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-text-tertiary md:gap-x-6" />
  );
}
