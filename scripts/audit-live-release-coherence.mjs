/**
 * Read-only preflight: catch mixed WordPress theme releases before expensive
 * production Advisor browser QA. No forms, health answers, merchant redirects,
 * analytics, writes or URLs with query parameters are used.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

export const RELEASE_CHECK_PATHS=Object.freeze([
  "/", "/koupelna-a-wc/", "/navrat-z-nemocnice/",
  "/sprchovaci-zidle-pro-seniory/"
]);
const ORIGIN="https://zaprazi.cz";
const RELEASE_PATTERN=/^\d+\.\d+\.\d+$/;
const fail=(message)=>{throw new Error(message);};

function getMeta(html,name){
  if(typeof html!=="string")fail("Invalid page response");
  const matches=[];
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
    const attributes={};
    for(const match of tag.matchAll(/([a-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi))
      attributes[match[1].toLowerCase()]=match[2]??match[3];
    if(attributes.name===name)matches.push(attributes.content);
  }
  if(matches.length!==1||typeof matches[0]!=="string")
    fail("Missing or duplicate theme metadata");
  return matches[0];
}

export function readReleaseMarkers(html){
  const release=getMeta(html,"zaprazi-release");
  const integrity=getMeta(html,"zaprazi-integrity");
  if(!RELEASE_PATTERN.test(release))fail("Malformed theme release metadata");
  if(integrity!=="ok")fail("Page integrity is not OK");
  return {release,integrity};
}

function verifyReadiness(data,expected){
  if(!data||typeof data!=="object"||Array.isArray(data))
    fail("Invalid readiness response");
  if(data.release!==expected)fail("Readiness release does not match expected live release");
  if(data.integrity!=="ok")fail("Readiness integrity is not OK");
  if(!Number.isSafeInteger(data.slot_total)||data.slot_total<25||
      data.configured_total!==data.slot_total)
    fail("Affiliate readiness slots are incomplete");
  if(!data.groups||typeof data.groups!=="object"||Array.isArray(data.groups))
    fail("Readiness groups are missing");
  for(const group of Object.values(data.groups)){
    if(!group||group.configured!==group.total||
        !Array.isArray(group.missing)||group.missing.length)
      fail("Affiliate readiness group is incomplete");
  }
}

export function verifyReleaseCoherence({before,after,pages,expected}){
  if(typeof expected!=="string"||!RELEASE_PATTERN.test(expected))
    fail("Invalid expected release");
  verifyReadiness(before,expected);
  if(!Array.isArray(pages)||pages.length!==RELEASE_CHECK_PATHS.length)
    fail("Incomplete release page sample");
  const seen=new Set();
  for(const entry of pages){
    if(!entry||!RELEASE_CHECK_PATHS.includes(entry.path)||seen.has(entry.path))
      fail("Invalid or duplicate release sample path");
    seen.add(entry.path);
    const markers=readReleaseMarkers(entry.html);
    if(markers.release!==expected)
      fail("Mixed release: public page differs from readiness/source");
  }
  verifyReadiness(after,expected);
  return {release:expected,integrity:"ok",pages:seen.size,
    affiliate_slots:after.configured_total,readiness_checks:2};
}

async function get(url,accept){
  const response=await fetch(url,{
    method:"GET",redirect:"error",cache:"no-store",
    headers:{Accept:accept,"Cache-Control":"no-cache"},
    signal:AbortSignal.timeout(20000)
  });
  if(response.status!==200)fail("Production preflight HTTP status is not 200");
  return response;
}

export async function auditLiveReleaseCoherence(){
  const readinessUrl=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
  const before=await (await get(readinessUrl,"application/json")).json();
  const pages=[];
  for(const path of RELEASE_CHECK_PATHS){
    const html=await (await get(ORIGIN+path,"text/html")).text();
    pages.push({path,html});
  }
  const after=await (await get(readinessUrl,"application/json")).json();
  return verifyReleaseCoherence({before,after,pages,expected:EXPECTED_LIVE_RELEASE});
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{
    const result=await auditLiveReleaseCoherence();
    process.stdout.write("LIVE_RELEASE_COHERENCE "+JSON.stringify(result)+"\n");
  }catch{
    // Never echo untrusted page bodies, URLs, query strings or API responses.
    process.stderr.write("LIVE_RELEASE_COHERENCE_FAILED: public release, integrity or readiness is inconsistent; STOP deploy acceptance and recheck WordPress Pull + Deploy.\n");
    process.exitCode=1;
  }
}
