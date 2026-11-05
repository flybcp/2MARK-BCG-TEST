import { site } from "@/content/site";

/**
 * Inline ABN, ACN, and CCRA member marks. Wordmarks use currentColor — set text-* on the wrapper.
 */
export const industryPartnerMarksAriaLabel =
  "Industry partners: Australian Business Number, ACN, and CCRA Travel Commerce Network member";

type Props = {
  className: string;
  /** Defaults to the long description used in the hero. */
  "aria-label"?: string;
};

export function IndustryPartnerMarks({
  className,
  "aria-label": ariaLabel = industryPartnerMarksAriaLabel,
}: Props) {
  return (
    <div className={className} aria-label={ariaLabel}>

<span
        title={site.abn}
        className="inline-flex shrink-0 cursor-help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 108 56"
          fill="none"
          role="img"
          aria-label={`Australian Business Number ${site.abn}`}
          className="h-6 w-auto md:h-7"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0 56) scale(0.1 -0.1)"
            fill="currentColor"
          >
            <path d="M155 308 c-50 -89 -91 -165 -93 -170 -2 -4 12 -8 32 -8 31 0 38 5 58 40 22 38 25 40 75 40 l52 0 3 -37 c3 -36 5 -38 38 -41 l36 -3 -18 158 c-9 87 -17 164 -18 171 0 7 -14 12 -38 12 l-37 0 -90 -162z m115 12 l0 -60 -30 0 c-16 0 -30 5 -30 10 0 13 49 110 55 110 3 0 5 -27 5 -60z" />
            <path d="M431 322 c-17 -81 -34 -158 -38 -170 -5 -22 -4 -22 89 -22 83 0 99 3 123 22 54 43 65 120 20 146 -14 7 -13 11 10 26 53 35 55 105 4 131 -17 9 -57 15 -102 15 l-73 0 -33 -148z m169 62 c0 -33 -25 -53 -68 -54 -30 0 -32 2 -26 28 11 50 13 52 54 52 37 0 40 -2 40 -26z m-35 -117 c13 -10 16 -21 11 -41 -7 -28 -39 -46 -82 -46 -23 0 -25 3 -19 33 13 63 16 67 44 67 15 0 35 -6 46 -13z" />
            <path d="M760 466 c0 -2 -16 -74 -35 -162 -19 -87 -35 -162 -35 -167 0 -4 15 -7 33 -5 l32 3 20 108 c11 59 22 107 26 107 3 0 16 -48 30 -107 l24 -108 37 -3 c32 -3 38 0 43 20 24 106 65 300 65 308 0 5 -13 10 -29 10 -34 0 -35 -1 -60 -132 -15 -78 -19 -88 -25 -63 -3 17 -16 67 -28 113 l-21 82 -39 0 c-21 0 -38 -2 -38 -4z" />
          </g>
        </svg>
      </span>

      <svg
        viewBox="0 0 56 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-auto shrink-0 md:h-8"
        aria-hidden
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="system-ui, ui-sans-serif, sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="0.06em"
        >
          ACN
        </text>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 158 40"
        fill="none"
        role="img"
        aria-label="CCRA Travel Commerce Network member"
        className="h-7 w-auto shrink-0 md:h-8"
      >
        <path fill="#F58220" d="M20 20V2A18 18 0 0 0 2 20Z" />
        <path fill="#3D7EAE" d="M20 20H2A18 18 0 0 0 20 38Z" />
        <path fill="#1E3A5F" d="M20 20V38A18 18 0 0 0 38 20Z" />
        <path fill="#5B9FD4" d="M20 20H38A18 18 0 0 0 20 2Z" />
        <path
          fill="#fff"
          d="M20 11.2l1.7 4.9 5.1.1-4.1 3.1 1.5 4.9L20 21.4l-4.2 2.8 1.5-4.9-4.1-3.1 5.1-.1Z"
        />
        <text
          x="46"
          y="20"
          fill="currentColor"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="20"
          letterSpacing="4"
        >
          ccra
        </text>
        <text
          x="100"
          y="9"
          fill="currentColor"
          fontFamily="system-ui, ui-sans-serif, sans-serif"
          fontSize="5"
          fontWeight="600"
        >
          TM
        </text>
        <text
          x="46"
          y="30"
          fill="currentColor"
          fontFamily="system-ui, ui-sans-serif, sans-serif"
          fontSize="5.2"
          fontWeight="600"
          letterSpacing="0.14em"
        >
          TRAVEL COMMERCE NETWORK
        </text>
      </svg>

    </div>
  );
}
