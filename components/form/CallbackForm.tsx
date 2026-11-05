"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/form/PhoneInput";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { geolocateFallback } from "@/lib/geolocate";
import { callbackFormSchema } from "@/lib/validation";
import type { GeolocateResult } from "@/lib/types";
import { clearTrackingParams, getTrackingParams } from "@/lib/url-params";
import { useLeadFormAnalytics } from "@/hooks/useLeadFormAnalytics";

export type CallbackFormProps = {
  className?: string;
};

type Values = z.infer<typeof callbackFormSchema>;

export function CallbackForm({ className }: CallbackFormProps) {
  const router = useRouter();
  const mountAt = useRef(0);
  const dialTouched = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(callbackFormSchema) as Resolver<Values>,
    defaultValues: {
      inquiryKind: "callback",
      name: "",
      email: "",
      phone: "",
      dialCode: "+61",
      pageUrl: site.url,
      website: "",
      formMountedAt: 0,
      gclid: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = form;

  const dialCode = watch("dialCode");
  const nameW = watch("name");
  const emailW = watch("email");
  const phoneW = watch("phone");

  const analytics = useLeadFormAnalytics({
    formKind: "callback",
    mountAtRef: mountAt,
    snapshot: { name: nameW, email: emailW, phone: phoneW },
  });

  useLayoutEffect(() => {
    const t = Date.now();
    mountAt.current = t;
    setValue("formMountedAt", t, { shouldDirty: false, shouldValidate: false });

    // Capture Google Ads tracking params from URL
    const tracking = getTrackingParams();
    setValue("gclid", tracking.gclid, { shouldDirty: false, shouldValidate: false });
    setValue("utmSource", tracking.utmSource, { shouldDirty: false, shouldValidate: false });
    setValue("utmMedium", tracking.utmMedium, { shouldDirty: false, shouldValidate: false });
    setValue("utmCampaign", tracking.utmCampaign, { shouldDirty: false, shouldValidate: false });
    setValue("utmTerm", tracking.utmTerm, { shouldDirty: false, shouldValidate: false });
    setValue("utmContent", tracking.utmContent, { shouldDirty: false, shouldValidate: false });
  }, [setValue]);

  useEffect(() => {
    setValue(
      "pageUrl",
      typeof window !== "undefined" ? window.location.href : site.url
    );
  }, [setValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/geolocate");
        const data = (await res.json()) as GeolocateResult;
        if (cancelled || dialTouched.current) return;
        setValue("dialCode", data.dialCode);
      } catch {
        if (cancelled || dialTouched.current) return;
        setValue("dialCode", geolocateFallback().dialCode);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const onInvalid = () => {
    setFormError("Please check your name, email and phone number.");
    analytics.trackSubmitError("validation", Date.now());
  };

  const onValid = async (data: Values) => {
    setFormError(null);
    analytics.trackSubmitClicked();
    const submitStartedAt = Date.now();

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      const json = (await res.json()) as {
        ok: boolean;
        errors?: Record<string, string>;
        message?: string;
      };

      if (res.ok && json.ok) {
        analytics.trackSubmitSuccess(submitStartedAt);
        clearTrackingParams();
        router.push("/thank-you?kind=callback");
        return;
      }

      if (json.errors && typeof json.errors === "object") {
        const first = Object.values(json.errors)[0];
        setFormError(first ?? "Please check the form and try again.");
        analytics.trackSubmitError("validation_server", submitStartedAt);
        return;
      }

      setFormError(
        json.message ??
          "Something went wrong. Please call us or try again in a moment."
      );
      analytics.trackSubmitError("api_message", submitStartedAt);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      analytics.trackSubmitError("network", submitStartedAt);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onValid, onInvalid)}
      noValidate
    >
      <input type="hidden" {...register("inquiryKind")} />
      <input type="hidden" {...register("pageUrl")} />
      <input
        type="hidden"
        {...register("formMountedAt", { valueAsNumber: true })}
      />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
        {...register("website")}
      />
      {/* Google Ads tracking fields */}
      <input type="hidden" {...register("gclid")} />
      <input type="hidden" {...register("utmSource")} />
      <input type="hidden" {...register("utmMedium")} />
      <input type="hidden" {...register("utmCampaign")} />
      <input type="hidden" {...register("utmTerm")} />
      <input type="hidden" {...register("utmContent")} />

      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Leave your details and we will call you back {site.callbackWindow}.
        </p>

        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            onBlur: () => {
              void trigger("email");
            },
          })}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <PhoneInput
              dialCode={dialCode}
              onDialCodeChange={(d) => {
                dialTouched.current = true;
                setValue("dialCode", d, { shouldValidate: true });
              }}
              phone={field.value}
              onPhoneChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <input type="hidden" {...register("dialCode")} />
        {Object.entries(errors).map(([field, error]) => <p key={field} className="bcg-field-error">{String(error.message ?? "Please check this field.")}</p>)}

        {formError ? (
          <p role="alert" className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={submitting}
        >
          Request a callback
        </Button>
      </div>
    </form>
  );
}
