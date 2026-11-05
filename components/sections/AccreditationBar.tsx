import { AustralianRegisteredTravelAgentPill } from "@/components/sections/AustralianRegisteredTravelAgentPill";
import { AccreditationLogoGrid } from "@/components/sections/AccreditationLogoGrid";
import { site } from "@/content/site";

export function AccreditationBar({
  showTravelAgentPill = true,
}: {
  showTravelAgentPill?: boolean;
}) {
  return (
    <section
      className="bg-white px-4 pb-14 pt-2"
      aria-label="Industry accreditation and identifiers"
    >
      <div className="mx-auto max-w-6xl text-center">
        {showTravelAgentPill ? (
          <div className="mb-6 mt-4 flex justify-center md:mt-6">
            <AustralianRegisteredTravelAgentPill variant="onLight" />
          </div>
        ) : null}
        <div className={showTravelAgentPill ? "" : "mt-6"}>
          <AccreditationLogoGrid />
        </div>
        {site.accreditation.acn ? (
          <p className="mt-4 text-sm text-text-tertiary">
            ACN {site.accreditation.acn}
          </p>
        ) : null}
      </div>
    </section>
  );
}
