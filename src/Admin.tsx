import{useEffect,useState}from'react'
import{onAuthStateChanged,signInWithEmailAndPassword,signOut,type User}from'firebase/auth'
import{addDoc,collection,doc,getDoc,getDocs,serverTimestamp,updateDoc}from'firebase/firestore'
import{auth,db}from'./firebase'
import MapView from'./MapView'
import{CATS,type Opp}from'./data'
type Row=Opp&{status:string};type Cand={label:string;lat:number;lng:number}
const empty:any={title:'',org:'',category:CATS[0],desc:'',remote:false,city:'',address:'',lat:null,lng:null,date:'',duration:'',requirements:'',featured:false,status:'draft'}
const inp='w-full rounded border border-slate/40 bg-white px-3 py-2 text-sm'
const Lbl=({t,children}:{t:string;children:any})=><label className="block text-sm"><span className="mb-1 block text-slate">{t}</span>{children}</label>
const check=(o:any)=>o.title.trim().length<3?'Title needs at least 3 characters.':o.org.trim().length<2?'Add an organization.':o.desc.trim().length<10?'Description needs at least 10 characters.':o.city.trim().length<2?'Add a city.':!o.remote&&(o.lat==null||!o.address.trim())?'In-person opportunities need an address and a verified map location. Use Find location.':''
const payload=(o:any,extra:any={})=>({title:o.title.trim(),org:o.org.trim(),category:o.category,desc:o.desc.trim(),remote:o.remote,city:o.city.trim(),address:o.remote?null:o.address.trim(),lat:o.remote?null:o.lat,lng:o.remote?null:o.lng,date:o.date||null,duration:o.duration||null,requirements:o.requirements||'',featured:o.featured,status:o.status,demo:false,updatedAt:serverTimestamp(),...extra})
export default function Admin(){
const[user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[isAdmin,setIsAdmin]=useState(false),[email,setEmail]=useState(''),[pw,setPw]=useState(''),[rows,setRows]=useState<Row[]>([]),[f,setF]=useState<any>(empty),[eid,setEid]=useState<string>(),[cands,setCands]=useState<Cand[]>([]),[msg,setMsg]=useState('')
useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u);setIsAdmin(false);if(u){try{setIsAdmin((await getDoc(doc(db,'admins',u.uid))).exists())}catch{}}setReady(true)}),[])
const load=()=>getDocs(collection(db,'opportunities')).then(s=>setRows(s.docs.map(d=>({...(d.data() as any),id:d.id})))).catch(e=>setMsg('Could not load: '+e.message))
useEffect(()=>{if(isAdmin)load()},[isAdmin])
const login=async(e:React.FormEvent)=>{e.preventDefault();setMsg('');try{await signInWithEmailAndPassword(auth,email,pw)}catch(x:any){setMsg(x.code==='auth/invalid-credential'?'Wrong email or password.':'Sign-in failed: '+x.code)}}
const set=(k:string,v:any)=>setF((s:any)=>({...s,[k]:v}))
const place=(k:string,v:string)=>setF((s:any)=>({...s,[k]:v,lat:null,lng:null}))
const find=async()=>{setMsg('Searching…');setCands([]);try{const j=await(await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=us&q='+encodeURIComponent(`${f.address}, ${f.city}`))).json()
setCands(j.map((r:any)=>({label:r.display_name,lat:+r.lat,lng:+r.lon})));setMsg(j.length?'Pick the correct match below.':'No matches. Check the address and try again.')}catch{setMsg('Location lookup is unavailable right now. Try again shortly.')}}
const save=async(e:React.FormEvent)=>{e.preventDefault();const err=check(f);if(err)return setMsg(err)
try{if(eid)await updateDoc(doc(db,'opportunities',eid),payload(f));else await addDoc(collection(db,'opportunities'),payload(f,{createdAt:serverTimestamp()}));setMsg('Saved');setF(empty);setEid(undefined);setCands([]);load()}catch(x:any){setMsg('Save failed: '+x.code)}}
const status=async(r:Row,s:string)=>{try{await updateDoc(doc(db,'opportunities',r.id),{status:s,updatedAt:serverTimestamp()});setMsg(`${r.title}: ${s}`);load()}catch(x:any){setMsg('Update failed: '+x.code)}}
const edit=(r:Row)=>{setF({...empty,...r,address:r.address??'',date:r.date??'',duration:r.duration??'',requirements:r.requirements??''});setEid(r.id);setCands([]);window.scrollTo(0,0)}
if(!ready)return<p className="p-8">Loading…</p>
if(!user)return<main className="mx-auto max-w-sm px-4 py-16"><h1 className="font-serif text-3xl">Admin sign in</h1>
<form onSubmit={login} className="mt-6 space-y-3"><Lbl t="Email"><input type="email" className={inp} value={email} onChange={e=>setEmail(e.target.value)} required/></Lbl><Lbl t="Password"><input type="password" className={inp} value={pw} onChange={e=>setPw(e.target.value)} required/></Lbl><button className="bg-navy px-4 py-2 text-white">Sign in</button></form>{msg&&<p role="status" className="mt-3 text-sm text-blue">{msg}</p>}</main>
if(!isAdmin)return<main className="mx-auto max-w-lg px-4 py-16"><h1 className="font-serif text-3xl">Not an admin yet</h1><p className="mt-3 text-sm">Signed in as {user.email}. To make this account an admin, open Firestore in the Firebase console, create a collection named <b>admins</b>, and add a document whose ID is exactly:</p><p className="mt-2 break-all bg-white p-2 font-mono text-sm">{user.uid}</p><p className="mt-2 text-sm">Then refresh this page.</p><button className="mt-4 text-sm text-blue underline" onClick={()=>signOut(auth)}>Sign out</button></main>
return<main className="mx-auto max-w-6xl px-4 py-10"><div className="flex justify-between"><h1 className="font-serif text-4xl">Manage opportunities</h1><button className="text-sm underline text-blue" onClick={()=>signOut(auth)}>Sign out</button></div>
{msg&&<p role="status" className="mt-3 text-sm text-blue">{msg}</p>}
<div className="mt-6 grid gap-8 lg:grid-cols-2"><form onSubmit={save} className="space-y-3 border border-navy/10 bg-white p-4"><h2 className="font-serif text-xl">{eid?'Edit opportunity':'New opportunity'}</h2>
<Lbl t="Title"><input className={inp} value={f.title} onChange={e=>set('title',e.target.value)} required/></Lbl>
<Lbl t="Organization"><input className={inp} value={f.org} onChange={e=>set('org',e.target.value)} required/></Lbl>
<Lbl t="Category"><select className={inp} value={f.category} onChange={e=>set('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></Lbl>
<Lbl t="Description"><textarea className={inp} rows={3} value={f.desc} onChange={e=>set('desc',e.target.value)} required/></Lbl>
<label className="flex gap-2 text-sm"><input type="checkbox" checked={f.remote} onChange={e=>set('remote',e.target.checked)}/>Remote (no map pin)</label>
<Lbl t="City"><input className={inp} value={f.city} onChange={e=>place('city',e.target.value)} required/></Lbl>
{!f.remote&&<><Lbl t="Street address"><input className={inp} value={f.address} onChange={e=>place('address',e.target.value)}/></Lbl>
<button type="button" onClick={find} className="border border-navy px-3 py-1.5 text-sm">Find location</button>
{cands.map(c=><label key={c.label} className="flex gap-2 text-sm"><input type="radio" name="cand" onChange={()=>{set('lat',c.lat);set('lng',c.lng);setMsg('Location verified')}}/>{c.label}</label>)}
<p className="text-xs text-slate">{f.lat!=null?`Verified: ${f.lat.toFixed(5)}, ${f.lng.toFixed(5)}`:'Not verified yet. Changing the address clears verification.'}</p></>}
<div className="grid grid-cols-2 gap-3"><Lbl t="Date"><input type="date" className={inp} value={f.date} onChange={e=>set('date',e.target.value)}/></Lbl><Lbl t="Duration"><input className={inp} value={f.duration} onChange={e=>set('duration',e.target.value)}/></Lbl></div>
<Lbl t="Requirements"><input className={inp} value={f.requirements} onChange={e=>set('requirements',e.target.value)}/></Lbl>
<div className="flex gap-4"><Lbl t="Status"><select className={inp} value={f.status} onChange={e=>set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Lbl>
<label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={f.featured} onChange={e=>set('featured',e.target.checked)}/>Featured</label></div>
<div className="flex gap-3"><button className="bg-blue px-4 py-2 text-white">Save changes</button>{eid&&<button type="button" className="underline text-sm" onClick={()=>{setF(empty);setEid(undefined)}}>Cancel edit</button>}</div></form>
<div><div className="h-72 border border-navy/10"><MapView items={rows} onSelect={()=>{}} center={null}/></div>
{rows.length===0&&<p className="mt-4 text-sm text-slate">No opportunities yet. Add your first one with the form.</p>}
<ul className="mt-4 divide-y divide-navy/10 border border-navy/10 bg-white">{rows.map(r=><li key={r.id} className="p-3 text-sm"><p className="font-medium">{r.title}</p><p className="text-slate">{r.status} · {r.remote?'Remote':r.city}</p>
<div className="mt-2 flex gap-3"><button className="text-blue underline" onClick={()=>edit(r)}>Edit</button>
{r.status!=='published'&&<button className="text-blue underline" onClick={()=>status(r,'published')}>Publish</button>}
{r.status==='published'&&<button className="text-blue underline" onClick={()=>status(r,'draft')}>Unpublish</button>}
{r.status!=='archived'&&<button className="text-blue underline" onClick={()=>status(r,'archived')}>Archive</button>}</div></li>)}</ul></div></div></main>}
