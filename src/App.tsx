import{BrowserRouter,Link,NavLink,Route,Routes,useParams}from'react-router-dom'
import{useOpps}from'./data'
import Explore from'./Explore'
import MapView from'./MapView'
import Admin from'./Admin'
const L_=({to,children,bar}:{to:string;children:string;bar:string})=><NavLink to={to} end className="font-semibold text-navy">{({isActive}:{isActive:boolean})=><><span className="block">{children}</span><span className={`mt-1 block ${isActive?'h-1.5':'h-1'} ${bar}`}/></>}</NavLink>
function Home(){const{data,error}=useOpps(),feat=(data??[]).filter(o=>o.featured),d=(n:number)=>({animationDelay:`${n}ms`})
return<main>
<section className="hero relative overflow-hidden text-ivory"><div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
<div><p className="rise text-xs font-semibold uppercase tracking-[.3em] text-rougeL" style={d(0)}>Bénévolat · Tri-Valley, California</p>
<h1 className="rise mt-5 font-serif text-6xl font-extrabold leading-[1.02] md:text-8xl" style={d(120)}>Make your French <em className="text-rougeL">matter.</em></h1>
<p className="rise mt-7 max-w-md text-lg text-ivory" style={d(260)}>Discover meaningful volunteer opportunities, connect with your community, and turn your French skills into real-world impact.</p>
<div className="rise mt-9 flex flex-wrap gap-3" style={d(400)}><Link to="/opportunities" className="bg-rouge px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-navy">Explore Opportunities</Link><Link to="/map" className="border border-ivory/60 px-6 py-3 transition-colors hover:bg-ivory hover:text-navy">Open the map</Link></div></div>
<div className="rise relative isolate h-80 border-2 border-ivory shadow-[10px_10px_0_#E1000F] lg:h-[26rem]" style={d(300)}>
<div className="absolute left-3 top-3 z-[1000] flex items-center gap-2 bg-ivory px-2 py-1.5 text-xs font-semibold text-navy"><span className="flex h-3.5 w-6 border border-navy/30"><i className="flex-1 bg-blue"/><i className="flex-1 bg-white"/><i className="flex-1 bg-rouge"/></span>Tri-Valley, CA</div>
{data?<MapView items={data} onSelect={()=>{}} center={null}/>:<div className="flex h-full flex-col items-center justify-center gap-4 bg-ivory p-6 text-center text-navy"><span className="flex h-16 w-24 border border-navy/30"><i className="flex-1 bg-blue"/><i className="flex-1 bg-white"/><i className="flex-1 bg-rouge"/></span><p className="font-serif text-2xl font-bold">{error?'Map unavailable':'Loading map…'}</p>{error&&<p className="text-sm">Couldn’t load opportunities. Refresh to try again.</p>}</div>}</div></div><div className="tricolor"/></section>
<section className="mx-auto max-w-6xl px-4 py-16"><p className="text-xs uppercase tracking-[.3em] text-rouge">À la une</p><h2 className="font-serif text-4xl">Featured opportunities</h2>
<div className="mt-8 grid gap-6 md:grid-cols-3">{feat.map((o,i)=><Link key={o.id} to={`/opportunities/${o.id}`} style={d(i*120)} className="rise border-l-4 border-blue bg-white p-5 transition-colors hover:border-rouge"><p className="text-xs text-slate">{o.category} · {o.city}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{o.title}</h3></Link>)}</div></section>
<section className="bg-white py-16"><div className="mx-auto max-w-6xl px-4"><p className="text-xs uppercase tracking-[.3em] text-rouge">Comment ça marche</p><h2 className="font-serif text-4xl">How it works</h2><ol className="mt-8 grid gap-8 md:grid-cols-3">
{[['Discover','Search the directory or browse the map near you.'],['Volunteer','Pick an opportunity and follow its signup instructions.'],['Track your impact','Log completed service hours (coming soon).']].map(([t,x],i)=><li key={t}><span aria-hidden className="font-serif text-7xl font-extrabold text-blue">0{i+1}</span><h3 className="font-serif text-2xl">{t}</h3><p className="mt-1 text-slate">{x}</p></li>)}</ol></div></section></main>}
function Detail(){const{id}=useParams(),{data}=useOpps(),o=data?.find(x=>x.id===id)
if(!data)return<p className="p-8">Loading…</p>
if(!o)return<main className="p-8"><h1 className="font-serif text-3xl">Opportunity not found</h1><Link className="text-blue underline" to="/opportunities">Back to directory</Link></main>
return<main className="mx-auto max-w-3xl px-4 py-12"><Link to="/opportunities" className="text-sm text-blue underline">All opportunities</Link>
<p className="mt-6 text-sm text-slate">{o.category}</p><h1 className="font-serif text-4xl">{o.title}</h1><p className="text-slate">{o.org}</p>
<p className="mt-6">{o.desc}</p><dl className="mt-6 grid grid-cols-[120px_1fr] gap-2 text-sm"><dt className="text-slate">Where</dt><dd>{o.remote?'Remote':`${o.address}, ${o.city}, CA`}</dd><dt className="text-slate">When</dt><dd>{o.date??'Flexible'}</dd><dt className="text-slate">Commitment</dt><dd>{o.duration}</dd><dt className="text-slate">Requirements</dt><dd>{o.requirements}</dd></dl>
{o.lat!=null&&<div className="mt-6 h-64 border border-navy/10"><MapView items={[o]} onSelect={()=>{}} center={null}/></div>}</main>}
export default function App(){return<BrowserRouter><header className="sticky top-0 z-[1000] flex h-16 items-center justify-between border-b border-navy/10 bg-ivory px-4"><Link to="/" className="font-serif text-3xl font-extrabold tracking-tight text-navy">Franco<span className="text-rouge">Serve</span></Link>
<nav className="flex gap-4 text-sm"><L_ to="/" bar="bg-blue">Home</L_><L_ to="/opportunities" bar="bg-white ring-1 ring-navy/60">Explore</L_><L_ to="/map" bar="bg-rouge">Map</L_></nav></header>
<Routes><Route path="/" element={<Home/>}/><Route path="/opportunities" element={<Explore view="list"/>}/><Route path="/opportunities/:id" element={<Detail/>}/><Route path="/admin" element={<Admin/>}/><Route path="/map" element={<Explore view="map"/>}/></Routes>
<footer className="bg-navy px-4 py-10 text-sm text-ivory/70"><div className="tricolor mb-8 -mx-4"/>FrancoServe · Map data © OpenStreetMap contributors.</footer></BrowserRouter>}
