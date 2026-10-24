import{useMemo,useState}from'react'
import{Link,useSearchParams}from'react-router-dom'
import{CATS,miles,useOpps,type Opp}from'./data'
import MapView from'./MapView'
type Ref={lat:number;lng:number;label:string}
let session:Ref|null=null // in-memory only: precise location is never persisted
const inp='rounded border border-slate/40 bg-white px-3 py-2 text-sm'
function Card({o,dist,active,onPick}:{o:Opp;dist?:number;active:boolean;onPick?:()=>void}){return(
<article onClick={onPick} className={`border bg-white p-4 ${active?'border-blue ring-1 ring-blue':'border-navy/10'} ${onPick?'cursor-pointer':''}`}>
<p className="text-xs text-slate">{o.category}{o.remote?' · Remote':` · ${o.city}`}{dist!=null&&` · ${dist.toFixed(1)} mi`}</p>
<h3 className="mt-1 font-serif text-lg leading-snug">{o.title}</h3><p className="text-sm text-slate">{o.org}</p>
<p className="mt-2 line-clamp-2 text-sm">{o.desc}</p>
<p className="mt-2 text-xs text-slate">{o.date?new Date(o.date+'T12:00').toLocaleDateString(undefined,{dateStyle:'medium'}):'Flexible schedule'}{o.duration&&` · ${o.duration}`}</p>
<Link to={`/opportunities/${o.id}`} className="mt-3 inline-block text-sm font-medium text-blue underline">View details</Link></article>)}
export default function Explore({view}:{view:'list'|'map'}){
const{data,error}=useOpps(),[sp,setSp]=useSearchParams(),[ref,setRef]=useState<Ref|null>(session),[sel,setSel]=useState<string>(),[msg,setMsg]=useState(''),[tab,setTab]=useState<'list'|'map'>('list'),[place,setPlace]=useState('')
const q=sp.get('q')??'',cat=sp.get('cat')??'',fmt=sp.get('fmt')??'',r=+(sp.get('r')||25)
const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n,{replace:true})}
const useRef_=(x:Ref|null)=>{session=x;setRef(x)}
const rows=useMemo(()=>(data??[]).filter(o=>(!q||(o.title+o.org+o.desc+o.city).toLowerCase().includes(q.toLowerCase()))&&(!cat||o.category===cat)&&(!fmt||(fmt==='remote')===o.remote))
.map(o=>({o,dist:ref&&o.lat!=null&&o.lng!=null?miles(ref,{lat:o.lat,lng:o.lng}):undefined}))
.filter(x=>!ref||(x.dist!=null?x.dist<=r:x.o.remote)).sort((a,b)=>ref?(a.dist??1e9)-(b.dist??1e9):(a.o.date??'9').localeCompare(b.o.date??'9')),[data,q,cat,fmt,ref,r])
const locate=()=>{setMsg('');navigator.geolocation?.getCurrentPosition(p=>useRef_({lat:p.coords.latitude,lng:p.coords.longitude,label:'your location'}),()=>setMsg('Location access was denied. Search a city, ZIP code, or address instead.'),{timeout:10000})}
const search=async(e:React.FormEvent)=>{e.preventDefault();if(!place.trim())return;setMsg('Searching…')
try{const j=await(await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q='+encodeURIComponent(place))).json()
if(!j.length)return setMsg('No match found. Try a more specific city, ZIP code, or address.')
useRef_({lat:+j[0].lat,lng:+j[0].lon,label:j[0].display_name});setMsg('')}catch{setMsg('Location search is unavailable right now. Try again shortly.')}}
const mapped=rows.map(x=>x.o)
const filters=<div className="space-y-3 border-b border-navy/10 bg-white p-4">
<div className="flex flex-wrap gap-2"><input aria-label="Search opportunities" className={inp+' flex-1 min-w-[160px]'} placeholder="Search opportunities" value={q} onChange={e=>set('q',e.target.value)}/>
<select aria-label="Category" className={inp} value={cat} onChange={e=>set('cat',e.target.value)}><option value="">All categories</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>
<select aria-label="Format" className={inp} value={fmt} onChange={e=>set('fmt',e.target.value)}><option value="">In person or remote</option><option value="in">In person</option><option value="remote">Remote</option></select></div>
<form onSubmit={search} className="flex flex-wrap gap-2"><input aria-label="City, ZIP, or address" className={inp+' flex-1 min-w-[160px]'} placeholder="City, ZIP, or address" value={place} onChange={e=>setPlace(e.target.value)}/>
<button className="rounded bg-navy px-3 py-2 text-sm text-white">Search area</button>
<button type="button" onClick={locate} className="rounded border border-navy px-3 py-2 text-sm">Use my location</button></form>
<p className="text-xs text-slate">“Use my location” asks your browser for permission and is used only for this session.</p>
{ref&&<div className="flex flex-wrap items-center gap-2 text-sm"><span className="truncate max-w-xs">Near {ref.label}</span>
<select aria-label="Radius" className={inp} value={r} onChange={e=>set('r',e.target.value)}>{[5,10,25,50].map(n=><option key={n} value={n}>{n} miles</option>)}</select>
<button onClick={()=>useRef_(null)} className="underline text-blue">Clear location</button></div>}
{msg&&<p role="status" className="text-sm text-blue">{msg}</p>}</div>
const list=error?<p className="p-4 text-sm">Couldn’t load opportunities. Refresh to try again.</p>:!data?<p className="p-4 text-sm text-slate">Loading opportunities…</p>:rows.length===0?
<div className="p-6 text-sm"><p className="font-medium">No opportunities match.</p><p className="text-slate">{ref?'Try a larger radius or ':'Try clearing filters or '}<button className="underline text-blue" onClick={()=>{useRef_(null);setSp({})}}>browse everything</button>.</p></div>:null
const cards=rows.map(({o,dist})=><Card key={o.id} o={o} dist={dist} active={o.id===sel} onPick={view==='map'?()=>setSel(o.id):undefined}/>)
const qs=sp.toString()?'?'+sp.toString():''
if(view==='list')return<main className="mx-auto max-w-6xl px-4 py-10"><div className="flex items-end justify-between"><h1 className="font-serif text-4xl">Explore opportunities</h1><Link className="text-sm font-medium text-blue underline" to={'/map'+qs}>Switch to map</Link></div>
<div className="mt-6">{filters}</div>{list}<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{cards}</div></main>
return<main className="flex h-[calc(100vh-64px)] flex-col">{filters}
<div className="flex border-b lg:hidden" role="tablist">{(['list','map'] as const).map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} className={`flex-1 py-2 text-sm ${tab===t?'border-b-2 border-blue font-medium':''}`}>{t==='list'?`List (${rows.length})`:'Map'}</button>)}</div>
<div className="grid min-h-0 flex-1 lg:grid-cols-[420px_1fr]"><div className={`${tab==='list'?'block':'hidden'} space-y-3 overflow-y-auto bg-ivory p-3 lg:block`}>{list}{cards}</div>
<div className={`${tab==='map'?'block':'hidden'} lg:block`}><MapView items={mapped} selected={sel} onSelect={id=>{setSel(id);document.getElementById('c'+id)?.scrollIntoView()}} center={ref}/></div></div></main>}
