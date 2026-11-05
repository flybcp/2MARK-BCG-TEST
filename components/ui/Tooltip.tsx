"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

type TooltipProps = {
  /** Accessible description (shown in tooltip panel). */
  content: string;
  /** Optional custom trigger; default is an info icon button. */
  children?: ReactNode;
  className?: string;
};

/**
 * Hover + keyboard-accessible tooltip. Links trigger to content via
 * `aria-describedby` when open (and keeps the id on the tooltip node for SRs).
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  const id = useId();
  const tipId = `tip-${id}`;
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearHide();
    setOpen(true);
  }, [clearHide]);

  const scheduleHide = useCallback(() => {
    clearHide();
    hideTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearHide]);

  useEffect(() => () => clearHide(), [clearHide]);

  return (
    <span className={cn("relative inline-flex align-middle", className)}>
      {children ? (
        <span
          className="inline-flex"
          onMouseEnter={show}
          onMouseLeave={scheduleHide}
          onFocus={show}
          onBlur={scheduleHide}
        >
          {children}
        </span>
      ) : (
        <button
          type="button"
          className={cn(
            "inline-flex h-11 min-w-11 items-center justify-center rounded-lg",
            "text-text-tertiary hover:text-brand",
            "focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          )}
          aria-label="More information"
          aria-describedby={tipId}
          aria-expanded={open}
          onMouseEnter={show}
          onMouseLeave={scheduleHide}
          onFocus={show}
          onBlur={scheduleHide}
        >
          <Info className="h-5 w-5 shrink-0" aria-hidden />
        </button>
      )}
      <span
        id={tipId}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-[100] mt-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-white px-3 py-2 text-left text-xs text-text-secondary shadow-lg",
          !open && "sr-only"
        )}
      >
        {content}
      </span>
    </span>
  );
}
