#!/usr/bin/env node
/**
 * Existing eHUB (non-CJ) self-care merchant observations. Merchant PAGE
 * only: no affiliate clicks, referral tokens, visitor data or WordPress writes.
 * A title/stock label is NOT proof of the exact factory REF, physical stock,
 * commission eligibility, approval, or the matching eHUB tracking destination.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {adlSelfCareCandidates} from "../src/adl/engine.js";

const LIMIT_BYTES=1500000;
const SOURCE_KEYS=["upcup","beatIt","theomatik","openIt"];
const clean=html=>String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
  .replace(/<[^>]+>/g," ")
  .replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&")
  .replace(/\s+/g," ").trim();
const titleKey=s=>clean(s).toLocaleLowerCase("cs-CZ")
  .replace(/[–—−]/g,"-").replace(/\s*-\s*/g," - ")
  .replace(/\s+/g," ").trim();

export function ehubAdlTargets(){
  if(Object.keys(adlSelfCareCandidates).length!==4)
    throw Error("EHUB_ADL_SOURCE_COUNT_CHANGED");
  return SOURCE_KEYS.map(k=>{
    const c=adlSelfCareCandidates[k];
    if(!c||c.merchant!=="RehaVita.cz"||!/^15-05010[1235]$/.test(c.sku)||
       c.affiliateKey!=="rehavita-cz:"+c.id.replace(/^rehavita-/,"")||
       typeof c.sourceUrl!=="string")
      throw Error("EHUB_ADL_SOURCE_CONTRACT_CHANGED");
    const url=new URL(c.sourceUrl);
    if(url.protocol!=="https:"||url.hostname!=="www.rehavita.cz"||
       url.search||url.hash||url.username||url.password||url.port||
       !/^\/[a-z0-9-]+\/$/.test(url.pathname))
      throw Error("EHUB_ADL_CANONICAL_TARGET_CHANGED");
    return {id:c.id,sku:c.sku,title:c.product,url:c.sourceUrl,
      checkedAt:c.checkedAt};
  });
}

export function classifyEhubAdlHtml(html,record){
  const unknown=reason=>({id:record.id,state:"unverifiable",reason,
    exactManufacturerSkuVerified:false,productionOfferChanged:false});
  if(typeof html!=="string"||html.length<250||html.length>LIMIT_BYTES)
    return unknown("unexpected_html_size");
  const headings=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if(headings.length<1||headings.length>3)
    return unknown("h1_count_outside_bounded_scope");
  const matched=headings.filter(x=>titleKey(x[1])===titleKey(record.title));
  if(matched.length!==1)
    return unknown("seller_title_not_exact_unique");
  const anchor=matched[0].index+matched[0][0].length;
  const slice=html.slice(anchor);
  const boundary=slice.search(/Související\s+produkty|Detailní\s+popis\s+produktu/i);
  if(boundary<0||boundary>18000)
    return unknown("product_card_boundary_not_found");
  const zone=clean(slice.slice(0,boundary));
  if(zone.length>13000)
    return unknown("product_card_scope_too_large");
  const unavailable=/(?:není\s+skladem|vyprodáno|dočasně\s+nedostupné|zboží\s+(?:je\s+)?na\s+cestě)/i.test(zone);
  const positive=/(?:^|\s)Skladem(?:\s|$)/i.test(zone.replace(
    /(?:není\s+skladem|vyprodáno|dočasně\s+nedostupné|zboží\s+(?:je\s+)?na\s+cestě)/gi," ")) &&
    /Přidat\s+do\s+košíku/i.test(zone);
  if(unavailable&&positive)return unknown("contradictory_merchant_stock_labels");
  return {id:record.id,
    state:unavailable?"seller_displays_unavailable":
      positive?"seller_displays_available":"stock_label_unverifiable",
    reason:unavailable?"seller_product_unavailable_label_only":
      positive?"seller_product_available_label_only":"no_trusted_stock_label",
    // Merchant title match only. Merchant SKU may not be exposed in HTML;
    // exact REF and eHUB payout rights still require separate confirmation.
    exactManufacturerSkuVerified:false,productionOfferChanged:false};
}

export function classifyEhubAdlResponse(response,record){
  if(response?.status!==200||response?.url!==record.url)
    return {id:record.id,state:"unverifiable",
      reason:response?.status===403||response?.status===429?
        "merchant_access_blocked":"canonical_or_http_mismatch",
      exactManufacturerSkuVerified:false,productionOfferChanged:false};
  return classifyEhubAdlHtml(response.html,record);
}

export async function auditEhubAdlListings(fetchImpl=fetch){
  const rows=[];
  for(const record of ehubAdlTargets()){
    let observed;
    try{
      const response=await fetchImpl(record.url,{
        method:"GET",redirect:"error",cache:"no-store",
        headers:{Accept:"text/html","Cache-Control":"no-cache"},
        signal:AbortSignal.timeout(15000)
      });
      const contentType=response.headers?.get("content-type")??"";
      const sizeHeader=response.headers?.get("content-length");
      const declaredSize=sizeHeader==null?NaN:Number(sizeHeader);
      const html=response.status===200&&/^text\/html(?:;|$)/i.test(contentType)&&
        (!Number.isFinite(declaredSize)||declaredSize<=LIMIT_BYTES)
        ?await response.text():"";
      observed=classifyEhubAdlResponse({
        status:response.status,url:response.url,html
      },record);
    }catch{
      observed={id:record.id,state:"unverifiable",
        reason:"merchant_network_unavailable",exactManufacturerSkuVerified:false,
        productionOfferChanged:false};
    }
    rows.push(observed);
  }
  return {
    kind:"ehub_adl_existing_exact_seller_page_labels",
    checked_count:rows.length,
    seller_displays_available:rows.filter(x=>x.state==="seller_displays_available").length,
    seller_displays_unavailable:rows.filter(x=>x.state==="seller_displays_unavailable").length,
    needs_review:rows.filter(x=>!["seller_displays_available","seller_displays_unavailable"].includes(x.state)).length,
    supplier_ref_verified:0,
    affiliate_tracking_requests:0,
    wordpress_writes:0,
    offer_dates_refreshed:0,
    production_offer_changes:0,
    limitations:"Public merchant page title/stock label, not physical inventory, source SKU/REF, merchant feed, approved eHUB click URL, or commission proof. Original checkedAt values are not refreshed.",
    results:rows
  };
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  const receipt=await auditEhubAdlListings();
  process.stdout.write("ZP_EHUB_ADL_SELLER_EVIDENCE "+JSON.stringify(receipt)+"\n");
  if(receipt.needs_review||receipt.seller_displays_unavailable)
    process.stdout.write("::warning::Review eHUB ADL merchant listing labels; never alter affiliate links or product fit automatically.\n");
}
