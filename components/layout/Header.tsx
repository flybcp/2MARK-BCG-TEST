"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./Brand";
import { site } from "@/content/site";

const links = [{label:"Destinations",href:"/#destinations"},{label:"How it works",href:"/#how-it-works"},{label:"About",href:"/about"}];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if(event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); }
    };
    const mq=window.matchMedia("(min-width: 900px)");
    const reset=()=>{if(mq.matches)setOpen(false);};
    window.addEventListener("keydown",key);mq.addEventListener("change",reset);
    return ()=>{window.removeEventListener("keydown",key);mq.removeEventListener("change",reset);};
  },[open]);
  return <header className="bcg-header"><div className="bcg-container bcg-nav"><Brand/><nav className="bcg-desktop-nav" aria-label="Main navigation">{links.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav><div className="bcg-nav-actions"><a className="bcg-contact-button" href={`tel:${site.phones.au.e164}`}><Phone size={14} aria-hidden/><span>{site.phones.au.label}</span></a><button ref={toggle} type="button" className="bcg-menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close navigation":"Open navigation"}>{open?<X size={23}/>:<Menu size={23}/>}</button></div></div><nav id="mobile-navigation" className="bcg-mobile-nav" aria-label="Mobile navigation" hidden={!open}>{[...links,{label:"Request a quote",href:"/get-a-quote"},{label:"Contact us",href:"/contact"}].map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}</nav></header>;
}
