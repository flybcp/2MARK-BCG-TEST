"use client";

import {
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Visible label; omit when using `aria-label` on the select. */
  label?: string;
  error?: string;
  compact?: boolean;
  infield?: boolean;
  startIcon?: ReactNode;
  embedded?: boolean;
  /** Taller infield row + larger text (homepage lead form). */
  largeInfield?: boolean;
  /** Compact infield row (e.g. trip type row on lead form). */
  infieldSize?: "md" | "sm";
  /** Replaces default `bg-white` on the infield shell (e.g. translucent). */
  infieldShellClassName?: string;
  /** Infield: keep label on the top line (value always has a selected option, so it stays up). */
  floatingInfield?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      error,
      id,
      className,
      compact,
      infield,
      startIcon,
      embedded,
      largeInfield,
      infieldSize = "md",
      infieldShellClassName,
      floatingInfield,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) {
    const sm = infieldSize === "sm";
    const gen = useId();
    const selectId = id ?? gen;
    const a11yLabel = ariaLabel ?? label;

    const shell = cn(
      infieldShellClassName ?? "bg-white",
      sm
        ? "min-h-10 md:min-h-11"
        : largeInfield
          ? "min-h-[3.75rem] md:min-h-[4rem]"
          : "min-h-[3.25rem]",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-inset",
      embedded
        ? "h-full rounded-none border-0"
        : "rounded-lg border border-border",
      error && "ring-2 ring-error ring-inset"
    );

    if (infield) {
      if (floatingInfield && label) {
        return (
          <div className={cn("min-w-0", embedded && "flex h-full flex-col")}>
            <label htmlFor={selectId} className="sr-only">
              {label}
            </label>
            <div className={cn("flex flex-col justify-center text-left", shell)}>
              <span
                className={cn(
                  "pointer-events-none w-full pl-0.5 text-left text-text-tertiary",
                  sm ? "pt-0.5 text-[0.65rem] leading-tight" : "px-1 pt-1 text-xs"
                )}
                aria-hidden
              >
                {label}
              </span>
              <div
                className={cn(
                  "relative flex min-h-0 flex-1 items-center gap-1.5 text-left",
                  sm ? "gap-1 px-2 pb-1.5" : "gap-1.5 px-3 pb-2 md:px-4"
                )}
              >
                {startIcon ? (
                  <span
                    className={cn(
                      "pointer-events-none shrink-0 self-center text-brand",
                      sm && "[&_svg]:h-3.5 [&_svg]:w-3.5",
                      !sm && largeInfield && "[&_svg]:h-5 [&_svg]:w-5",
                      !sm && !largeInfield && "[&_svg]:h-4 [&_svg]:w-4"
                    )}
                  >
                    {startIcon}
                  </span>
                ) : null}
                <select
                  ref={ref}
                  id={selectId}
                  aria-label={a11yLabel}
                  aria-invalid={error ? true : undefined}
                  className={cn(
                    "min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent text-left text-text-primary outline-none",
                    sm ? "pr-6 text-xs font-medium md:text-sm" : "pl-0.5 pr-7",
                    !sm && largeInfield && "text-base font-medium md:text-lg",
                    !sm && !largeInfield && "text-sm font-medium",
                    className
                  )}
                  {...props}
                >
                  {children}
                </select>
                <ChevronDown
                  className={cn(
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand",
                    sm ? "right-1.5 h-3.5 w-3.5" : "right-2",
                    !sm && largeInfield && "h-5 w-5",
                    !sm && !largeInfield && "h-4 w-4"
                  )}
                  aria-hidden
                />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={cn("min-w-0", embedded && "flex h-full flex-col")}>
          {label ? (
            <label htmlFor={selectId} className="sr-only">
              {label}
            </label>
          ) : null}
          <div
            className={cn(
              "relative flex items-center gap-1.5",
              sm
                ? "gap-1 px-2 py-1.5"
                : largeInfield
                  ? "gap-2 px-4 py-3"
                  : "px-3 py-2.5",
              shell
            )}
          >
            {startIcon ? (
              <span
                className={cn(
                  "pointer-events-none shrink-0 text-brand",
                  sm && "[&_svg]:h-3.5 [&_svg]:w-3.5",
                  !sm && largeInfield && "[&_svg]:h-5 [&_svg]:w-5",
                  !sm && !largeInfield && "[&_svg]:h-4 [&_svg]:w-4"
                )}
              >
                {startIcon}
              </span>
            ) : null}
            <select
              ref={ref}
              id={selectId}
              aria-label={a11yLabel}
              aria-invalid={error ? true : undefined}
              className={cn(
                "min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent py-0.5 text-text-primary outline-none",
                sm ? "pl-0.5 pr-6 text-xs md:text-sm" : "pl-0.5 pr-7",
                !sm && largeInfield && "text-base md:text-lg",
                !sm && !largeInfield && "text-sm",
                className
              )}
              {...props}
            >
              {children}
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand",
                sm ? "right-1.5 h-3.5 w-3.5" : "right-2",
                !sm && largeInfield && "h-5 w-5",
                !sm && !largeInfield && "h-4 w-4"
              )}
              aria-hidden
            />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={selectId}
            className={cn(
              "block font-medium text-text-primary",
              compact ? "mb-1 text-xs" : "mb-1.5 text-sm"
            )}
          >
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full appearance-none border border-border bg-white text-text-primary",
            "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand",
            compact
              ? "min-h-[2.75rem] rounded-lg px-3 py-2 text-sm"
              : "rounded-xl px-4 py-3 text-base",
            error && "border border-error ring-2 ring-error",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
