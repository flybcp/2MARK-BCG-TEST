"use client";
import { LeadForm, type LeadFormProps } from "./LeadForm";
export type QuoteFormProps=LeadFormProps;
export function QuoteForm(props:QuoteFormProps){return <LeadForm {...props}/>;}
