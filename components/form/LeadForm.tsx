"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Controller, useForm, useWatch, type FieldPath, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { ArrowRight, ArrowRightLeft, ArrowLeft, Loader2 } from "lucide-react";
import type { z } from "zod";
import { leadFormSchema } from "@/lib/validation";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { formatAirportLabel, getAirportByIata } from "@/lib/airports";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { DatePickerField } from "./DatePicker";
import { PhoneInput } from "./PhoneInput";
import { Input } from "@/components/ui/Input";
import { clearTrackingParams, getTrackingParams } from "@/lib/url-params";
import { useLeadFormAnalytics } from "@/hooks/useLeadFormAnalytics";
import { trackLeadSubmit } from "@/lib/gtm";
import type { GeolocateResult } from "@/lib/types";

export type LeadFormProps={className?:string;initialDestination?:{iata:string;label:string}};
type Values=z.infer<typeof leadFormSchema>;
const journeyFields:FieldPath<Values>[]=["tripType","travelers","cabinClass","departureIata","departureLabel","destinationIata","destinationLabel","departDate","returnDate"];

export function LeadForm({className,initialDestination}:LeadFormProps){
 const router=useRouter();
 const formId=useId();
 const mountAt=useRef(0);
 const departureTouched=useRef(false),dialTouched=useRef(false);
 const destinationInput=useRef<HTMLInputElement>(null);
 const departureInput=useRef<HTMLInputElement>(null);
 const nameInput=useRef<HTMLInputElement>(null);
 const errorSummary=useRef<HTMLParagraphElement>(null);
 const [step,setStep]=useState<1|2>(1);
 const [submitting,setSubmitting]=useState(false);
 const [formError,setFormError]=useState<string|null>(null);
 const [engaged,setEngaged]=useState(false);
 const form=useForm<Values>({resolver:zodResolver(leadFormSchema) as Resolver<Values>,defaultValues:{inquiryKind:"flight",tripType:"round-trip",cabinClass:"business",travelers:1,departureIata:"",departureLabel:"",destinationIata:initialDestination?.iata??"",destinationLabel:initialDestination?.label??"",departDate:"",returnDate:"",name:"",email:"",phone:"",dialCode:"+61",pageUrl:site.url,website:"",formMountedAt:0,gclid:"",utmSource:"",utmMedium:"",utmCampaign:"",utmTerm:"",utmContent:""}});
 const {register,control,setValue,getValues,trigger,handleSubmit,setError,formState:{errors}}=form;
 const values=useWatch({control});
 const tripType=values.tripType??"round-trip";
 const round=tripType==="round-trip";
 const analytics=useLeadFormAnalytics({formKind:"flight",mountAtRef:mountAt,snapshot:{...values,userEngaged:engaged}});
 const touch=()=>{setEngaged(true);setFormError(null);};
 useEffect(()=>{
  mountAt.current=Date.now();setValue("formMountedAt",mountAt.current);
  setValue("pageUrl",window.location.href);
  const tracking=getTrackingParams();
  for(const key of Object.keys(tracking) as (keyof typeof tracking)[])setValue(key,tracking[key]);
 },[setValue]);
 useEffect(()=>{
  const controller=new AbortController();
  void (async()=>{try{
   const response=await fetch("/api/geolocate",{signal:controller.signal});
   if(!response.ok)return;
   const geo=await response.json() as GeolocateResult;
   if(controller.signal.aborted)return;
   const airport=getAirportByIata(geo.airport?.iata??"");
   if(airport&&!departureTouched.current&&!getValues("departureIata")){
    setValue("departureIata",airport.iata);setValue("departureLabel",formatAirportLabel(airport));
   }
   if(!dialTouched.current&&typeof geo.dialCode==="string")setValue("dialCode",geo.dialCode);
  }catch{/* Location is optional; leave the visitor's entries unchanged. */}})();
  return ()=>controller.abort();
 },[getValues,setValue]);
 useEffect(()=>{if(!round)setValue("returnDate","",{shouldValidate:false});},[round,setValue]);
 useEffect(()=>{if(formError)errorSummary.current?.focus();},[formError]);
 const earliestReturn=values.departDate?parseISO(values.departDate):new Date();
 const fieldError=(field:FieldPath<Values>)=>errors[field]?.message;
 const showError=(field:FieldPath<Values>)=>fieldError(field)?<p className="bcg-field-error">{String(fieldError(field))}</p>:null;
 async function next(){
  setFormError(null);touch();
  const valid=await trigger(journeyFields);
  if(valid){setStep(2);requestAnimationFrame(()=>nameInput.current?.focus());}
  else {setFormError("Please check the highlighted journey details.");analytics.trackSubmitError("validation",Date.now());}
 }
 async function submit(data:Values){
  if(submitting)return;
  setSubmitting(true);setFormError(null);analytics.trackSubmitClicked();
  const started=Date.now();
  try{
   const response=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),signal:AbortSignal.timeout(25000)});
   const json=await response.json() as {ok?:boolean;message?:string;errors?:Record<string,string>};
   if(response.ok&&json.ok){
    analytics.trackSubmitSuccess(started);trackLeadSubmit({formName:"lead_form",tripType:data.tripType,cabinClass:data.cabinClass,travelers:data.travelers,departureIata:data.departureIata,destinationIata:data.destinationIata});clearTrackingParams();
    router.push(`/thank-you?dep=${encodeURIComponent(data.departureIata)}&dest=${encodeURIComponent(data.destinationIata)}`);return;
   }
   if(json.errors){for(const [field,message]of Object.entries(json.errors)){if(field in data)setError(field as FieldPath<Values>,{message});}if(Object.keys(json.errors).some(key=>journeyFields.includes(key as FieldPath<Values>)))setStep(1);}
   setFormError(json.message??Object.values(json.errors??{})[0]??"We couldn’t send your request. Please try again or contact us directly.");
   analytics.trackSubmitError("api_message",started);
  }catch{setFormError("We couldn’t confirm your request. Please check your connection and try again, or call us directly.");analytics.trackSubmitError("network",started);}
  finally{setSubmitting(false);}
 }
 const {ref:nameRegisterRef,...nameRegister}=register("name",{onChange:touch});
 return <form className={cn("bcg-quote-card",className)} noValidate onSubmit={event=>{if(step===1){event.preventDefault();void next();}else void handleSubmit(submit,()=>{setFormError("Please check the highlighted contact details.");})(event);}}>
  <input type="hidden" {...register("inquiryKind")}/><input type="hidden" {...register("pageUrl")}/><input type="hidden" {...register("formMountedAt",{valueAsNumber:true})}/><input type="text" className="bcg-honeypot" tabIndex={-1} autoComplete="off" aria-hidden {...register("website")}/>
  <div className="bcg-quote-heading"><div><p className="bcg-eyebrow">LET’S PLAN YOUR NEXT JOURNEY</p><h2>{step===1?"Find your business class flight":"Let’s make it your journey"}</h2></div><span>Personal service.<br/>A journey built around you.</span></div>
  <div hidden={step!==1}>
   <div className="bcg-form-top"><fieldset className="bcg-trip-types"><legend className="sr-only">Trip type</legend>{[{value:"round-trip",label:"Round trip"},{value:"one-way",label:"One way"}].map(trip=><label key={trip.value}><input type="radio" value={trip.value} {...register("tripType",{onChange:touch})}/><span>{trip.label}</span></label>)}</fieldset><div className="bcg-small-selects"><label><span className="sr-only">Travellers</span><select {...register("travelers",{valueAsNumber:true,onChange:touch})}>{Array.from({length:9},(_,i)=><option key={i+1} value={i+1}>{i+1} {i===0?"traveller":"travellers"}</option>)}</select></label><label><span className="sr-only">Cabin class</span><select {...register("cabinClass",{onChange:touch})}><option value="business">Business class</option><option value="first">First class</option><option value="premium-economy">Premium economy</option></select></label></div></div>
   <div className="bcg-journey-grid"><div className="bcg-route-pair"><div className="bcg-flight-field"><span className="bcg-field-caption">FLYING FROM</span><AirportAutocomplete id={`${formId}-departure-airport`} infield embedded label="Departure airport" placeholder="City or airport" inputRef={departureInput} value={{iata:values.departureIata??"",label:values.departureLabel??""}} onChange={v=>{departureTouched.current=true;touch();setValue("departureIata",v.iata,{shouldValidate:true});setValue("departureLabel",v.label,{shouldValidate:true});}} onCommittedSelection={()=>destinationInput.current?.focus()} error={String(fieldError("departureIata")??fieldError("departureLabel")??"")}/>{showError("departureIata")??showError("departureLabel")}</div><button className="bcg-swap" type="button" aria-label="Swap departure and destination" onClick={()=>{const from={iata:getValues("departureIata"),label:getValues("departureLabel")};setValue("departureIata",getValues("destinationIata"));setValue("departureLabel",getValues("destinationLabel"));setValue("destinationIata",from.iata);setValue("destinationLabel",from.label);departureTouched.current=true;touch();}}><ArrowRightLeft size={16}/></button><div className="bcg-flight-field"><span className="bcg-field-caption">FLYING TO</span><AirportAutocomplete id={`${formId}-destination-airport`} infield embedded label="Destination airport" placeholder="Where to next?" inputRef={destinationInput} value={{iata:values.destinationIata??"",label:values.destinationLabel??""}} onChange={v=>{touch();setValue("destinationIata",v.iata,{shouldValidate:true});setValue("destinationLabel",v.label,{shouldValidate:true});}} error={String(fieldError("destinationIata")??fieldError("destinationLabel")??"")}/>{showError("destinationIata")??showError("destinationLabel")}</div></div><div className={cn("bcg-date-pair",!round&&"bcg-one-way")}><div className="bcg-flight-field"><span className="bcg-field-caption">DEPARTURE</span><Controller control={control} name="departDate" render={({field,fieldState})=><DatePickerField id={`${formId}-departure-date`} infield embedded label="Departure date" emptyHint="Choose date" value={field.value} onChange={v=>{touch();setValue("departDate",v,{shouldValidate:true});if(getValues("returnDate")&&getValues("returnDate")<v)setValue("returnDate","");}} autoOpenOnFocus={false} error={fieldState.error?.message}/>}/>{showError("departDate")}</div><div className="bcg-flight-field" hidden={!round}><span className="bcg-field-caption">RETURN</span><Controller control={control} name="returnDate" render={({field,fieldState})=><DatePickerField id={`${formId}-return-date`} infield embedded label="Return date" emptyHint="Choose date" value={field.value} onChange={v=>{touch();setValue("returnDate",v,{shouldValidate:true});}} minDate={earliestReturn} contextDate={earliestReturn} disabled={!round} autoOpenOnFocus={false} error={fieldState.error?.message}/>}/>{showError("returnDate")}</div></div><button className="bcg-button bcg-continue" type="submit">Find my flights <ArrowRight size={18}/></button></div>
  </div>
  <div className="bcg-contact-step" hidden={step!==2}><div className="bcg-contact-step-top"><p>{values.departureIata} <span aria-hidden>→</span> {values.destinationIata}<span className="bcg-trip-summary"> · {values.departDate}{round?` / ${values.returnDate}`:" · One way"}</span></p><button type="button" className="bcg-text-button" onClick={()=>{setStep(1);setFormError(null);requestAnimationFrame(()=>departureInput.current?.focus());}}><ArrowLeft size={13}/> Edit trip</button></div><div className="bcg-contact-grid"><div className="bcg-contact-field"><Input id={`${formId}-full-name`} label="Full name" placeholder="Your full name" autoComplete="name" {...nameRegister} ref={el=>{nameInput.current=el;nameRegisterRef(el);}} error={errors.name?.message}/>{showError("name")}</div><div className="bcg-contact-field"><Input id={`${formId}-email-address`} label="Email address" type="email" placeholder="you@example.com" autoComplete="email" {...register("email",{onChange:touch})} error={errors.email?.message}/>{showError("email")}</div><div className="bcg-contact-field"><Controller control={control} name="phone" render={({field,fieldState})=><PhoneInput id={`${formId}-flight-phone`} dialCode={values.dialCode??"+61"} onDialCodeChange={value=>{dialTouched.current=true;touch();setValue("dialCode",value);}} phone={field.value} onPhoneChange={value=>{touch();field.onChange(value);}} error={fieldState.error?.message}/>}/>{showError("phone")}</div><button className="bcg-button bcg-send" type="submit" disabled={submitting}>{submitting?<><Loader2 className="animate-spin" size={18}/> Sending…</>:<>Request my quote <ArrowRight size={18}/></>}</button></div></div>
  {formError?<p ref={errorSummary} tabIndex={-1} className="bcg-form-error" role="alert">{formError} <a href={`tel:${site.phones.au.e164}`}>Call {site.phones.au.label}</a></p>:null}
  <div className="bcg-form-bottom"><span>{step===1?"✓ Tailored options, without the endless searching":<>We’ll use your details to respond to your request. <a href="/privacy">Privacy policy</a></>}</span><span>STEP 0{step} OF 02</span></div>
 </form>;
}
