import{useEffect,useState}from'react'
import{collection,getDocs,query,where}from'firebase/firestore'
import{db}from'./firebase'
export type Opp={id:string;title:string;org:string;category:string;desc:string;remote:boolean;city:string;address?:string;lat?:number;lng?:number;date?:string;duration?:string;requirements:string;featured?:boolean;demo?:boolean}
export const CATS=['French tutoring','Language exchange','Cultural events','Translation','Educational outreach']
export function useOpps(){const[s,set]=useState<{data:Opp[]|null;error?:string}>({data:null})
useEffect(()=>{getDocs(query(collection(db,'opportunities'),where('status','==','published'))).then(r=>set({data:r.docs.map(d=>({...(d.data() as any),id:d.id}))})).catch(e=>set({data:null,error:String(e)}))},[]);return s}
export const miles=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>{const r=(x:number)=>x*Math.PI/180,h=Math.sin(r(b.lat-a.lat)/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(r(b.lng-a.lng)/2)**2;return 3958.8*2*Math.asin(Math.sqrt(h))}
