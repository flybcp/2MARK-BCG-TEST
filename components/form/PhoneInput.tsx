"use client";

import { useMemo, useState, type Ref } from "react";
import { ChevronDown } from "lucide-react";
import { listDialCodeOptions } from "@/lib/geolocate";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

const TOOLTIP_COPY =
  "Required for a call back. We use your number to respond to your travel request.";

function flagEmoji(countryCode: string): string {
  if (countryCode.length !== 2) return "";
  const A = 0x1f1e6;
  const up = countryCode.toUpperCase();
  const c0 = up.codePointAt(0);
  const c1 = up.codePointAt(1);
  if (
    c0 === undefined ||
    c1 === undefined ||
    c0 < 65 ||
    c0 > 90 ||
    c1 < 65 ||
    c1 > 90
  ) {
    return "";
  }
  return String.fromCodePoint(A + c0 - 65, A + c1 - 65);
}

export type PhoneInputProps = {
  dialCode: string;
  onDialCodeChange: (dial: string) => void;
  phone: string;
  onPhoneChange: (num: string) => void;
  phoneInputRef?: Ref<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  id?: string;
  compact?: boolean;
  infield?: boolean;
  embedded?: boolean;
  /** Taller infield row + larger text (homepage lead form). */
  largeInfield?: boolean;
  /**
   * When `code`, dial `<option>` labels show only E.164 (e.g. `+61`) so the
   * country selector stays narrow. Full labels stay in `aria-label` via the select.
   */
  dialOptionFormat?: "full" | "code";
  /** Infield: `Mobile` hint animates; dial column unchanged. */
  floatingInfield?: boolean;
};

export function PhoneInput({
  dialCode,
  onDialCodeChange,
  phone,
  onPhoneChange,
  phoneInputRef,
  error,
  disabled,
  id = "lead-phone",
  compact,
  infield,
  embedded,
  largeInfield,
  dialOptionFormat = "full",
  floatingInfield,
}: PhoneInputProps) {
  const options = useMemo(() => listDialCodeOptions(), []);
  const hintId = `${id}-privacy-hint`;
  const codeOnly = dialOptionFormat === "code";
  const [phoneFocused, setPhoneFocused] = useState(false);
  const floatHint = "Mobile";
  const floated = Boolean(
    floatingInfield && (phone.length > 0 || phoneFocused)
  );

  if (infield) {
    return (
      <div className={cn("w-full min-w-0", embedded && "h-full")}>
        <span id={hintId} className="sr-only">
          Phone number required. {TOOLTIP_COPY}
        </span>
        <div
          className={cn(
            "flex items-stretch divide-x divide-border/60 bg-white",
            largeInfield ? "min-h-[3.75rem] md:min-h-[4rem]" : "min-h-[3.25rem]",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-inset",
            embedded ? "rounded-none border-0" : "rounded-lg border border-border",
            error && "ring-2 ring-error ring-inset"
          )}
        >
          <div
            className={cn(
              "relative flex shrink-0 items-stretch",
              // Code-only row still includes flag emoji in option text; needs room for 🇦 + "+61" etc.
              codeOnly
                ? "w-[min(5.75rem,36%)] max-w-[6.75rem]"
                : "w-[min(7.25rem,42%)]"
            )}
          >
            <select
              aria-label="Country dial code"
              value={dialCode}
              disabled={disabled}
              onChange={(e) => onDialCodeChange(e.target.value)}
              className={cn(
                "h-full w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent py-2.5 pl-2 pr-7 text-text-primary outline-none",
                largeInfield
                  ? "min-h-[3.75rem] text-base md:min-h-[4rem] md:text-lg"
                  : "min-h-[3.25rem] text-sm",
                codeOnly && "pl-1.5 pr-6 text-xs md:pl-2 md:text-sm",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {options.map((o) => {
                const fe = flagEmoji(o.countryCode);
                return (
                  <option
                    key={`${o.countryCode}-${o.dialCode}`}
                    value={o.dialCode}
                  >
                    {codeOnly
                      ? fe
                        ? `${fe} ${o.dialCode}`
                        : o.dialCode
                      : `${fe} ${o.label}`}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-brand",
                largeInfield ? "h-5 w-5" : codeOnly ? "h-3.5 w-3.5" : "h-4 w-4"
              )}
              aria-hidden
            />
          </div>
          <div
            className={cn(
              "flex min-w-0 flex-1",
              floatingInfield ? "items-stretch" : "items-center"
            )}
          >
            {floatingInfield ? (
              <div className="relative flex min-w-0 flex-1 flex-col justify-center px-1 py-1 text-left">
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none w-full pl-0.5 text-left text-text-tertiary transition-[transform,font-size,opacity] duration-200 ease-out",
                    floated
                      ? "mb-0.5 self-start text-xs"
                      : "absolute left-0 right-0 top-1/2 -translate-y-1/2 pl-0.5 text-sm"
                  )}
                >
                  {floatHint}
                </span>
                <input
                  ref={phoneInputRef}
                  id={id}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  disabled={disabled}
                  value={phone}
                  maxLength={15}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                    onPhoneChange(digits);
                  }}
                  onFocus={() => {
                    setPhoneFocused(true);
                  }}
                  onBlur={() => {
                    setPhoneFocused(false);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={hintId}
                  placeholder=""
                  className={cn(
                    "relative z-10 min-h-0 w-full min-w-0 border-0 bg-transparent px-1.5 py-0.5 text-left text-text-primary outline-none",
                    largeInfield
                      ? "text-base font-medium md:text-lg"
                      : "text-sm font-medium",
                    !floated && "text-transparent caret-text-primary"
                  )}
                />
              </div>
            ) : (
              <input
                ref={phoneInputRef}
                id={id}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                disabled={disabled}
                value={phone}
                maxLength={15}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                  onPhoneChange(digits);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={hintId}
                placeholder="Mobile"
                className={cn(
                  "h-full min-h-0 w-full min-w-0 border-0 bg-transparent px-2 py-2.5 text-text-primary outline-none placeholder:text-text-tertiary",
                  largeInfield ? "text-base md:text-lg" : "text-sm"
                )}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={cn("flex items-center gap-2", compact ? "mb-1" : "mb-1.5")}>
        <label
          id={hintId}
          htmlFor={id}
          className={cn(
            "font-medium text-text-primary",
            compact ? "text-xs" : "text-sm"
          )}
        >
          Phone number
        </label>
        <Tooltip content={TOOLTIP_COPY} />
      </div>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-stretch",
          compact ? "gap-1.5" : "gap-2"
        )}
      >
        <div className="sm:w-[min(100%,14rem)] shrink-0">
          <Select
            aria-label="Country dial code"
            compact={compact}
            value={dialCode}
            onChange={(e) => onDialCodeChange(e.target.value)}
            disabled={disabled}
            error={undefined}
          >
            {options.map((o) => (
              <option key={`${o.countryCode}-${o.dialCode}`} value={o.dialCode}>
                {flagEmoji(o.countryCode)} {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={phoneInputRef}
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            disabled={disabled}
            value={phone}
            maxLength={15}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
              onPhoneChange(digits);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={hintId}
            className={cn(
              "w-full border border-border bg-white text-text-primary",
              "placeholder:text-text-tertiary",
              "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand",
              compact
                ? "min-h-[2.75rem] rounded-lg px-3 py-2 text-sm"
                : "min-h-[3.25rem] rounded-xl px-4 py-3 text-base",
              error && "border border-error ring-2 ring-error"
            )}
            placeholder="Mobile number"
          />
        </div>
      </div>
    </div>
  );
}
