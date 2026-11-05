import Image from "next/image";
import { accreditationLogos } from "@/lib/accreditation-logos";

export function AccreditationLogoGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-5 ${className}`}
    >
      {accreditationLogos.map((item) => (
        <div
          key={item.label}
          className="flex min-h-20 items-center justify-center rounded-2xl border border-border bg-white px-6 py-5 shadow-sm"
        >
          <Image
            src={item.src}
            alt={`${item.label} logo`}
            width={item.width}
            height={item.height}
            unoptimized
            className="h-10 w-auto object-contain md:h-12"
          />
        </div>
      ))}
    </div>
  );
}
