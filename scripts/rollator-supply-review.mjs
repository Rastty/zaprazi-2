#!/usr/bin/env node
/**
 * Read-only supplier evidence handoff for the NEXT Mobility release.
 * This is not a second recommendation engine, stock checker or affiliate
 * linker. No HTTP requests; never touches WordPress, the live catalog or
 * visitor answers. Current product suitability stays in src/mobility/engine.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";

const EXPECTED_IDS=new Set(["besco-wa78","unizdrav-p2879","unizdrav-p3774"]);
const ALLOWED_BLOCKERS=new Set([
  "critical_max_load_disagreement",
  "retailer_sold_out_displayed",
  "linked_manual_brand_disagreement",
  "independent_model_manual_missing",
  "same_variant_fresh_inventory_not_verified",
  "exact_publisher_deeplink_unverified"
]);
const URL_HOSTS=new Map([
  ["besco-wa78","www.rehabilitacnipomucky.cz"],
  ["unizdrav-p2879","unizdrav.cz"],
  ["unizdrav-p3774","unizdrav.cz"]
]);
const EXACT_MANUFACTURER="https://www.bescomedical.com/455-deluxe-folding-Aluminum-Rollator.html";
const PROTECTED_FIELDS=/answer|health|diagnos|visitor|client.?id|affiliate.?url|tracking.?url|commission|publisher.?id|token|password/i;

function publicUrl(value,host){
  if(typeof value!=="string")return false;
  try{
    const u=new URL(value);
    return u.protocol==="https:"&&u.hostname===host&&u.username===""&&u.password===""&&
      u.search===""&&u.hash===""&&u.port==="";
  }catch{return false;}
}
function positiveFinite(v){return typeof v==="number"&&Number.isFinite(v)&&v>0;}

/** Validate bounded public evidence. A blocked seller listing is never an offer. */
export function validateRollatorSupply(data,liveCatalog=MOBILITY_PRODUCTS){
  if(!data||data.schemaVersion!==1||data.reviewedOn!=="2026-11-21"||
    data.productionEffect!=="none"||!Array.isArray(data.candidates)||
    data.candidates.length!==3||!Array.isArray(liveCatalog))
    throw new Error("Invalid rollator evidence snapshot");
  const ids=new Set();
  for(const item of data.candidates){
    if(!item||typeof item!=="object"||Array.isArray(item)||
      !EXPECTED_IDS.has(item.id)||ids.has(item.id)||
      !URL_HOSTS.has(item.id)||item.productType!=="rollator_with_seat"||
      item.productionEligible!==false||
      item.publisherDeeplinkVerified!==false||
      item.stockVerifiedCurrent!==false||
      !publicUrl(item.retailerUrl,URL_HOSTS.get(item.id))||
      !Array.isArray(item.blockers)||item.blockers.length<2||
      new Set(item.blockers).size!==item.blockers.length||
      item.blockers.some(b=>!ALLOWED_BLOCKERS.has(b))||
      !item.blockers.includes("exact_publisher_deeplink_unverified")||
      !item.merchantClaim||!positiveFinite(item.merchantClaim.widthCm)||
      !positiveFinite(item.merchantClaim.maxUserWeightKg)||
      typeof item.nextEvidence!=="string"||item.nextEvidence.length<20||
      Object.keys(item).some(k=>PROTECTED_FIELDS.test(k)))
      throw new Error("Rollator supply item cannot be promoted without evidence");
    const merchant=item.id==="besco-wa78"?"rehabilitacni-pomucky-cz":"unizdrav-cz";
    const sku=item.id==="besco-wa78"?"WA78":
      item.id==="unizdrav-p2879"?"P2879":"P3774";
    if(item.merchantId!==merchant||item.retailerSku!==sku||
      !item.retailerUrl.includes(item.id==="besco-wa78"?
        "besco-ctyrkolove-choditko-odlehcene-skladaci":item.id.slice(-4))||
      !["two_locking","service_and_parking"].includes(item.merchantClaim.handBrakes))
      throw new Error("Rollator evidence does not identify exact merchant/SKU");
    if(item.id==="besco-wa78"){
      if(item.manufacturerUrl!==EXACT_MANUFACTURER||
        item.manufacturerModel!=="BES-WA78"||
        !positiveFinite(item.manufacturerClaim?.maxUserWeightKg)||
        item.manufacturerClaim.maxUserWeightKg===item.merchantClaim.maxUserWeightKg||
        item.merchantClaim.availability!=="sold_out_displayed"||
        !item.blockers.includes("critical_max_load_disagreement")||
        !item.blockers.includes("retailer_sold_out_displayed")||
        !item.blockers.includes("linked_manual_brand_disagreement"))
        throw new Error("BESCO WA78 source/model/load/stock conflict must remain blocked");
    }else if(item.manufacturerUrl!==null||item.manufacturerModel!==null||
      item.manufacturerClaim!==null||
      !item.blockers.includes("independent_model_manual_missing")||
      !item.blockers.includes("same_variant_fresh_inventory_not_verified")||
      item.merchantClaim.availability!=="in_stock_displayed"||
      !/^79\.5–91$|^82–99$/.test(item.merchantClaim.handleHeightCm))
      throw new Error("Unizdrav candidate lacks independent manufacturer identity or fresh stock proof");
    if(liveCatalog.some(p=>p.id===item.id&&p.productionEligible))
      throw new Error("Blocked supply candidate already enabled in production catalog");
    ids.add(item.id);
  }
  if(ids.size!==EXPECTED_IDS.size||
    data.candidates.some(item=>item.id!=="besco-wa78"&&
      liveCatalog.some(p=>p.id===item.id)))
    throw new Error("Unreviewed candidate was added to the live recommendation catalog");
  return data;
}

export function reportRollatorSupply(data,liveCatalog=MOBILITY_PRODUCTS){
  validateRollatorSupply(data,liveCatalog);
  return {
    reviewed_on:data.reviewedOn,
    stage:"product_supply_evidence_only",
    total_candidates:data.candidates.length,
    active_offers_added:0,
    publisher_deeplinks_verified:0,
    current_stock_verified:0,
    candidates:data.candidates.map(item=>({
      id:item.id,merchant:item.merchantId,sku:item.retailerSku,
      status:"hold",blockers:[...item.blockers]
    })),
    limitations:[
      "BESCO WA78: manufacturer max load conflicts with merchant data; linked Rehabiq manual and sold-out listing remain unresolved.",
      "UNIZDRAV P2879/P3774: seller SKU and parameters are leads, not independently verified specific-device manuals or live availability.",
      "Never generate or click affiliate URLs; require source-bound publisher-authorized deeplink and model-specific fit gate before commerce."
    ]
  };
}

export function supplyCli(){
  const data=JSON.parse(readFileSync(new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
  return JSON.stringify(reportRollatorSupply(data),null,2)+"\n";
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{process.stdout.write(supplyCli());}
  catch{process.stderr.write("ROLLATOR_SUPPLY_EVIDENCE_FAILED: invalid public candidate data or safety gate\n");process.exitCode=1;}
}
