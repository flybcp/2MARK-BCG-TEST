"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";
import { cn } from "@/lib/cn";
import { useOverlayPosition } from "@/lib/overlay-position";

export type DatePickerFieldProps = {
  id?: string;
  label: string;
  compact?: boolean;
  infield?: boolean;
  embedded?: boolean;
  /** Shown inside the control when no date is chosen (infield / merged strip). */
  emptyHint?: string;
  error?: string;
  value: string;
  onChange: (isoDate: string) => void;
  /** Fires after a date is chosen (for focus advance). */
  onSelectComplete?: () => void;
  minDate?: Date;
  disabled?: boolean;
  /** When true, opening the calendar is tied to input focus. */
  autoOpenOnFocus?: boolean;
  triggerRef?: Ref<HTMLButtonElement>;
  /**
   * Shown distinctly in the grid (e.g. departure date inside the return-date picker).
   */
  contextDate?: Date;
  /** Taller infield trigger + larger text (homepage lead form). */
  largeInfield?: boolean;
  /** Infield: `emptyHint` as top label, slides up on open / when a date is set. */
  floatingInfield?: boolean;
};

function toISO(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function DatePickerField({
  id: idProp,
  label,
  compact,
  infield,
  embedded,
  emptyHint = "Select date",
  error,
  value,
  onChange,
  onSelectComplete,
  minDate,
  disabled,
  autoOpenOnFocus = true,
  triggerRef,
  contextDate,
  largeInfield,
  floatingInfield,
}: DatePickerFieldProps) {
  const gen = useId();
  const baseId = idProp ?? `date-${gen}`;

  const selected = useMemo(() => {
    if (!value) return undefined;
    try {
      return parseISO(value);
    } catch {
      return undefined;
    }
  }, [value]);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const overlay = useOverlayPosition(open, rootRef);
  /**
   * Mouse / touch: focus fires before click; `onFocus` would open and `onClick`
   * would toggle closed in the same gesture. Skip auto-open on focus when a
   * pointer just hit the trigger so only `onClick` toggles.
   */
  const skipFocusOpenRef = useRef(false);

  const min = minDate ?? new Date();

  const modifiers = useMemo(() => {
    if (!contextDate || Number.isNaN(contextDate.getTime())) return undefined;
    return { bcg_depart_anchor: contextDate };
  }, [contextDate]);

  const modifiersClassNames = useMemo(
    () => ({
      bcg_depart_anchor:
        "[&_button]:relative [&_button]:z-0 [&_button]:bg-brand-accent/25 [&_button]:font-semibold [&_button]:ring-2 [&_button]:ring-brand-accent [&_button]:ring-inset",
    }),
    []
  );

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onPointerUp() {
      skipFocusOpenRef.current = false;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [open]);

  const display =
    selected && !Number.isNaN(selected.getTime())
      ? format(selected, "d MMM yyyy")
      : "";

  const showText = display || emptyHint;
  const showMuted = !display;
  const floated = Boolean(
    infield && floatingInfield && (open || display.length > 0)
  );

  const triggerClass = infield
    ? cn(
        "flex w-full text-left text-text-primary",
        floatingInfield
          ? "min-h-0 items-stretch gap-2 bg-white px-3 py-2.5"
          : "items-center gap-2 bg-white px-3 py-2.5",
        largeInfield
          ? floatingInfield
            ? "min-h-[3.75rem] gap-3 px-4 py-3 md:min-h-[4rem]"
            : "min-h-[3.75rem] gap-3 px-4 py-3 text-base md:min-h-[4rem] md:text-lg"
          : "min-h-[3.25rem] text-sm",
        "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset",
        embedded ? "rounded-none border-0" : "rounded-lg border border-border",
        error && "ring-2 ring-error ring-inset",
        disabled && "cursor-not-allowed opacity-60"
      )
    : cn(
        "flex w-full items-center gap-2 border border-border bg-white text-left text-text-primary",
        "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand",
        compact
          ? "min-h-[2.75rem] gap-1.5 rounded-lg px-3 py-2 text-sm"
          : "min-h-[3rem] gap-2 rounded-xl px-4 py-3 text-base",
        error && "border border-error ring-2 ring-error",
        disabled && "cursor-not-allowed opacity-60"
      );

  const triggerInner = (
    <button
      ref={triggerRef}
      id={`${baseId}-btn`}
      type="button"
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-expanded={open}
      onPointerDownCapture={() => {
        skipFocusOpenRef.current = true;
      }}
      onClick={() => {
        setOpen((o) => !o);
      }}
      onFocus={() => {
        if (!autoOpenOnFocus || skipFocusOpenRef.current) return;
        setOpen(true);
      }}
      className={triggerClass}
    >
      <Calendar
        className={cn(
          "shrink-0",
          infield
            ? cn(
                largeInfield ? "h-5 w-5 md:h-6 md:w-6" : "h-4 w-4",
                "text-brand",
                floatingInfield && "self-center"
              )
            : cn(compact ? "h-4 w-4" : "h-5 w-5", "text-text-tertiary")
        )}
        aria-hidden
      />
      {infield && floatingInfield ? (
        <div className="relative flex min-w-0 flex-1 flex-col justify-center text-left">
          <span
            aria-hidden
            className={cn(
              "pointer-events-none text-left text-text-tertiary transition-[transform,font-size,opacity] duration-200 ease-out",
              floated
                ? "mb-0.5 w-full self-start text-xs"
                : "absolute left-0 right-0 top-1/2 -translate-y-1/2 text-sm"
            )}
          >
            {emptyHint}
          </span>
          <span
            className={cn(
              "block min-h-5 max-w-full truncate text-left font-medium",
              largeInfield ? "text-base md:text-lg" : "text-sm",
              display ? "text-text-primary" : "text-text-tertiary",
              !floated && "text-transparent"
            )}
          >
            {display || "\u00a0"}
          </span>
        </div>
      ) : (
        <span className={cn(showMuted && "text-text-tertiary")}>{showText}</span>
      )}
    </button>
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full min-w-0", embedded && "h-full")}
    >
      {infield ? (
        <>
          <label htmlFor={`${baseId}-btn`} className="sr-only">
            {label}
          </label>
          {triggerInner}
        </>
      ) : (
        <>
          <label
            htmlFor={`${baseId}-btn`}
            className={cn(
              "block font-medium text-text-primary",
              compact ? "mb-1 text-xs" : "mb-1.5 text-sm"
            )}
            onPointerDownCapture={() => {
              skipFocusOpenRef.current = true;
            }}
          >
            {label}
          </label>
          {triggerInner}
        </>
      )}

      {open && overlay
        ? createPortal(
            <div
              ref={popoverRef}
              className="rounded-xl border border-border bg-white p-3 shadow-xl"
              style={{
                position: "fixed",
                top: overlay.top,
                left: overlay.left,
                zIndex: 300,
                margin: 0,
                minWidth: "min(100vw - 1.5rem, 20.5rem)",
                maxWidth: "min(100vw - 1.5rem, 24rem)",
              }}
            >
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(d) => {
                  if (!d) return;
                  onChange(toISO(d));
                  setOpen(false);
                  onSelectComplete?.();
                }}
                disabled={{ before: min }}
                defaultMonth={selected ?? contextDate ?? min}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
