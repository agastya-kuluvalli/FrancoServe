import{useEffect,useRef}from'react'
import L from'leaflet'
import'leaflet.markercluster'
import type{Opp}from'./data'
const esc=(s:string)=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!))
type P={items:Opp[];selected?:string;onSelect:(id:string)=>void;center:{lat:number;lng:number}|null;zoomKey?:string}
export default function MapView({items,selected,onSelect,center}:P){
const el=useRef<HTMLDivElement>(null),map=useRef<L.Map>(),cl=useRef<L.MarkerClusterGroup>(),mk=useRef(new Map<string,L.Marker>()),you=useRef<L.CircleMarker>()
useEffect(()=>{const m=L.map(el.current!).setView([37.74,-121.9],10)
L.tileLayer(import.meta.env.VITE_TILE_URL||'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(m)
cl.current=L.markerClusterGroup();m.addLayer(cl.current);map.current=m;return()=>{m.remove()}},[])
useEffect(()=>{const g=cl.current!;g.clearLayers();mk.current.clear()
items.forEach(o=>{if(o.lat==null||o.lng==null)return
const m=L.marker([o.lat,o.lng],{title:o.title,icon:L.divIcon({className:'',html:`<div class="pin ${o.featured?'feat':''} ${o.id===selected?'sel':''}"></div>`,iconSize:[18,18]})})
m.bindPopup(`<strong>${esc(o.title)}</strong><br>${esc(o.org)}<br>${esc(o.category)} · ${esc(o.city)}<br><a href="/opportunities/${o.id}" style="color:#00539B">View details</a>`)
m.on('click',()=>onSelect(o.id));g.addLayer(m);mk.current.set(o.id,m)})
const b=g.getBounds();if(!center&&b.isValid())map.current!.fitBounds(b,{padding:[40,40],maxZoom:13})},[items,selected])
useEffect(()=>{const m=map.current!;you.current?.remove();if(center){m.setView([center.lat,center.lng],11);you.current=L.circleMarker([center.lat,center.lng],{radius:7,color:'#fff',weight:2,fillColor:'#14233B',fillOpacity:1}).addTo(m).bindTooltip('Search center')}},[center])
useEffect(()=>{const m=selected&&mk.current.get(selected);if(m)cl.current!.zoomToShowLayer(m,()=>m.openPopup())},[selected])
return<div ref={el} role="region" aria-label="Map of volunteer opportunities" className="h-full min-h-[320px] w-full"/>}
