#!/usr/bin/env node
/**
 * Read-only product lifecycle handoff for Mobility. This is NOT a second
 * recommendation engine. Only the existing model-fit gate may unlock commerce.
 * Zero HTTP requests, WordPress writes, affiliate redirects or visitor answers.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";

const EXACT=Object.freeze({
  "besco-wa78":{
    merchant:"rehabilitacni-pomucky-cz",sku:"WA78",
    url:"https://www.rehabilitacnipomucky.cz/besco-ctyrkolove-choditko-odlehcene-skladaci/",
    lifecycle:"hold_critical_conflict",availability:"sold_out_displayed",width:61,load:136
  },
  "unizdrav-p2879":{
    merchant:"unizdrav-cz",sku:"P2879",
    url:"https://unizdrav.cz/zbozi/2879/pojizdne-choditko-unizdrav-modre",
    lifecycle:"seller_listing_observed",availability:"in_stock_displayed",width:58,load:110,height:"79.5–91"
  },
  "unizdrav-p3774":{
    merchant:"unizdrav-cz",sku:"P3774",
    url:"https://unizdrav.cz/zbozi/3774/pojizdne-choditko-s-nafukovacimi-koly-mego",
    lifecycle:"retired",availability:"retired_by_merchant",width:63,load:135,height:"82–99"
  },
  "unizdrav-p5559":{
    merchant:"unizdrav-cz",sku:"P5559",
    url:"https://unizdrav.cz/zbozi/5559/pojizdne-choditko-s-nafukovacimi-koly-mego-2",
    lifecycle:"seller_listing_observed",availability:"in_stock_displayed",width:62.5,load:135,height:"80–100"
  }
});
const ALLOWED_BLOCKERS=new Set([
  "critical_max_load_disagreement",
  "retailer_sold_out_displayed",
  "linked_manual_brand_disagreement",
  "retired_by_merchant",
  "independent_model_manual_missing",
  "same_variant_fresh_inventory_not_verified",
  "exact_publisher_deeplink_unverified"
]);
const FORBIDDEN_FIELDS=/answer|health|diagnos|visitor|client.?id|affiliate.?url|tracking.?url|commission|publisher.?id|token|password/i;

function exactHttps(value,allowed){
  if(value!==allowed)return false;
  try{
    const url=new URL(value);
    return url.protocol==="https:"&&!url.username&&!url.password&&!url.search&&!url.hash&&!url.port;
  }catch{return false;}
}
function must(condition,message){
  if(!condition)throw new Error(message);
}

/** Never promote an out-of-stock/retired, disputed, or unknown-source SKU. */
export function validateRollatorSupply(data,liveCatalog=MOBILITY_PRODUCTS){
  must(data?.schemaVersion===2&&data.reviewedOn==="2026-11-21"&&
    data.productionEffect==="none"&&Array.isArray(data.candidates)&&
    data.candidates.length===Object.keys(EXACT).length,
    "Invalid versioned rollator evidence snapshot");
  must(Array.isArray(liveCatalog),"Invalid live catalog");
  const seen=new Set();
  for(const item of data.candidates){
    const spec=item&&EXACT[item.id];
    must(spec&&!seen.has(item.id)&&typeof item==="object"&&!Array.isArray(item),
      "Unexpected or duplicate rollator evidence item");
    seen.add(item.id);
    must(item.productionEligible===false&&
      item.publisherDeeplinkVerified===false&&item.stockVerifiedCurrent===false&&
      item.productType==="rollator_with_seat"&&
      item.merchantId===spec.merchant&&item.retailerSku===spec.sku&&
      exactHttps(item.retailerUrl,spec.url)&&
      item.lifecycleStatus===spec.lifecycle&&
      item.merchantClaim?.availability===spec.availability&&
      item.merchantClaim.widthCm===spec.width&&
      item.merchantClaim.maxUserWeightKg===spec.load&&
      Array.isArray(item.blockers)&&new Set(item.blockers).size===item.blockers.length&&
      item.blockers.every(x=>ALLOWED_BLOCKERS.has(x))&&
      item.blockers.includes("exact_publisher_deeplink_unverified")&&
      typeof item.nextEvidence==="string"&&item.nextEvidence.length>=40&&
      !Object.keys(item).some(k=>FORBIDDEN_FIELDS.test(k)),
      "Rollator merchant identity, lifecycle or commerce gate conflict");
    if(item.id==="besco-wa78"){
      must(item.manufacturerUrl==="https://www.bescomedical.com/455-deluxe-folding-Aluminum-Rollator.html"&&
        item.manufacturerModel==="BES-WA78"&&
        item.manufacturerClaim?.maxUserWeightKg===110&&
        item.merchantClaim.handBrakes==="two_locking"&&
        ["critical_max_load_disagreement","retailer_sold_out_displayed",
          "linked_manual_brand_disagreement"].every(x=>item.blockers.includes(x)),
        "BESCO WA78 contradictory factory load/manual/retailer evidence cannot be cleared");
    }else{
      must(item.manufacturerUrl===null&&item.manufacturerModel===null&&
        item.manufacturerClaim===null&&
        item.merchantClaim.handleHeightCm===spec.height&&
        item.merchantClaim.handBrakes==="service_and_parking"&&
        item.merchantObservation?.observedOn==="2026-11-21"&&
        item.merchantObservation.url===item.retailerUrl&&
        item.merchantObservation.kind==="public_seller_product_page"&&
        item.blockers.includes("independent_model_manual_missing"),
        "UNIZDRAV independent device document missing or seller SKU changed");
      if(item.id==="unizdrav-p3774"){
        must(item.merchantObservation.statusText.includes("vyřazeno")&&
          item.relatedModel?.id==="unizdrav-p5559"&&
          item.relatedModel.relation==="different_sku_not_equivalent"&&
          item.blockers.includes("retired_by_merchant")&&
          !item.blockers.includes("same_variant_fresh_inventory_not_verified"),
          "Discontinued P3774 must stay retired and must not alias P5559");
      }else{
        must(item.merchantObservation.availabilityScope==="seller_display_only"&&
          item.blockers.includes("same_variant_fresh_inventory_not_verified"),
          "A public stock label is not physical inventory verification");
      }
    }
    must(!liveCatalog.some(p=>p.id===item.id&&p.productionEligible),
      "Blocked supplier candidate has entered the live production catalog");
  }
  must(Object.keys(EXACT).every(id=>seen.has(id))&&
    !liveCatalog.some(p=>p.id.startsWith("unizdrav-p")&&seen.has(p.id)),
    "Supplier candidate must not be silently inserted into recommendation catalog");
  return data;
}

export function reportRollatorSupply(data,liveCatalog=MOBILITY_PRODUCTS){
  validateRollatorSupply(data,liveCatalog);
  return {
    reviewed_on:data.reviewedOn,stage:"public_supplier_evidence_only",
    total_records:data.candidates.length,
    current_seller_listings:data.candidates.filter(x=>x.lifecycleStatus==="seller_listing_observed").length,
    retired_skus:data.candidates.filter(x=>x.lifecycleStatus==="retired").length,
    product_load_conflicts:data.candidates.filter(x=>x.lifecycleStatus==="hold_critical_conflict").length,
    active_offers_added:0,publisher_deeplinks_verified:0,physical_stock_verified:0,
    items:data.candidates.map(item=>({id:item.id,sku:item.retailerSku,
      lifecycle:item.lifecycleStatus,availability_scope:item.merchantClaim.availability,
      production_eligible:false,blockers:[...item.blockers]})),
    limitations:"P3774 retired; P5559 MEGO 2 is a distinct model, not an automatic replacement. No verified manufacturer manual, physical inventory, exact publisher URL, fit or commission."
  };
}
export function supplyCli(){
  const data=JSON.parse(readFileSync(new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
  return JSON.stringify(reportRollatorSupply(data),null,2)+"\n";
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{process.stdout.write(supplyCli());}
  catch{process.stderr.write("ROLLATOR_SUPPLY_EVIDENCE_FAILED: public SKU, lifecycle or safety conflict\n");process.exitCode=1;}
}
