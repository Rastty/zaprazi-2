#!/usr/bin/env node
/**
 * Zápraží's bounded IndexNow adapter for two 0.8.248 materially edited pages.
 * Adapted from the existing ITSpace IndexNow release proof pattern in Core.
 * No scheduled jobs; no calls to merchant, CJ/eHUB or WordPress write APIs.
 * This command does NOT assert crawl, indexation, rankings or revenue.
 *
 * A key under /wp-content/themes/... CANNOT prove ownership of root pages.
 * The key must be served at exactly https://zaprazi.cz/{key}.txt.
 * --dry-run is offline. --probe uses four SAME-ORIGIN GETs.
 * --submit additionally makes ONE external POST only after all live gates.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {requiredDecisionPaths} from "./audit-public-sitemap.mjs";
import {auditLiveTransportMobility248} from "./audit-live-transport-mobility-248.mjs";

const ORIGIN="https://zaprazi.cz";
const SEZNAM="https://search.seznam.cz/indexnow";
const READY=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
const RELEASE="0.8.248";
export const RELEASE_CHANGED_PATHS=Object.freeze([
  "/prevoz-seniora-k-lekari/",
  "/schody-pro-seniora-doma/"
]);
const KEY=/^[A-Za-z0-9-]{8,128}$/;
const err=s=>{throw new Error("ZP_INDEXNOW_"+s);};
const graphPath=new URL("../config/growth-state.json",import.meta.url);

export function validateCandidatePaths(paths=RELEASE_CHANGED_PATHS){
  if(!Array.isArray(paths)||paths.length!==2||
     new Set(paths).size!==2||
     paths.some(path=>typeof path!=="string"||
       !/^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(path)||
       !requiredDecisionPaths.includes(path))||
     paths.some((path,i)=>path!==RELEASE_CHANGED_PATHS[i]))
    err("UNREVIEWED_CANONICALS");
  return paths.map(path=>ORIGIN+path);
}

export function indexNowKeyLocation(key){
  if(typeof key!=="string"||!KEY.test(key))err("INVALID_KEY");
  // Always domain-root. Seznam keyLocation scoped to a theme subdirectory
  // would NOT authorize the edited root-level decision-guide pages.
  return ORIGIN+"/"+key+".txt";
}

export function releaseGate(state,source=SOURCE_THEME_RELEASE){
  validateCandidatePaths();
  if(source!==RELEASE)return "source_release_requires_manual_review";
  const qa=state?.nodes?.safety_qa;
  if(qa?.verifiedRelease!==RELEASE||qa?.status!=="verified"||
      typeof qa.evidenceUrl!=="string"||
      !/^https:\/\/github\.com\/Rastty\/zaprazi-2\/actions\/runs\/[1-9][0-9]{5,15}$/.test(qa.evidenceUrl))
    return "pending_independent_wp_release_qa";
  return "eligible_for_live_preflight";
}

export function indexNowPayload(key,paths=RELEASE_CHANGED_PATHS){
  const keyLocation=indexNowKeyLocation(key);
  const urlList=validateCandidatePaths(paths);
  return Object.freeze({host:"zaprazi.cz",key,keyLocation,urlList});
}

async function ownGet(url,mime,fetchImpl){
  let response;
  try{response=await fetchImpl(url,{
    method:"GET",redirect:"error",cache:"no-store",
    headers:{Accept:mime,"Cache-Control":"no-cache"},
    signal:AbortSignal.timeout(15000)
  });}catch{err("OWN_ORIGIN_UNAVAILABLE");}
  if(response?.status!==200||(response.url&&response.url!==url))
    err("OWN_ORIGIN_HTTP_OR_REDIRECT");
  const length=Number(response.headers?.get?.("content-length"));
  if(Number.isFinite(length)&&length>12000)err("OWN_ORIGIN_RESPONSE_TOO_LARGE");
  const text=await response.text();
  if(typeof text!=="string"||text.length>12000)err("OWN_ORIGIN_RESPONSE_TOO_LARGE");
  return text;
}

export async function runIndexNow({
  state,source=SOURCE_THEME_RELEASE,key="",mode="probe",fetchImpl=fetch
}={}){
  if(!["dry-run","probe","submit"].includes(mode))err("UNKNOWN_MODE");
  const status=releaseGate(state,source);
  if(mode==="dry-run")
    return {status,mode:"dry-run",candidate_count:2,indexnow_posts:0,
      wordpress_writes:0,indexed_urls_verified:false};
  if(status!=="eligible_for_live_preflight")
    return {status,mode,indexnow_posts:0,wordpress_writes:0};
  if(!key)
    return {status:"domain_root_key_not_configured",mode,indexnow_posts:0,
      wordpress_writes:0};
  const payload=indexNowPayload(key);
  let readiness;
  try{readiness=JSON.parse(await ownGet(READY,"application/json",fetchImpl));}
  catch{err("READINESS_UNVERIFIABLE");}
  if(readiness?.release!==RELEASE||readiness?.integrity!=="ok"||
      readiness?.configured_total!==25||readiness?.slot_total!==25)
    err("LIVE_RELEASE_OR_INTEGRITY_MISMATCH");
  const observed=await ownGet(payload.keyLocation,"text/plain",fetchImpl);
  if(observed!==key)err("DOMAIN_ROOT_PROOF_NOT_LIVE");
  // Reuse the exact production 0.8.248 safety/page-content proof, not a
  // generic release version or an unsafe merchant/affiliate link click.
  const proof=await auditLiveTransportMobility248(fetchImpl,RELEASE);
  if(proof.status!=="verified"||proof.get_requests!==2||proof.posts!==0)
    err("MOBILITY_FEATURE_PROOF_FAILED");
  if(mode==="probe")
    return {status:"ready_no_external_submission",mode,candidate_count:2,
      release:RELEASE,root_key:"verified",safe_handoffs:"verified",
      indexnow_posts:0,wordpress_writes:0,indexed_urls_verified:false};
  let response;
  try{response=await fetchImpl(SEZNAM,{
    method:"POST",redirect:"error",
    headers:{"Content-Type":"application/json; charset=utf-8"},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)
  });}catch{err("INDEXNOW_UNAVAILABLE");}
  // Seznam documents HTTP 200 as proof of receipt, not crawl/indexation.
  if(response?.status!==200)err("INDEXNOW_NOT_ACCEPTED");
  return {status:"indexnow_receipt_only",mode,release:RELEASE,
    candidate_count:2,indexnow_posts:1,wordpress_writes:0,
    indexed_urls_verified:false};
}

async function main(){
  const mode=process.argv[2]==="--dry-run"?"dry-run":
    process.argv[2]==="--probe"?"probe":
    process.argv[2]==="--submit"?"submit":null;
  if(!mode||process.argv.length!==3)err("USAGE");
  const state=JSON.parse(readFileSync(graphPath,"utf8"));
  const result=await runIndexNow({state,mode,key:process.env.ZP_INDEXNOW_KEY||""});
  process.stdout.write("ZP_INDEXNOW "+JSON.stringify(result)+"\n");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  main().catch(error=>{
    // Never echo URLs supplied at runtime or a configured key.
    const safe=String(error.message).match(/^ZP_INDEXNOW_[A-Z_]+$/)?.[0]||"ZP_INDEXNOW_FAILED";
    process.stderr.write(safe+"\n");process.exitCode=1;
  });
}
