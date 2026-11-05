"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** When truthy, the field shows error styling; text is not rendered. */
  error?: string;
  hintId?: string;
  /** Tighter label + control sizing for dense lead forms (touch targets stay ≥ 44px). */
  compact?: boolean;
  /** Label only for SRs; placeholder / icon carry the visible affordance (merged lead strip). */
  infield?: boolean;
  startIcon?: ReactNode;
  /** Sits inside a parent-bordered cell — no outer field chrome. */
  embedded?: boolean;
  /** Taller infield row + larger text (homepage lead form). */
  largeInfield?: boolean;
  /**
   * Infield: hint slides up on focus; if the field is left empty, it returns when blurred.
   * Use with a `value` from your form (e.g. RHF + useWatch) so the hint stays up when filled.
   */
  floatingInfield?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hintId,
    id,
    className,
    compact,
    infield,
    startIcon,
    embedded,
    largeInfield,
    placeholder,
    floatingInfield,
    onFocus,
    onBlur,
    value,
    defaultValue,
    ...rest
  },
  ref
) {
  const gen = useId();
  const inputId = id ?? gen;
  const describedBy = hintId || undefined;

  const [focused, setFocused] = useState(false);
  const [inputDraft, setInputDraft] = useState(
    () => (value != null ? String(value) : defaultValue != null ? String(defaultValue) : "")
  );
  useEffect(() => {
    if (value !== undefined) {
      setInputDraft(String(value));
    }
  }, [value]);
  const effectiveVal = value !== undefined ? String(value) : inputDraft;
  const hasValue = effectiveVal.length > 0;
  const floated = Boolean(floatingInfield && (hasValue || focused));
  const hint = (placeholder ?? label).trim() || label;

  if (infield) {
    const ph = placeholder ?? label;
    return (
      <div className={cn("w-full min-w-0", embedded && "h-full")}>
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <div
          className={cn(
            "flex items-center gap-2 bg-white px-3 py-2.5",
            largeInfield
              ? "min-h-[3.75rem] gap-3 px-4 py-3 md:min-h-[4rem]"
              : "min-h-[3.25rem]",
            floatingInfield && "items-stretch",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-inset",
            embedded ? "rounded-none border-0" : "rounded-lg border border-border",
            error && "ring-2 ring-error ring-inset"
          )}
        >
          {startIcon ? (
            <span
              className={cn(
                "pointer-events-none shrink-0 text-brand",
                largeInfield ? "[&_svg]:h-5 [&_svg]:w-5" : "[&_svg]:h-4 [&_svg]:w-4",
                floatingInfield && "self-center"
              )}
            >
              {startIcon}
            </span>
          ) : null}
          {floatingInfield ? (
            <div className="relative flex min-w-0 flex-1 flex-col justify-center text-left">
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none text-left text-text-tertiary transition-[transform,font-size,opacity] duration-200 ease-out will-change-transform",
                  floated
                    ? "mb-0.5 w-full self-start text-xs leading-tight"
                    : "absolute left-0 right-0 top-1/2 -translate-y-1/2 text-sm"
                )}
              >
                {hint}
              </span>
              <input
                {...rest}
                ref={ref}
                id={inputId}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                value={value}
                defaultValue={defaultValue}
                className={cn(
                  "relative z-10 min-h-0 w-full min-w-0 border-0 bg-transparent text-left text-text-primary outline-none",
                  largeInfield ? "text-base font-medium md:text-lg" : "text-sm font-medium",
                  !floated && "text-transparent caret-text-primary",
                  className
                )}
                placeholder=""
                onChange={(e) => {
                  if (value === undefined) {
                    setInputDraft(e.target.value);
                  }
                  rest.onChange?.(e);
                }}
                onFocus={(e) => {
                  setFocused(true);
                  onFocus?.(e);
                }}
                onBlur={(e) => {
                  setFocused(false);
                  onBlur?.(e);
                }}
              />
            </div>
          ) : (
            <input
              ref={ref}
              id={inputId}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              placeholder={ph}
              className={cn(
                "min-h-0 min-w-0 flex-1 border-0 bg-transparent py-0.5 text-text-primary outline-none",
                largeInfield ? "text-base md:text-lg" : "text-sm",
                "placeholder:text-text-tertiary",
                className
              )}
              value={value}
              defaultValue={defaultValue}
              onFocus={onFocus}
              onBlur={onBlur}
              {...rest}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={cn(
          "block font-medium text-text-primary",
          compact ? "mb-1 text-xs" : "mb-1.5 text-sm"
        )}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full border border-border bg-white text-text-primary",
          "placeholder:text-text-tertiary",
          "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand",
          compact
            ? "min-h-[2.75rem] rounded-lg px-3 py-2 text-sm"
            : "rounded-xl px-4 py-3 text-base",
          error && "border border-error ring-2 ring-error",
          className
        )}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onFocus={onFocus}
        onBlur={onBlur}
        {...rest}
      />
    </div>
  );
});
