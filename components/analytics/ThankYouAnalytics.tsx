"use client";

import { useEffect, useRef } from "react";
import { leadTrack, type LeadFormKind } from "@/lib/lead-analytics";

type ThankYouAnalyticsProps = {
  formKind: LeadFormKind;
  hasRoute: boolean;
};

export function ThankYouAnalytics({
  formKind,
  hasRoute,
}: ThankYouAnalyticsProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    leadTrack("thank_you_view", formKind, {
      has_route: hasRoute,
    });
  }, [formKind, hasRoute]);

  return null;
}
