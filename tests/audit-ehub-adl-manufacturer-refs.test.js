import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {manufacturerTargets,observeManufacturerRef,auditManufacturerRefs} from "../scripts/audit-ehub-adl-manufacturer-refs.mjs";
import {ehubAdlTargets} from "../scripts/audit-ehub-adl-listings.mjs";
const evidence=JSON.parse(readFileSync(new URL("../data/ehub-adl-manufacturer-observation-20261127.json",import.meta.url),"utf8"));
const targets=manufacturerTargets();
const page=(t,refs=t.manufacturerRefs.join(" "))=>'<html><head><title>Manufacturer</title></head><body><h2>'+t.manufacturerName+'</h2><p>Product description</p><p>Ref code: '+refs+'</p><p>Colors</p><p>Unit 1 pc</p><h2>Recommended</h2><p>Ref code: 15-050101</p></body></html>';
test("dated manufacturer evidence joins all four existing exact seller IDs without changing runtime",()=>{
 const e=ehubAdlTargets();
 assert.deepEqual(targets.map(t=>[t.candidateId,t.sellerSku,t.sellerUrl]),e.map(t=>[t.id,t.sku,t.url]));
 assert.equal(evidence.observedOn,"2026-11-27");
 assert.equal(evidence.conclusions.manufacturerRefMatchesSellerCode,4);
 assert.equal(evidence.conclusions.singleRefProductPages,3);
 assert.deepEqual(targets[3].manufacturerRefs,["15-050104","15-050105"]);
 assert.equal(evidence.openItVariant.matchingRef,targets[3].sellerSku);
 assert.ok(e.every(t=>t.checkedAt==="2026-10-07"));
 assert.equal(evidence.program.actualDomainRegistration,"UNKNOWN");
 assert.equal(evidence.program.actualPublisherRate,"UNKNOWN");
 assert.equal(evidence.program.approvedCommission,"UNKNOWN");
 assert.equal(evidence.conclusions.actualDeliveredVariant,"UNKNOWN");
 assert.equal(evidence.nonActions.runtimeChanged,false);
 assert.equal(evidence.nonActions.affiliateClicks,0);
});
test("manufacturer refs must be in the exact product heading and reference block; multiple variant refs preserved",()=>{
 for(const t of targets){
  assert.equal(observeManufacturerRef(page(t),t).manufacturerRefMatchesSellerCode,true);
  for(const bad of [
   page(t,"15-050199"),page(t,""),page(t,t.manufacturerRefs.join(" ")+" 15-050100"),
   page(t).replace("<h2>"+t.manufacturerName+"</h2>","<h2>Other</h2>"),
   page(t).replace("Ref code: "+t.manufacturerRefs.join(" "),"<script>Ref code: "+t.manufacturerRefs.join(" ")+"</script>"),
   page(t).replace("Ref code: "+t.manufacturerRefs.join(" "),"<!-- Ref code: "+t.manufacturerRefs.join(" ")+" -->")
  ]) assert.equal(observeManufacturerRef(bad,t).manufacturerRefMatchesSellerCode,false);
 }
 assert.equal(observeManufacturerRef(page(targets[3],"15-050105"),targets[3]).manufacturerRefMatchesSellerCode,false);
});
test("four exact manufacturer GETs only; no affiliate tracker, redirects or offer authorization",async()=>{
 const seen=[];
 const r=await auditManufacturerRefs(async(url,opts)=>{
  seen.push({url,opts});const t=targets.find(t=>t.manufacturerUrl===url);
  return {status:200,url,headers:{get:k=>k==="content-type"?"text/html; charset=utf-8":null},text:async()=>page(t)};
 });
 assert.equal(r.manufacturer_ref_matches_seller_code,4);
 assert.equal(r.needs_review,0);
 assert.equal(r.publisher_deeplink,"UNKNOWN");
 assert.equal(r.approved_commission,"UNKNOWN");
 assert.equal(r.production_offer_changes,0);
 assert.equal(r.offer_dates_refreshed,0);
 assert.equal(seen.length,4);
 assert.ok(seen.every(({url,opts})=>url.startsWith("https://mvs-in-motion.com/products/product/")&&opts.method==="GET"&&opts.redirect==="error"));
 const denied=await auditManufacturerRefs(async url=>({status:403,url}));
 assert.equal(denied.needs_review,4);
 const redirected=await auditManufacturerRefs(async url=>({status:200,url:url+"?extra=1"}));
 assert.equal(redirected.needs_review,4);
});
