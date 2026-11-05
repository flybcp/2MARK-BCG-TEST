/** The browser receives success only after an explicitly configured CRM acknowledges capture. */
import { after, NextResponse } from "next/server";
import { createContact } from "@/lib/hubspot";
import { sendLeadToCrm } from "@/lib/crm";
import { sendCallbackFollowUpEmail, sendFollowUpEmail, sendExistingContactLeadNotification, sendFailedHubspotLeadNotification } from "@/lib/email";
import { readIpGeoFromHeaders } from "@/lib/geolocate";
import { allowLeadSubmit, getClientIp } from "@/lib/lead-rate-limit";
import { logLeadEvent } from "@/lib/lead-log";
import { flattenFieldErrors, leadApiBodySchema } from "@/lib/validation";
export const runtime="nodejs";
const MAX_BYTES=64*1024;
async function readBody(request:Request):Promise<unknown>{
 const reader=request.body?.getReader();if(!reader)throw new Error("invalid");
 const parts:Uint8Array[]=[];let bytes=0;
 for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>MAX_BYTES){await reader.cancel();throw new Error("too_large");}parts.push(value);}
 const body=new Uint8Array(bytes);let offset=0;for(const part of parts){body.set(part,offset);offset+=part.byteLength;}
 return JSON.parse(new TextDecoder().decode(body));
}
export async function POST(request:Request):Promise<NextResponse>{
 const requestId=crypto.randomUUID();const ip=getClientIp(request);
 const reply=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
 if(!allowLeadSubmit(ip))return reply({ok:false,message:"Too many requests. Please try again in a minute."},429);
 let body:unknown;
 try{body=await readBody(request);}catch(error){return reply({ok:false,message:error instanceof Error&&error.message==="too_large"?"Request is too large.":"Please check your request and try again."},error instanceof Error&&error.message==="too_large"?413:400);}
 const parsed=leadApiBodySchema.safeParse(body);
 if(!parsed.success){logLeadEvent("validation_failed",{requestId});return reply({ok:false,errors:flattenFieldErrors(parsed.error)},400);}
 const data=parsed.data;
 if(data.website.trim()){logLeadEvent("antispam",{requestId,trigger:"honeypot"});return reply({ok:false,message:"We couldn’t validate this request. Please contact us directly."},400);}
 // Do not discard fast autofill based on a client-controlled timestamp.
 const hubspotConfigured=Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());
 const crmConfigured=Boolean(process.env.BCG_CRM_URL?.trim()&&process.env.BCG_INTAKE_SECRET?.trim());
 if(!hubspotConfigured&&!crmConfigured)return reply({ok:false,message:"Online enquiries are temporarily unavailable. Please call or email us directly."},503);
 const geo=readIpGeoFromHeaders(request);
 const [hubspot,crm]=await Promise.allSettled([hubspotConfigured?createContact(data,geo):Promise.resolve(null),crmConfigured?sendLeadToCrm(data,geo):Promise.resolve(null)]);
 const hubResult=hubspot.status==="fulfilled"?hubspot.value:null;
 const crmResult=crm.status==="fulfilled"?crm.value:null;
 const accepted=Boolean(hubResult?.ok||crmResult?.ok);
 if(!accepted){
  logLeadEvent("hubspot_error",{requestId,status:hubResult&&!hubResult.ok?hubResult.status:0});
  after(async()=>{try{await sendFailedHubspotLeadNotification(data,"No configured CRM confirmed capture. Request reference: "+requestId);}catch{/* The visitor has already received a retryable failure. */}});
  return reply({ok:false,message:"We couldn’t confirm your enquiry. Please try again or contact us directly."},503);
 }
 logLeadEvent("success",{requestId,inquiryKind:data.inquiryKind});
 after(async()=>{
  // Email is secondary to acknowledged lead capture and cannot change its result.
  try{if(data.inquiryKind==="flight")await sendFollowUpEmail(data);else await sendCallbackFollowUpEmail(data);}catch{logLeadEvent("crm_error",{requestId});}
  if(hubResult?.ok&&hubResult.action==="updated"){try{await sendExistingContactLeadNotification(data);}catch{logLeadEvent("crm_error",{requestId});}}
  if(hubspotConfigured&&!hubResult?.ok){try{await sendFailedHubspotLeadNotification(data,"The secondary CRM accepted the enquiry; HubSpot did not. Reference: "+requestId);}catch{logLeadEvent("crm_error",{requestId});}}
 });
 return reply({ok:true,requestId});
}
