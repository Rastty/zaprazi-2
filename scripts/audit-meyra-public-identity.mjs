/**
 * Public, strictly read-only identity and dimensional-evidence triage for the
 * third production Mobility product, MEYRA Ideal Rollator 3061982.
 *
 * Merchant HTTP reachability is NOT SKU identity. Never automatically alter
 * facts, rank, live offers or fit gates based on this probe. No tracking URLs,
 * cookies, WordPress requests, analytics or user answers.
 */
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {visibleMerchantText} from "./audit-mobility-merchant-facts.mjs";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";

const OFFICIAL="https://www.meyra.cz/ctyrkolove-choditko-rollator.html";
const MERCHANT="https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/";
const MAX_BODY=1_500_000;
const EXPECTED_MODEL="3061982";

export function meyraPublicEvidenceTargets(products=MOBILITY_PRODUCTS){
  const p=products.find(x=>x.id==="meyra-ideal-3061982");
  if(!p||p.productionEligible!==true||p.identityStatus!=="verified"||
    p.facts?.widthCm!==61.5||p.facts?.heightCm!=="79–97"||
    p.facts?.maxUserWeightKg!==130)
    throw new Error("MEYRA canonical product facts changed; independent review required");
  const offer=p.offers.find(x=>x.affiliateKey==="lekarna-cz:meyra-ideal-3061982");
  if(!offer||offer.affiliateUrl!==null||offer.url!==MERCHANT||
     offer.merchantId!=="lekarna-cz")
    throw new Error("MEYRA canonical non-tracking merchant target changed");
  if(!p.evidence.some(x=>x.type==="manufacturer_manual"&&x.url.startsWith("https://www.meyra.cz/")))
    throw new Error("MEYRA approved manufacturer identity source missing");
  return [
    {kind:"manufacturer",url:OFFICIAL},
    {kind:"retailer",url:MERCHANT}
  ];
}

const number=s=>s==null?null:Number(s.replace(",","."));
function extractField(text,field){
  const match=text.match(new RegExp("(?:^|\\s)"+field+
    "\\s*(?:\\(\\s*cm\\s*\\))?\\s*:?\\s*(\\d{2}(?:[,.]\\d)?)\\b","i"));
  return number(match?.[1]);
}
export function parsePublicMeyraEvidence(html,kind){
  if(!["manufacturer","retailer"].includes(kind))throw new Error("Unknown public source");
  const visible=visibleMerchantText(html);
  const heading=String(html).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]??"";
  const title=visibleMerchantText(heading);
  const named=/\bmeyra\b/i.test(title)&&/\bideal\b/i.test(title)&&
    /rollator|chodítko/i.test(title);
  const explicitModel=new RegExp("\\b"+EXPECTED_MODEL+"\\b").test(visible);
  const width=extractField(visible,"Šířka");
  const range=visible.match(/Výška\s+madel\s*(?:\(\s*cm\s*\))?\s*:?\s*(\d{2})\s*[-–]\s*(\d{2})\b/i);
  const handles=range?[Number(range[1]),Number(range[2])]:null;
  const reasons=[];
  if(!named)reasons.push("product_heading_not_confirmed");
  // A retailer's own numeric stock code or EAN is not proof of the
  // manufacturer's 3061982 variant without authoritative cross-reference.
  if(!explicitModel)reasons.push("exact_manufacturer_model_not_on_page");
  if(width===null||!handles)reasons.push("fit_dimensions_not_readable");
  if(width!==null&&width!==61.5)reasons.push("manufacturer_width_differs");
  if(handles&&(handles[0]!==79||handles[1]!==97))
    reasons.push("manufacturer_handle_range_differs");
  return {kind,status:reasons.length?"review_required":"matching_public_facts",
    reasons,model:explicitModel?EXPECTED_MODEL:null,widthCm:width,
    handleRangeCm:handles};
}

export function classifyMeyraPublicResponse(response,expected){
  if(response.status===403||response.status===429||response.status===401)
    return {kind:expected.kind,status:"unverifiable",reasons:["blocked_by_public_merchant"]};
  if(response.status!==200||response.url!==expected.url)
    return {kind:expected.kind,status:"review_required",reasons:["redirect_or_unexpected_http"]};
  if(typeof response.html!=="string"||response.html.length<300||
     Buffer.byteLength(response.html,"utf8")>MAX_BODY)
    return {kind:expected.kind,status:"unverifiable",reasons:["missing_or_unexpected_html"]};
  return parsePublicMeyraEvidence(response.html,expected.kind);
}

export async function auditMeyraIdentity(fetcher=fetch){
  const records=meyraPublicEvidenceTargets();
  const results=[];
  // One request at a time; only exact public canonical manufacturer/retailer URLs.
  for(const record of records){
    try{
      const response=await fetcher(record.url,{
        method:"GET",redirect:"manual",headers:{Accept:"text/html"},
        signal:AbortSignal.timeout(12000)
      });
      const contentType=response.headers?.get("content-type")??"";
      const declared=Number(response.headers?.get("content-length"));
      const html=response.status===200&&response.url===record.url&&
        /^text\/html/i.test(contentType)&&
        (!Number.isFinite(declared)||declared<=MAX_BODY)
          ?await response.text():"";
      results.push(classifyMeyraPublicResponse({status:response.status,
        url:response.url,html},record));
    }catch{
      results.push({kind:record.kind,status:"unverifiable",
        reasons:["public_source_network_unavailable"]});
    }
  }
  return {kind:"meyra_3061982_public_identity_and_facts",model:EXPECTED_MODEL,
    sources:"manufacturer and canonical retailer only; GET without redirects or affiliate tracking",
    results,limitations:"Public page appearance and measurements do not prove exact merchant product identity, stock, safety, reimbursement or any commission. 403 means unknown, not discontinued. The merchant must directly confirm variant identity when model code is missing."};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const report=await auditMeyraIdentity();
  console.log("ZP_MEYRA_PUBLIC_IDENTITY_EVIDENCE "+JSON.stringify(report));
  if(report.results.some(r=>r.status!=="matching_public_facts"))
    console.warn("::warning::MEYRA exact merchant identity/dimensions require human verification; never auto-update product specs, safety gates or rankings.");
}
