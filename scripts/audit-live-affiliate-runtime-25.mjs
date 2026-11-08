#!/usr/bin/env node
/**
 * Read-only production check: did WordPress actually expose the 25 configured
 * publisher routes to the user's browser, consistent with the exact source
 * inventory and an approved tracking network?
 *
 * Exactly two SAME-ORIGIN GET requests. NEVER follow an affiliate URL,
 * fire click events, log tracking values, or send Advisor answer data.
 * This is URL/configuration hygiene, NOT publisher attribution/checkout proof.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {extractCanonicalTargets} from "./audit-canonical-merchant-targets.mjs";

export const ORIGIN="https://zaprazi.cz";
const MAX_HTML=1_800_000, MAX_JSON=75_000;
export const APPROVED_HOSTS=new Set([
  "kqzyfj.com","dpbolvw.net","anrdoezrs.net",
  "tkqlhce.com","jdoqocy.com","ehub.cz"
]);
const CJ_HOSTS=new Set([...APPROVED_HOSTS].filter(h=>h!=="ehub.cz"));
const FORBIDDEN_PARAMS=new Set([
  "answer","answers","environment","supportneed","canliftwalker",
  "handbrakes","seatneeded","tightspace","transportneed","duration",
  "diagnosis","diagnos","health","medical","condition","weight",
  "width","height","brakes","support","disability","healthprofile",
  "birthdate","birthnumber","email","phone","address","patient"
]);
function fail(reason,slot="") {
  // Do not interpolate third-party URLs or tracking values in errors.
  throw new Error("LIVE_AFFILIATE_RUNTIME_"+reason+(slot?" ["+slot+"]":""));
}

function extractJsonObject(body,start){
  if(body[start]!=="{")fail("MAP_NOT_JSON_OBJECT");
  let depth=0,quoted=false,escaped=false;
  for(let i=start;i<body.length;i++){
    const char=body[i];
    if(quoted){
      if(escaped){escaped=false;continue;}
      if(char==="\\"){escaped=true;continue;}
      if(char==='"')quoted=false;
    }else if(char==='"'){quoted=true;}
    else if(char==="{"){depth++;}
    else if(char==="}"){
      depth--;
      if(depth===0){
        const raw=body.slice(start,i+1);
        if(raw.length>120_000)fail("MAP_TOO_LARGE");
        try{return JSON.parse(raw);}
        catch{fail("MAP_INVALID_JSON");}
      }
    }
  }
  fail("MAP_INCOMPLETE");
}

export function extractPublicAffiliateMap(html){
  const cleaned=String(html).replace(/<!--[\s\S]*?-->/g,"");
  const scriptTags=[...cleaned.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  const candidates=scriptTags.filter(([,attrs,body])=>
    /\bid\s*=\s*(["'])zaprazi-runtime-config-js-after\1/i.test(attrs) &&
    /\bwindow\.ZaPraziRuntime\s*=\s*Object\.assign\s*\(/.test(body));
  if(candidates.length!==1)fail("INLINE_CONFIG_NOT_UNIQUE");
  const body=candidates[0][2];
  const tags=[...body.matchAll(/\baffiliateMap\s*:\s*/g)];
  if(tags.length!==1)fail("MAP_NOT_UNIQUE");
  const marker=tags[0];
  const brace=marker.index+marker[0].length;
  const map=extractJsonObject(body,brace);
  if(map===null||Array.isArray(map)||typeof map!=="object")fail("MAP_NOT_OBJECT");
  return map;
}

function approvedHost(host,approved) {
  const normalized=host.toLowerCase().replace(/^www\./,"");
  // Only exact approved redirect hosts; prevent fake subdomains/suffixes.
  return approved.has(normalized);
}

export function classifyPublicAffiliateMap(map,targets,readiness){
  if(!Array.isArray(targets)||targets.length!==25)fail("SOURCE_NOT_25");
  if(!readiness||readiness.integrity!=="ok"||
     readiness.configured_total!==25||readiness.slot_total!==25)fail("READINESS_NOT_25");
  if(map===null||typeof map!=="object"||Array.isArray(map))fail("MAP_NOT_OBJECT");
  const entries=Object.entries(map);
  if(entries.length!==25)fail("RUNTIME_COUNT_MISMATCH");
  const canonical=new Map(targets.map(t=>[t.key,t]));
  const networkCounts={cj:0,ehub:0};
  const merchantCounts={};
  for(const [key,href] of entries){
    if(!canonical.has(key))fail("UNKNOWN_OR_MISSING_SLOT",key);
    if(typeof href!=="string"||href.length<14||href.length>12_000)fail("URL_LENGTH",key);
    let url;
    try{url=new URL(href);}catch{fail("URL_INVALID",key);}
    if(url.protocol!=="https:"||url.username||url.password||
       url.port||url.hash||!url.hostname||url.pathname==="/../")
      fail("URL_UNSAFE",key);
    if(/(?:^|[/=?&#])(?:undefined|null)(?:$|[/=?&#])/i.test(href))
      fail("URL_UNRESOLVED",key);
    for(const name of url.searchParams.keys()){
      if(FORBIDDEN_PARAMS.has(name.toLowerCase().replace(/[-_]/g,"")) ||
         /^(?:answers?|diagnos(?:is|es)?|health|medical|patient|disability|birth|email|phone|address)/.test(name.toLowerCase().replace(/[^a-z0-9]/g,"")))
        fail("URL_SENSITIVE_PARAMETER",key);
    }
    const merchant=key.split(":")[0];
    const isEhub=merchant==="rehavita-cz";
    if(!approvedHost(url.hostname,isEhub?new Set(["ehub.cz"]):CJ_HOSTS))
      fail("NETWORK_MISMATCH",key);
    if(url.href===canonical.get(key).url)fail("PLAIN_PRODUCT_NOT_AFFILIATE",key);
    merchantCounts[merchant]=(merchantCounts[merchant]||0)+1;
    networkCounts[isEhub?"ehub":"cj"]++;
  }
  for(const item of targets)if(!Object.hasOwn(map,item.key))
    fail("UNKNOWN_OR_MISSING_SLOT",item.key);
  return {
    scope:"public_browser_exposed_affiliate_configuration_only",
    release:readiness.release,
    state:"runtime_slots_present_network_hygiene_pass",
    configured:entries.length,
    networkCounts,
    merchantCounts,
    attributionVerified:false,
    productDestinationVerified:false,
    publisherConversionVerified:false,
    note:"Tracking URLs and parameters intentionally omitted. No redirect, click, sale or commission was tested."
  };
}

async function readBounded(response,max){
  const lengthRaw=response.headers?.get?.("content-length");
  if(lengthRaw!==null&&lengthRaw!==undefined){
    const n=Number(lengthRaw);
    if(Number.isFinite(n)&&n>max)fail("RESPONSE_TOO_LARGE");
  }
  if(!response.body?.getReader){
    const text=await response.text();
    if(text.length>max)fail("RESPONSE_TOO_LARGE");
    return text;
  }
  const reader=response.body.getReader();
  const decoder=new TextDecoder();
  let bytes=0,result="";
  try{
    while(true){
      const part=await reader.read();
      if(part.done)break;
      bytes+=part.value.byteLength;
      if(bytes>max)fail("RESPONSE_TOO_LARGE");
      result+=decoder.decode(part.value,{stream:true});
    }
    return result+decoder.decode();
  }finally{try{await reader.cancel();}catch{}}
}

async function getOwn(path,mime,max,fetchImpl){
  const endpoint=ORIGIN+path;
  let response;
  try{
    response=await fetchImpl(endpoint,{
      method:"GET",redirect:"manual",cache:"no-store",
      headers:{Accept:mime,"User-Agent":"ZaPrazi-ReadOnly-AffiliateRuntime-QA/1.0"},
      signal:AbortSignal.timeout(15000)
    });
  }catch{fail("OWN_ORIGIN_NETWORK");}
  if(response.status!==200)fail("OWN_ORIGIN_HTTP_"+response.status);
  if(response.url && response.url!==endpoint)fail("OWN_ORIGIN_REDIRECT");
  if(!String(response.headers?.get?.("content-type")||"").includes(mime))
    fail("OWN_ORIGIN_CONTENT_TYPE");
  return readBounded(response,max);
}

export async function auditLiveRuntime(fetchImpl=fetch,php=null,release=null){
  const source=php??readFileSync(new URL("../functions.php",import.meta.url),"utf8");
  const style=release??readFileSync(new URL("../style.css",import.meta.url),"utf8")
    .match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m)?.[1];
  if(!style)fail("SOURCE_RELEASE_MISSING");
  const targets=extractCanonicalTargets(source);
  const json=await getOwn("/wp-json/zaprazi/v1/affiliate-readiness","application/json",MAX_JSON,fetchImpl);
  let readiness;
  try{readiness=JSON.parse(json);}catch{fail("READINESS_INVALID_JSON");}
  if(readiness.release!==style)fail("SOURCE_LIVE_RELEASE_MISMATCH");
  const html=await getOwn("/","text/html",MAX_HTML,fetchImpl);
  const map=extractPublicAffiliateMap(html);
  return classifyPublicAffiliateMap(map,targets,readiness);
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditLiveRuntime().then(result=>{
    console.log("LIVE_AFFILIATE_RUNTIME_PASS "+JSON.stringify(result));
  }).catch(error=>{
    // Only our own code-only error strings; do not echo raw network response.
    const reason=String(error.message).startsWith("LIVE_AFFILIATE_RUNTIME_")
      ?error.message:"LIVE_AFFILIATE_RUNTIME_UNKNOWN_ERROR";
    console.error(reason);
    process.exitCode=1;
  });
}
