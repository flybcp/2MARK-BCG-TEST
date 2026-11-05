"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { searchAirports, formatAirportLabel } from "@/lib/airports";
import type { Airport } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useOverlayPosition } from "@/lib/overlay-position";

const DEBOUNCE_MS = 60;

export type AirportValue = { iata: string; label: string };

export type AirportAutocompleteProps = {
  id?: string;
  label: string;
  compact?: boolean;
  /** Merged-strip style: no title row; use `placeholder` + optional `startIcon`. */
  infield?: boolean;
  embedded?: boolean;
  placeholder?: string;
  startIcon?: ReactNode;
  error?: string;
  value: AirportValue;
  onChange: (next: AirportValue) => void;
  /** Called after the user commits a selection (Enter / click). */
  onCommittedSelection?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  disabled?: boolean;
  autoComplete?: string;
  /** Taller infield row + larger text (homepage lead form). */
  largeInfield?: boolean;
  /** Merged infield: hint animates to top on focus; falls back if left empty. */
  floatingInfield?: boolean;
};

export function AirportAutocomplete({
  id: idProp,
  label,
  compact,
  infield,
  embedded,
  placeholder,
  startIcon,
  error,
  value,
  onChange,
  onCommittedSelection,
  inputRef,
  disabled,
  autoComplete = "off",
  largeInfield,
  floatingInfield,
}: AirportAutocompleteProps) {
  const gen = useId();
  const baseId = idProp ?? `airport-${gen}`;
  const listId = `${baseId}-listbox`;

  const [query, setQuery] = useState(value.label);
  const [inputFocused, setInputFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [debouncedQ, setDebouncedQ] = useState("");
  const committedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(
    () => searchAirports(debouncedQ, 8),
    [debouncedQ]
  );

  const listVisible = open && results.length > 0;
  const overlay = useOverlayPosition(listVisible, containerRef);

  useEffect(() => {
    setQuery(value.label);
  }, [value.label, value.iata]);

  useEffect(() => {
    if (open) setActiveIdx(0);
  }, [debouncedQ, open]);

  useLayoutEffect(() => {
    if (!open || results.length === 0) return;
    document
      .getElementById(`${listId}-opt-${activeIdx}`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeIdx, listId, open, results.length]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (popoverListRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const commit = useCallback(
    (a: Airport) => {
      const next = { iata: a.iata, label: formatAirportLabel(a) };
      onChange(next);
      setQuery(next.label);
      setOpen(false);
      committedRef.current = true;
      onCommittedSelection?.();
    },
    [onChange, onCommittedSelection]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter") && results.length) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      const pick = results[activeIdx];
      if (pick) {
        e.preventDefault();
        commit(pick);
      }
    }
  };

  const activeId =
    results.length && open ? `${listId}-opt-${activeIdx}` : undefined;

  const hint = (placeholder ?? label).trim() || label;
  const floated = Boolean(
    floatingInfield &&
      (inputFocused ||
        (value?.iata && value.iata.length > 0) ||
        query.trim().length > 0)
  );

  const inputClass = infield
    ? cn(
        "min-w-0 flex-1 border-0 bg-transparent py-0.5 text-left text-text-primary outline-none",
        largeInfield ? "text-base font-medium md:text-lg" : "text-sm font-medium",
        floatingInfield && !floated && "text-transparent caret-text-primary",
        !floatingInfield && "placeholder:text-text-tertiary"
      )
    : cn(
        "w-full border border-border bg-white text-text-primary",
        "placeholder:text-text-tertiary",
        "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand",
        compact
          ? "min-h-[2.75rem] rounded-lg px-3 py-2 text-sm"
          : "rounded-xl px-4 py-3 text-base",
        error && "border border-error ring-2 ring-error"
      );

  const inputEl = (
    <input
      ref={inputRef}
      id={baseId}
      type="text"
      autoComplete={autoComplete}
      disabled={disabled}
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={activeId}
      aria-invalid={error ? true : undefined}
      placeholder={infield && !floatingInfield ? placeholder : undefined}
      value={query}
      onChange={(e) => {
        committedRef.current = false;
        const next = e.target.value;
        setQuery(next);
        setOpen(true);
        // Editing must invalidate the previous selection until an airport is committed.
        onChange({ iata: "", label: next });
      }}
      onFocus={() => {
        setInputFocused(true);
        if (debouncedQ.trim().length > 0) setOpen(true);
      }}
      onKeyDown={onKeyDown}
      onBlur={() => {
        setInputFocused(false);
        if (query.trim() === "") {
          onChange({ iata: "", label: "" });
          setQuery("");
          return;
        }
        if (!committedRef.current && query !== value.label) {
          setQuery(value.label);
        }
      }}
      className={inputClass}
    />
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full min-w-0", embedded && "h-full")}
    >
      {infield ? (
        <>
          <label htmlFor={baseId} className="sr-only">
            {label}
          </label>
          <div
            className={cn(
              "flex gap-2 bg-white px-3 py-2.5",
              largeInfield
                ? "min-h-[3.75rem] gap-3 px-4 py-3 md:min-h-[4rem]"
                : "min-h-[3.25rem]",
              floatingInfield ? "items-stretch" : "items-center",
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
                    "pointer-events-none text-left text-text-tertiary transition-[transform,font-size,opacity] duration-200 ease-out",
                    floated
                      ? "mb-0.5 w-full self-start text-xs leading-tight"
                      : "absolute left-0 right-0 top-1/2 -translate-y-1/2 text-sm"
                  )}
                >
                  {hint}
                </span>
                {inputEl}
              </div>
            ) : (
              inputEl
            )}
          </div>
        </>
      ) : (
        <>
          <label
            htmlFor={baseId}
            className={cn(
              "block font-medium text-text-primary",
              compact ? "mb-1 text-xs" : "mb-1.5 text-sm"
            )}
          >
            {label}
          </label>
          {inputEl}
        </>
      )}

      {listVisible && overlay
        ? createPortal(
            <ul
              ref={popoverListRef}
              id={listId}
              role="listbox"
              style={{
                position: "fixed",
                top: overlay.top,
                left: overlay.left,
                width: overlay.width,
                zIndex: 300,
                margin: 0,
              }}
              className="max-h-60 overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
            >
              {results.map((a, idx) => (
                <li
                  key={a.iata}
                  id={`${listId}-opt-${idx}`}
                  role="option"
                  aria-selected={idx === activeIdx}
                  className={cn(
                    "cursor-pointer px-4 py-2.5 text-sm text-text-primary",
                    idx === activeIdx
                      ? "bg-surface-muted"
                      : "hover:bg-surface-muted"
                  )}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(a)}
                >
                  {formatAirportLabel(a)}
                </li>
              ))}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}
