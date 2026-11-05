type PillVariant = "onHero" | "onLight";

const variantClass: Record<PillVariant, string> = {
  onHero:
    "border-white/25 bg-white/15 text-white shadow-md shadow-black/10 supports-[backdrop-filter]:bg-white/12",
  onLight:
    "border-border/80 bg-white/70 text-text-primary shadow-sm supports-[backdrop-filter]:bg-white/55",
};

/**
 * Trust line shown next to the lead form and above accreditation marks.
 */
export function AustralianRegisteredTravelAgentPill({
  className = "",
  variant = "onHero",
}: {
  className?: string;
  variant?: PillVariant;
}) {
  return (
    <p
      className={`inline-flex max-w-full items-center justify-center rounded-full border px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide backdrop-blur-chrome sm:text-sm ${variantClass[variant]} ${className}`}
    >
      Australian Registered Travel Agent
    </p>
  );
}
