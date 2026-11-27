#!/usr/bin/env node
// Bounded public manufacturer reference observation; never a purchase-fit or affiliate gate.
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {ehubAdlTargets} from "./audit-ehub-adl-listings.mjs";

const data=JSON.parse(readFileSync(new URL("../data/ehub-adl-manufacturer-observation-20261127.json",import.meta.url),"utf8"));
export const manufacturerTargets=()=>data.items.map(x=>({...x,manufacturerRefs:[...x.manufacturerRefs]}));
const MAX=1500000;
const plain=html=>html.replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&reg;|&#174;/gi,"®").replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();
const unknown=(t,reason)=>({id:t.candidateId,status:"unverifiable",reason,manufacturerRefMatchesSellerCode:false});
export function observeManufacturerRef(html,target){
 if(typeof html!=="string"||html.length<100||html.length>MAX)return unknown(target,"invalid_html");
 const clean=html.replace(/<!--[\s\S]*?-->/g," ").replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi," ");
 const headers=[...clean.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/gi)];
 const found=headers.filter(h=>plain(h[1])===target.manufacturerName);
 if(found.length!==1)return unknown(target,"product_heading_missing_or_ambiguous");
 const h=found[0],start=h.index+h[0].length;
 const end=headers.find(x=>x.index>=start)?.index??clean.length;
 const block=plain(clean.slice(start,Math.min(end,start+35000)));
 const refSections=[...block.matchAll(/\bRef\s+code\s*:\s*([\s\S]*?)(?=\b(?:Colors|Colours|Unit|Material|Specs)\b)/gi)];
 if(refSections.length!==1)return unknown(target,"reference_block_missing_or_ambiguous");
 const raw=refSections[0][1].trim();
 const refs=[...raw.matchAll(/(?:^|[^0-9-])(15-05010[1-5])(?=$|[^0-9-])/g)].map(x=>x[1]);
 if(new Set(refs).size!==refs.length||!refs.includes(target.sellerSku)||JSON.stringify([...refs].sort())!==JSON.stringify([...target.manufacturerRefs].sort()))return unknown(target,"reference_set_mismatch");
 // No other text or codes may masquerade as an exact reference block.
 if(raw.replace(/15-05010[1-5]/g,"").replace(/[\s,;/|–—-]/g,"")!=="")return unknown(target,"unexpected_reference_content");
 return {id:target.candidateId,status:"manufacturer_reference_matches_seller_code",manufacturerRefMatchesSellerCode:true,scope:refs.length===1?"single_ref":"multi_ref_family"};
}
export async function auditManufacturerRefs(fetcher=fetch){
 const expected=ehubAdlTargets(),targets=manufacturerTargets();
 if(targets.length!==4||!targets.every((t,i)=>t.candidateId===expected[i].id&&t.sellerSku===expected[i].sku&&t.sellerUrl===expected[i].url&&new URL(t.manufacturerUrl).origin==="https://mvs-in-motion.com"&&/^\/products\/product\/[a-z-]+\/$/.test(new URL(t.manufacturerUrl).pathname)&&new URL(t.manufacturerUrl).search===""&&new URL(t.manufacturerUrl).hash===""))throw Error("MANUFACTURER_TARGET_CONTRACT_CHANGED");
 const rows=await Promise.all(targets.map(async t=>{
  try{
   const r=await fetcher(t.manufacturerUrl,{method:"GET",redirect:"error",cache:"no-store",headers:{Accept:"text/html"},signal:AbortSignal.timeout(12000)});
   if(r.status!==200||r.url!==t.manufacturerUrl||!/^text\/html(?:;|$)/i.test(r.headers?.get("content-type")??""))return unknown(t,"http_or_canonical_mismatch");
   const length=Number(r.headers?.get("content-length")??0);
   if(length>MAX)return unknown(t,"body_too_large");
   return observeManufacturerRef(await r.text(),t);
  }catch{return unknown(t,"network_unavailable");}
 }));
 return {kind:"ehub_adl_manufacturer_ref_readonly",checked_count:rows.length,manufacturer_ref_matches_seller_code:rows.filter(r=>r.manufacturerRefMatchesSellerCode).length,needs_review:rows.filter(r=>!r.manufacturerRefMatchesSellerCode).length,actual_delivered_variant:"UNKNOWN",publisher_deeplink:"UNKNOWN",approved_commission:"UNKNOWN",affiliate_tracking_requests:0,wordpress_writes:0,offer_dates_refreshed:0,production_offer_changes:0,results:rows};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const r=await auditManufacturerRefs();
 console.log("ZP_EHUB_ADL_MANUFACTURER_REF_EVIDENCE "+JSON.stringify(r));
 if(r.needs_review)console.log("::warning::Manufacturer public reference observation incomplete; retain all holds.");
}
