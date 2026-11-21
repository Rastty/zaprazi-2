#!/usr/bin/env node
/**
 * Weekly read-only seller-side lifecycle check for 3 precise UNIZDRAV SKUs.
 * Reuses the Mobility merchant-evidence workflow. Never follows affiliate
 * links, starts a cart, transmits visitor answers, or writes WordPress.
 * The stock label belongs to the SELLER webpage, not proven physical stock.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {validateRollatorSupply} from "./rollator-supply-review.mjs";

const SKU_TITLE=Object.freeze({
  "unizdrav-p2879":"Pojízdné chodítko UNIZDRAV, modré",
  "unizdrav-p3774":"Pojízdné chodítko s nafukovacími koly MEGO",
  "unizdrav-p5559":"Pojízdné chodítko s nafukovacími koly MEGO 2"
});
const RESTRICTION="Only exact seller HTML: no buyer stock, safety, affiliate or conversion attestation.";
const readData=()=>JSON.parse(readFileSync(
  new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
export function monitoredRollatorListings(data=readData()){
  validateRollatorSupply(data);
  return data.candidates.filter(item=>Object.hasOwn(SKU_TITLE,item.id))
    .map(item=>({id:item.id,sku:item.retailerSku,url:item.retailerUrl,
      title:SKU_TITLE[item.id],expectedLifecycle:item.lifecycleStatus}));
}
// Seller may mark the product heading with a reviewable, cosmetic badge.
// Whitelist only these exact labels, never fuzzy product-name substitutions.
const normalizeSellerHeading=raw=>cleanText(raw)
  .replace(/^(?:(?:top zboží|novinka|akce|tip na dárek)\s+)+/gi,"")
  .replace(/(?:\s+(?:top zboží|novinka|akce|tip na dárek))+$/gi,"")
  .trim();
const cleanText=html=>String(html)
  .replace(/<!--[^\n]*?-->/g," ")
  .replace(/<(?:script|style|noscript|template)\b[^>]*>[\s\S]*?<\/(?:script|style|noscript|template)\s*>/gi," ")
  .replace(/<[^>]*>/g," ")
  .replace(/&nbsp;|&#160;|&#xA0;/gi," ").replace(/&amp;/gi,"&")
  .replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)))
  .replace(/\s+/g," ").trim();
export function classifyRollatorListingHtml(html,record){
  if(!record||!Object.hasOwn(SKU_TITLE,record.id)||record.title!==SKU_TITLE[record.id]||
    typeof html!=="string"||html.length<250||html.length>1500000)
    return {id:record?.id??"unknown",observation:"unverifiable",reason:"unexpected_page_or_scope"};
  // Other recommendations may appear BEFORE the product H1 and AFTER the
  // current product's description. None of their "Skladem" labels count.
  const h1s=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  // Some active seller pages render the same product H1 twice (responsive
  // variants); the retired template renders it once. Accept at most three
  // repetitions ONLY when every heading names this exact SKU's product.
  // Another product's H1, even on the same page, fails closed.
  // Count-only diagnostics let the next live run distinguish global extra
  // headings, cosmetic labels and a genuinely changed product name. NEVER
  // emit seller HTML, heading text, URLs, PII or health answers into CI logs.
  const headingShape={
    h1_count_bounded:Math.min(h1s.length,4),
    exact_h1_count:h1s.filter(match=>normalizeSellerHeading(match[1])===record.title).length,
    contains_expected_title_count:h1s.filter(match=>
      normalizeSellerHeading(match[1]).includes(record.title)).length
  };
  if(h1s.length<1||h1s.length>3)
    return {id:record.id,observation:"unverifiable",
      reason:"exact_product_h1_count_mismatch",heading_shape:headingShape};
  // Two H1 headings / one exact title on both active seller pages is a
  // documented live shape, NOT grounds to trust any other product's stock.
  // Find the exact product title first, then validate SKU and the bounded
  // product summary. Unrelated H1s are ignored only OUTSIDE that summary:
  // before the exact title or after the first product-description boundary.
  const exactIndex=h1s.findIndex(match=>
    normalizeSellerHeading(match[1])===record.title);
  if(exactIndex<0)
    return {id:record.id,observation:"unverifiable",
      reason:"exact_product_h1_missing",heading_shape:headingShape};
  const productHeading=h1s[exactIndex];
  const productHeadingEnd=productHeading.index+productHeading[0].length;
  const slice=html.slice(productHeadingEnd);
  const description=slice.search(/Popis\s+produktu/i);
  // If the product/related-items boundary is absent, never trust a sidebar.
  if(description===-1||description>50000)
    return {id:record.id,observation:"unverifiable",reason:"product_scope_boundary_missing"};
  const detailBoundary=productHeadingEnd+description;
  if(h1s.some(match=>match.index>productHeading.index&&
      match.index<detailBoundary&&
      normalizeSellerHeading(match[1])!==record.title))
    return {id:record.id,observation:"unverifiable",
      reason:"foreign_h1_inside_product_summary",heading_shape:headingShape};
  const zone=cleanText(slice.slice(0,description));
  if(!zone||zone.length>10000||
    !new RegExp("\\bKód\\s*:\\s*"+record.sku+"\\b","i").test(zone))
    return {id:record.id,observation:"unverifiable",reason:"exact_product_sku_missing"};
  if(/zboží už bylo vyřazeno z naší nabídky/i.test(zone))
    return {id:record.id,observation:"retired",reason:"exact_sku_removed_by_merchant"};
  // A seller can explicitly show an unavailable/arriving SKU without a cart.
  // This is an observed PAGE LABEL, not independently checked warehouse stock.
  // Look only inside the verified exact-SKU product zone above, not sidebars.
  const unavailableLabel=/(?:zboží\s+(?:je\s+)?na\s+cestě|momentálně\s+není\s+skladem|není\s+skladem|dočasně\s+nedostupné|vyprodáno)/gi;
  const displaysUnavailable=unavailableLabel.test(zone);
  // Remove negative phrases before looking for "Skladem"; the word in
  // "není skladem" must never be interpreted as an available item.
  const positiveZone=zone.replace(unavailableLabel," ");
  const displaysAvailable=/\bSkladem\s*(?:>\s*\d+\s*ks)?\b/i.test(positiveZone)&&
    /\bDo košíku\b/i.test(positiveZone);
  if(displaysUnavailable&&displaysAvailable)
    return {id:record.id,observation:"unverifiable",
      reason:"contradictory_seller_availability_labels"};
  if(displaysUnavailable)
    return {id:record.id,observation:"seller_displays_unavailable",
      reason:"seller_product_page_unavailable_label_only"};
  if(displaysAvailable)
    return {id:record.id,observation:"seller_displays_available",
      reason:"seller_product_page_stock_label_only"};
  return {id:record.id,observation:"unverifiable",reason:"stock_or_product_state_not_confirmed"};
}
export function classifyRollatorResponse(response,record){
  if(response?.status!==200||response?.url!==record.url)
    return {id:record.id,observation:"unverifiable",
      reason:[403,429].includes(response?.status)?"merchant_blocked":"wrong_url_or_http_status"};
  return classifyRollatorListingHtml(response.html,record);
}
export function assessRollatorLifecycle(observation,record){
  const expected=record.expectedLifecycle==="retired"?"retired":"seller_displays_available";
  // Even a match here is NOT sufficient to change production eligibility.
  const matched=observation.observation===expected;
  return {
    id:record.id,sku:record.sku,
    observation:observation.observation,
    status:matched?"matched_seller_lifecycle":"needs_review",
    reason:observation.reason,
    // Aggregate shape counters only on H1 failures; never publish source text.
    ...(observation.heading_shape ? {heading_shape:observation.heading_shape} : {}),
    production_eligible:false,
    ...(matched?{}:{expected_observation:expected})
  };
}
export async function auditRollatorPublicListings(fetchImpl=fetch,data=readData()){
  const records=monitoredRollatorListings(data);
  const results=[];
  for(const record of records){
    let observation;
    try{
      const response=await fetchImpl(record.url,{
        method:"GET",redirect:"error",cache:"no-store",
        headers:{Accept:"text/html","Cache-Control":"no-cache"},
        signal:AbortSignal.timeout(15000)
      });
      const length=Number(response.headers?.get("content-length"));
      const contentType=response.headers?.get("content-type")??"";
      const html=response.status===200&&
        /^text\/html/i.test(contentType)&&
        (!Number.isFinite(length)||length<=1500000)
        ?await response.text():"";
      observation=classifyRollatorResponse({status:response.status,url:response.url,html},record);
    }catch{
      observation={id:record.id,observation:"unverifiable",reason:"merchant_network_unavailable"};
    }
    results.push(assessRollatorLifecycle(observation,record));
  }
  return {
    kind:"public_rollator_exact_sku_lifecycle",
    reviewed_snapshot:data.reviewedOn,
    checked_count:results.length,
    matched:results.filter(x=>x.status==="matched_seller_lifecycle").length,
    needs_review:results.filter(x=>x.status==="needs_review").length,
    seller_unavailable:results.filter(x=>x.observation==="seller_displays_unavailable").length,
    active_product_offers_changed:0,
    limitations:RESTRICTION,
    results
  };
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  const summary=await auditRollatorPublicListings();
  process.stdout.write("ZP_ROLLATOR_SELLER_LIFECYCLE "+JSON.stringify(summary)+"\n");
  if(summary.needs_review)
    process.stdout.write("::warning::Exact seller lifecycle changed or could not be verified; do not alter SKU, affiliate links, or product fit automatically.\n");
}
