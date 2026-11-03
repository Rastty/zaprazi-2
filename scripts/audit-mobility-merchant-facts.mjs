/**
 * Read-only monitoring of canonical PUBLIC merchant product pages for the two
 * approved BESCO walkers. Never resolves affiliate tracking/deeplinks or
 * invokes a product offer in an Advisor. This is evidence triage, NOT an
 * availability, conversion, commission or fit confirmation.
 */
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";

const EXACT_TARGETS=Object.freeze({
  "besco-wa17":{
    host:"www.rehabilitacnipomucky.cz",
    pathname:"/besco-ctyrbodove-choditko-skladaci/",
    sku:"WA17",
    name:/besco\s+čtyřbodové\s+chodítko/i
  },
  "besco-wa21":{
    host:"www.rehabilitacnipomucky.cz",
    pathname:"/besco-dvoukolove-choditko-skladaci/",
    sku:"WA21",
    name:/besco\s+dvoukolové\s+chodítko/i
  }
});

export function monitoredOffers(products=MOBILITY_PRODUCTS){
  return Object.entries(EXACT_TARGETS).map(([id,target])=>{
    const product=products.find(p=>p.id===id);
    if(!product||!product.productionEligible||product.identityStatus!=="verified")
      throw new Error("Monitored product not production-verified: "+id);
    const offer=product.offers.find(o=>o.affiliateKey==="rehabilitacni-pomucky-cz:"+id);
    if(!offer||offer.affiliateUrl!==null||!offer.checkedAt||
       offer.merchantId!=="rehabilitacni-pomucky-cz")
      throw new Error("Missing canonical non-affiliate merchant evidence: "+id);
    const url=new URL(offer.url);
    if(url.protocol!=="https:"||url.hostname!==target.host||
       url.pathname!==target.pathname||url.search||url.hash||
       url.username||url.password||url.port)
      throw new Error("Unsafe/noncanonical public merchant target: "+id);
    return {id,url:url.href,sku:target.sku,name:target.name,weightKg:product.facts.weightKg,
      checkedAt:offer.checkedAt};
  });
}

export function visibleMerchantText(html){
  return String(html).replace(/<!--[\s\S]*?-->/g," ")
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;|&#xA0;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&quot;/gi,'"')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/\s+/g," ").trim();
}

export function reviewMerchantHtml(html,record){
  const heading=String(html).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]??"";
  const title=visibleMerchantText(heading);
  const text=visibleMerchantText(html);
  const reasons=[];
  if(!record.name.test(title)||!new RegExp("\\bKód\\s*:\\s*"+record.sku+"\\b","i").test(text))
    reasons.push("product_identity_unverified");
  const specific=text.match(/\bHmotnost chodítka\s*:\s*(\d+(?:[,.]\d+)?)\s*kg\b/i);
  const general=text.match(/\bHmotnost\s*:\s*(\d+(?:[,.]\d+)?)\s*kg\b/i);
  const parsed=x=>x?Number(x[1].replace(",",".")):null;
  const weightSpecific=parsed(specific),weightGeneral=parsed(general);
  if(weightSpecific==null||weightSpecific!==record.weightKg)
    reasons.push("specific_weight_not_matching_catalog");
  if(weightGeneral!=null&&weightSpecific!=null&&weightGeneral!==weightSpecific)
    reasons.push("merchant_weight_fields_conflict");
  return {id:record.id,sku:record.sku,status:reasons.length?"review_required":"consistent_visible_evidence",
    reasons,weightCatalogKg:record.weightKg,weightSpecificKg:weightSpecific,
    weightGeneralKg:weightGeneral};
}

export function classifyMerchantResponse(response,record){
  const {status,url,html}=response;
  // Do not follow redirects or accept another host/catalog page as this SKU.
  if(status!==200||url!==record.url)
    return {id:record.id,sku:record.sku,
      status:status===403||status===429?"unverifiable":"review_required",
      reasons:[status===403||status===429?"blocked_by_merchant":"unexpected_http_or_redirect"]};
  if(typeof html!=="string"||html.length<500||html.length>1500000)
    return {id:record.id,sku:record.sku,status:"unverifiable",reasons:["unexpected_page_body"]};
  return reviewMerchantHtml(html,record);
}

export async function auditMobilityMerchantFacts(fetcher=fetch){
  const records=monitoredOffers();
  const results=[];
  for(const record of records){
    try{
      const response=await fetcher(record.url,{
        method:"GET",redirect:"manual",
        headers:{Accept:"text/html", "User-Agent":"ZaPrazi-QualityEvidenceAudit/1.0 (read-only product pages; no affiliate link)"},
        signal:AbortSignal.timeout(15000)
      });
      const contentType=response.headers?.get("content-type")??"";
      const declaredLength=Number(response.headers?.get("content-length"));
      const html=response.status===200&&/^text\/html/i.test(contentType)&&
          (!Number.isFinite(declaredLength)||declaredLength<=1500000)
        ?await response.text():"";
      results.push(classifyMerchantResponse({status:response.status,url:response.url,html},record));
    }catch{
      results.push({id:record.id,sku:record.sku,status:"unverifiable",
        reasons:["merchant_network_unavailable"]});
    }
  }
  return {kind:"mobility_merchant_public_identity_and_weight",
    note:"Public GET only, no affiliate redirects or transactions. No claim about inventory or affiliate commissions.",
    results};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const report=await auditMobilityMerchantFacts();
  console.log("ZP_MOBILITY_MERCHANT_EVIDENCE "+JSON.stringify(report));
  if(report.results.some(x=>x.status!=="consistent_visible_evidence"))
    console.warn("::warning::Merchant facts require review or could not be independently checked; do not auto-change product specifications or ranking.");
}
