"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import {
  callbackFunnelState,
  flightFunnelState,
  leadTrack,
  submitLatencyBucket,
  timeOnFormBucket,
  type LeadFormKind,
  type LeadFunnelSnapshot,
  type ProgressBucket,
  type SubmitErrorType,
} from "@/lib/lead-analytics";

type UseLeadFormAnalyticsOptions = {
  formKind: LeadFormKind;
  snapshot: LeadFunnelSnapshot;
  mountAtRef: RefObject<number>;
};

/**
 * Milestone + abandonment tracking for lead/callback forms.
 * Call `markSubmitted()` after a successful lead capture (before redirect).
 */
export function useLeadFormAnalytics({
  formKind,
  snapshot,
  mountAtRef,
}: UseLeadFormAnalyticsOptions) {
  const submittedRef = useRef(false);
  const startedRef = useRef(false);
  const abandonedRef = useRef(false);
  const emailEnteredRef = useRef(false);
  const phoneEnteredRef = useRef(false);
  const travelCompleteRef = useRef(false);
  const contactCompleteRef = useRef(false);
  const lastBucketRef = useRef<ProgressBucket>(0);
  const pathname = usePathname();
  const pathnameAtMountRef = useRef(pathname);
  const stateRef = useRef(
    formKind === "flight"
      ? flightFunnelState(snapshot)
      : callbackFunnelState(snapshot)
  );

  const markSubmitted = () => {
    submittedRef.current = true;
  };

  const state =
    formKind === "flight"
      ? flightFunnelState(snapshot)
      : callbackFunnelState(snapshot);

  stateRef.current = state;

  const fireAbandon = () => {
    const s = stateRef.current;
    const canAbandon =
      startedRef.current &&
      (formKind !== "flight" || s.started);
    if (submittedRef.current || abandonedRef.current || !canAbandon) {
      return;
    }
    abandonedRef.current = true;
    leadTrack("lead_form_abandoned", formKind, {
      had_email: s.hasEmail,
      had_phone: s.hasPhone,
      progress_bucket: s.bucket,
      last_step: s.lastStep,
      time_on_form: timeOnFormBucket(mountAtRef.current ?? 0),
    });
  };

  useEffect(() => {
    if (!state.started || startedRef.current) return;
    startedRef.current = true;
    leadTrack("lead_form_started", formKind);
  }, [state.started, formKind]);

  useEffect(() => {
    if (!state.hasEmail || emailEnteredRef.current) return;
    emailEnteredRef.current = true;
    leadTrack("lead_email_entered", formKind, { had_email: true });
  }, [state.hasEmail, formKind]);

  useEffect(() => {
    if (!state.hasPhone || phoneEnteredRef.current) return;
    phoneEnteredRef.current = true;
    leadTrack("lead_phone_entered", formKind, { had_phone: true });
  }, [state.hasPhone, formKind]);

  useEffect(() => {
    if (formKind !== "flight" || travelCompleteRef.current) return;
    const travelComplete =
      "travelComplete" in state && state.travelComplete === true;
    if (!travelComplete) return;
    travelCompleteRef.current = true;
    leadTrack("lead_travel_details_completed", formKind);
  }, [formKind, state]);

  useEffect(() => {
    if (!state.contactComplete || contactCompleteRef.current) return;
    contactCompleteRef.current = true;
    leadTrack("lead_contact_details_completed", formKind);
  }, [state.contactComplete, formKind]);

  useEffect(() => {
    if (state.bucket === lastBucketRef.current) return;
    if (state.bucket === 0) return;
    lastBucketRef.current = state.bucket;
    leadTrack("lead_form_completion_percent", formKind, {
      progress_bucket: state.bucket,
      last_step: state.lastStep,
    });
  }, [state.bucket, state.lastStep, formKind]);

  useEffect(() => {
    if (pathname === pathnameAtMountRef.current) return;
    fireAbandon();
  }, [pathname]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") fireAbandon();
    };

    window.addEventListener("pagehide", fireAbandon);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", fireAbandon);
      document.removeEventListener("visibilitychange", onVisibility);
      fireAbandon();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable listeners; state via stateRef
  }, [formKind]);

  return { markSubmitted, trackSubmitClicked, trackSubmitSuccess, trackSubmitError };

  function trackSubmitClicked() {
    leadTrack("lead_submit_clicked", formKind, {
      progress_bucket: state.bucket,
      last_step: state.lastStep,
    });
  }

  function trackSubmitSuccess(submitStartedAt: number) {
    markSubmitted();
    leadTrack("lead_submit_success", formKind, {
      latency_bucket: submitLatencyBucket(submitStartedAt),
    });
  }

  function trackSubmitError(
    errorType: SubmitErrorType,
    submitStartedAt: number
  ) {
    leadTrack("lead_submit_error", formKind, {
      error_type: errorType,
      latency_bucket: submitLatencyBucket(submitStartedAt),
      progress_bucket: state.bucket,
      last_step: state.lastStep,
    });
  }
}
