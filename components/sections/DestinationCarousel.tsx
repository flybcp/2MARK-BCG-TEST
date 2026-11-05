"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DestinationCard, type DestinationCardProps } from "./DestinationCard";
export function DestinationCarousel({destinations}:{destinations:DestinationCardProps[]}){
 const track=useRef<HTMLDivElement>(null);
 function move(direction:number){const el=track.current;if(!el)return;el.scrollBy({left:direction*el.clientWidth,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
 return <div className="bcg-destination-carousel"><div className="bcg-destination-track" ref={track} id="destination-track" tabIndex={0} aria-label="Destinations. Scroll to explore more cities.">{destinations.map(d=><DestinationCard key={d.href} {...d}/>)}</div><div className="bcg-carousel-controls"><span>Find somewhere extraordinary.</span><div><button type="button" onClick={()=>move(-1)} aria-label="Previous destinations" aria-controls="destination-track"><ChevronLeft size={18}/></button><button type="button" onClick={()=>move(1)} aria-label="Next destinations" aria-controls="destination-track"><ChevronRight size={18}/></button></div></div></div>;
}
