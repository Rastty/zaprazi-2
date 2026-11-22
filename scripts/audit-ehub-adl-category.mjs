#!/usr/bin/env node
/**
 * One bounded GET of the RehaVita self-care CATEGORY (Shoptet).
 * An exact seller product-card SKU, canonical link and stock label are NOT
 * manufacturer identity, physical stock, publisher deeplink, attribution
 * or authorization to change offers/medical product fit.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {ehubAdlTargets} from "./audit-ehub-adl-listings.mjs";

export const EHUB_CATEGORY_URL="https://www.rehavita.cz/pomucky-pro-sobestacnost/";
const MAX_HTML=1500000,MAX_CARD=26000;
const SKU_PATTERN=/^15-05010[1235]$/;
const UNAVAILABLE=/(?:není\s+skladem|vyprodáno|dočasně\s+nedostupné)/i;
const AVAILABLE=/(?:^|\s)Skladem(?:\s|$)/i;
function attr(tag,key){
  const match=tag.match(new RegExp("(?:^|\\s)"+key+"\\s*=\\s*([\"'])(.*?)\\1","i"));
  return match?match[2]:null;
}
function plain(html){
  return String(html).replace(/<!--[\s\S]*?-->/g," ")
    .replace(/<(?:script|style|template)\b[^>]*>[\s\S]*?<\/(?:script|style|template)\s*>/gi," ")
    .replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();
}
function closingDiv(html,start){
  const tags=/<\/?div\b[^>]*>/gi;
  tags.lastIndex=start;
  let depth=0,opened=false;
  for(const tag of html.matchAll(tags)){
    const close=/^<\//.test(tag[0]);
    if(!opened&&!close&&tag.index===start)opened=true;
    if(!opened)continue;
    depth+=close?-1:1;
    if(depth===0)return tag.index+tag[0].length;
    if(depth<0||tag.index-start>MAX_CARD)return -1;
  }
  return -1;
}
export function shoptetProductCards(html){
  if(typeof html!=="string"||html.length<250||html.length>MAX_HTML)
    return {valid:false,cards:[]};
  // Shoptet documented div.p[data-micro="product"], not broad text matches.
  const starts=[...html.matchAll(/<div\b[^>]*>/gi)].filter(m=>
    attr(m[0],"data-micro")==="product"&&
    (attr(m[0],"class")||"").split(/\s+/).includes("p"));
  if(starts.length<1||starts.length>60)return {valid:false,cards:[]};
  const cards=[];
  for(const entry of starts){
    const end=closingDiv(html,entry.index);
    if(end<0||end-entry.index>MAX_CARD)return {valid:false,cards:[]};
    cards.push(html.slice(entry.index,end));
  }
  return {valid:true,cards};
}
function hasCanonicalSellerLink(card,raw){
  const wanted=new URL(raw).href;
  const matches=[...card.matchAll(/<a\b[^>]*>/gi)].filter(tag=>{
    const href=attr(tag[0],"href");
    if(!href||/^\s*(?:#|javascript:)/i.test(href))return false;
    try{
      const u=new URL(href,EHUB_CATEGORY_URL);
      return u.href===wanted&&!u.search&&!u.hash&&!u.username&&!u.password;
    }catch{return false;}
  });
  return matches.length>0&&matches.length<=5;
}
function hasExactSku(card,sku){
  // SKU is a validated public code containing only numbers and dashes.
  const match=new RegExp("(?:^|[^a-zA-Z0-9-])"+sku+"(?:$|[^a-zA-Z0-9-])");
  return match.test(plain(card))||
    [...card.matchAll(/\bdata-micro-sku\s*=\s*(["'])(.*?)\1/gi)].some(x=>x[2]===sku);
}
function unknown(record,reason){
  return {id:record.id,state:"unverifiable",reason,
    exactSellerSkuObserved:false,exactManufacturerSkuVerified:false,
    publisherDeeplinkVerified:false,productionOfferChanged:false};
}
export function classifyEhubCategory(html,targets=ehubAdlTargets()){
  if(!Array.isArray(targets)||targets.length!==4||
    targets.some(t=>!t||!SKU_PATTERN.test(t.sku)||typeof t.url!=="string")||
    new Set(targets.map(t=>t.sku)).size!==4)
    throw Error("EHUB_CATEGORY_TARGET_CONTRACT_CHANGED");
  const {valid,cards}=shoptetProductCards(html);
  if(!valid)return targets.map(t=>unknown(t,"category_product_cards_unavailable"));
  return targets.map(t=>{
    const matched=cards.filter(c=>hasCanonicalSellerLink(c,t.url));
    if(matched.length<1||matched.length>3)
      return unknown(t,"exact_category_product_link_not_unique");
    if(matched.some(c=>!hasExactSku(c,t.sku)))
      return unknown(t,"seller_sku_missing_or_mismatch");
    const labels=matched.map(c=>{
      const text=plain(c),no=UNAVAILABLE.test(text);
      const yes=AVAILABLE.test(text.replace(UNAVAILABLE," "));
      if(no&&yes)return "contradictory";
      return no?"seller_displays_unavailable":
        yes?"seller_displays_available":"stock_label_unverifiable";
    });
    if(new Set(labels).size!==1||labels[0]==="contradictory")
      return unknown(t,"conflicting_category_stock_labels");
    return {id:t.id,state:labels[0],
      reason:labels[0]==="seller_displays_available"?"seller_product_card_available_label":
        labels[0]==="seller_displays_unavailable"?"seller_product_card_unavailable_label":
        "seller_product_card_no_stock_label",
      exactSellerSkuObserved:true,exactManufacturerSkuVerified:false,
      publisherDeeplinkVerified:false,productionOfferChanged:false};
  });
}
export function classifyEhubCategoryResponse(res,targets=ehubAdlTargets()){
  if(res?.status!==200||res?.url!==EHUB_CATEGORY_URL)
    return targets.map(t=>unknown(t,res?.status===403||res?.status===429?
      "merchant_access_blocked":"category_http_or_canonical_mismatch"));
  return classifyEhubCategory(res.html,targets);
}
export async function auditEhubCategory(fetchImpl=fetch){
  const targets=ehubAdlTargets();
  let rows;
  try{
    const response=await fetchImpl(EHUB_CATEGORY_URL,{
      method:"GET",redirect:"error",cache:"no-store",
      headers:{Accept:"text/html","Cache-Control":"no-cache"},
      signal:AbortSignal.timeout(15000)
    });
    const ct=response.headers?.get("content-type")??"";
    const rawSize=response.headers?.get("content-length");
    const size=rawSize==null?NaN:Number(rawSize);
    const html=response.status===200&&/^text\/html(?:;|$)/i.test(ct)&&
      (!Number.isFinite(size)||size<=MAX_HTML)?await response.text():"";
    rows=classifyEhubCategoryResponse({status:response.status,url:response.url,html},targets);
  }catch{rows=targets.map(t=>unknown(t,"merchant_network_unavailable"));}
  return {
    kind:"ehub_adl_single_shoptet_category_exact_seller_sku",
    checked_count:rows.length,
    exact_seller_sku_observed:rows.filter(x=>x.exactSellerSkuObserved).length,
    seller_displays_available:rows.filter(x=>x.state==="seller_displays_available").length,
    seller_displays_unavailable:rows.filter(x=>x.state==="seller_displays_unavailable").length,
    needs_review:rows.filter(x=>x.state==="unverifiable"||x.state==="stock_label_unverifiable").length,
    exact_manufacturer_ref_verified:0,publisher_deeplinks_verified:0,
    approved_commissions_verified:0,affiliate_tracking_requests:0,
    wordpress_writes:0,offer_dates_refreshed:0,production_offer_changes:0,
    limitations:"Exact public merchant CATEGORY SKU+link+stock label within bounded Shoptet product card only; not manufacturer variant, physical inventory, authorized eHUB publisher deeplink, order, attribution, commission or stock guarantee. No source dates refreshed.",
    results:rows
  };
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  const report=await auditEhubCategory();
  process.stdout.write("ZP_EHUB_CATEGORY_SKU_EVIDENCE "+JSON.stringify(report)+"\n");
  if(report.needs_review||report.seller_displays_unavailable)
    process.stdout.write("::warning::eHUB seller/category evidence incomplete; keep affiliate and product fit holds.\n");
}
