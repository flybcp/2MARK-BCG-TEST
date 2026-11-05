"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          size === "md" && "min-h-11 px-6 py-3 text-base",
          size === "lg" && "min-h-12 px-8 py-3.5 text-lg",
          fullWidth && "w-full",
          variant === "primary" &&
            "bg-brand text-text-inverse hover:bg-brand-hover",
          variant === "secondary" &&
            "border border-border bg-transparent font-medium text-text-primary hover:border-border-hover",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {loading ? <span className="sr-only">Loading, please wait</span> : null}
        {children}
      </button>
    );
  }
);
