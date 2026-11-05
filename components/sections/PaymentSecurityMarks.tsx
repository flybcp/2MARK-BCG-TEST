import Image from "next/image";

const markClass =
  "h-12 w-auto max-h-12 object-contain object-center md:h-14 md:max-h-14";

const whiteWrap =
  "inline-flex items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-black/10";

const items = [
  {
    src: "/payment-brands/visa.png",
    alt: "Visa",
    width: 64,
    height: 64,
  },
  {
    src: "/payment-brands/mastercard.png",
    alt: "Mastercard",
    width: 64,
    height: 64,
  },
  {
    src: "/payment-brands/americanexpress.png",
    alt: "American Express",
    width: 64,
    height: 64,
  },
  {
    src: "/payment-brands/discover.png",
    alt: "Discover",
    width: 64,
    height: 64,
  },
] as const;

export const paymentSecurityMarksAriaLabel =
  "Accepted cards: Visa, Mastercard, American Express, and Discover";

type Props = { className?: string };

export function PaymentSecurityMarks({ className = "" }: Props) {
  return (
    <div
      className={`flex flex-wrap items-center justify-start gap-x-4 gap-y-2 ${className}`}
      aria-label={paymentSecurityMarksAriaLabel}
    >
      {items.map((m) => (
        <span key={m.src} className={whiteWrap}>
          <Image
            src={m.src}
            alt={m.alt}
            width={m.width}
            height={m.height}
            className={markClass}
          />
        </span>
      ))}
    </div>
  );
}
