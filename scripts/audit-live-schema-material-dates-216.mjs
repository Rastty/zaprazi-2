#!/usr/bin/env node
/**
 * Exact-live 0.8.216 read-only Yoast Schema acceptance.
 * WordPress PHP-template edits do not change WP post_modified. Audit the
 * SAME ten sourced material page dates as the XML sitemap, never freshness
 * guesses. No merchant clicks, forms, GSC writes, URLs with private answers.
 */
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {SOURCE_DATES} from "./audit-205-postdeploy-seo.mjs";
import {fetchPublicWithNetworkRetry} from "./lib/public-readonly-retry.mjs";

const ORIGIN="https://zaprazi.cz";
const READINESS=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
function atLeast(a,b){
  if(!/^\d+\.\d+\.\d+$/.test(a)||!/^\d+\.\d+\.\d+$/.test(b))return false;
  const av=a.split(".").map(Number),bv=b.split(".").map(Number);
  for(let i=0;i<3;i++)if(av[i]!==bv[i])return av[i]>bv[i];
  return true;
}
export function assertMaterialWebpageSchema(html,path,minDate,release,now=new Date()){
  assert.ok(typeof html==="string"&&html.length>100,"SCHEMA_HTML_UNAVAILABLE");
  assert.ok(Object.hasOwn(SOURCE_DATES,path)&&SOURCE_DATES[path]===minDate,
    "SCHEMA_SOURCE_DATE_NOT_ALLOWLISTED");
  assert.match(path,/^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/,"SCHEMA_PATH_INVALID");
  assert.match(release,/^\d+\.\d+\.\d+$/,"SCHEMA_RELEASE_INVALID");
  assert.ok(now instanceof Date&&Number.isFinite(now.getTime()),"SCHEMA_CLOCK_INVALID");
  const url=ORIGIN+path;
  const releases=[...html.matchAll(/<meta\s+name=["']zaprazi-release["']\s+content=["']([^"']+)["']/gi)]
    .map(m=>m[1]);
  assert.deepEqual(releases,[release],"SCHEMA_LIVE_RELEASE_MISMATCH");
  const integrities=[...html.matchAll(/<meta\s+name=["']zaprazi-integrity["']\s+content=["']([^"']+)["']/gi)]
    .map(m=>m[1]);
  assert.deepEqual(integrities,["ok"],"SCHEMA_LIVE_INTEGRITY_FAILED");
  const canonicals=[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)]
    .map(m=>m[1]);
  assert.deepEqual(canonicals,[url],"SCHEMA_CANONICAL_MISMATCH");
  const scripts=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*class=["']yoast-schema-graph["'][^>]*>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length,1,"SCHEMA_YOAST_GRAPH_MISSING_OR_DUPLICATE");
  let graph;
  try{graph=JSON.parse(scripts[0][1])}catch{throw Error("SCHEMA_JSON_INVALID")}
  const pages=Array.isArray(graph?.["@graph"])?graph["@graph"].filter(x=>x&&typeof x==="object"&&
    (x["@type"]==="WebPage"||(Array.isArray(x["@type"])&&x["@type"].includes("WebPage")))):[];
  assert.equal(pages.length,1,"SCHEMA_WEBPAGE_NODE_MISSING_OR_DUPLICATE");
  const page=pages[0];
  assert.equal(page.url,url,"SCHEMA_WEBPAGE_URL_MISMATCH");
  assert.equal(page["@id"],url,"SCHEMA_WEBPAGE_ID_MISMATCH");
  const iso=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;
  assert.match(page.dateModified??"",iso,"SCHEMA_MODIFIED_ISO_INVALID");
  const modified=Date.parse(page.dateModified),min=Date.parse(minDate+"T00:00:00Z");
  assert.ok(Number.isFinite(modified)&&modified>=min&&modified<=now.getTime(),
    "SCHEMA_MODIFIED_MATERIAL_DATE_NOT_VERIFIED");
  if(page.datePublished!==undefined){
    assert.match(page.datePublished,iso,"SCHEMA_PUBLISHED_ISO_INVALID");
    const published=Date.parse(page.datePublished);
    assert.ok(Number.isFinite(published)&&published<=modified,"SCHEMA_CHRONOLOGY_INVALID");
  }
  return {path,verified:true};
}
async function publicGet(url,accept){
  if(url!==READINESS&&!Object.keys(SOURCE_DATES).some(path=>url===ORIGIN+path))
    throw Error("SCHEMA_UNEXPECTED_HOST_OR_URL");
  const res=await fetchPublicWithNetworkRetry(fetch,url,{method:"GET",redirect:"error",cache:"no-store",
    headers:{Accept:accept,"Cache-Control":"no-cache"}});
  if(res.status!==200||(res.url&&res.url!==url))throw Error("SCHEMA_PUBLIC_GET_FAILED");
  const body=await res.text();
  if(body.length<100||body.length>2000000)throw Error("SCHEMA_PUBLIC_BODY_INVALID");
  return body;
}
export async function main(){
  if(process.env.GITHUB_EVENT_NAME==="pull_request")
    return {status:"predeploy_skip_not_live"};
  if(!atLeast(SOURCE_THEME_RELEASE,"0.8.216"))
    return {status:"older_source_release_skip"};
  const ready=JSON.parse(await publicGet(READINESS,"application/json"));
  assert.equal(ready.release,SOURCE_THEME_RELEASE,"SCHEMA_NOT_YET_DEPLOYED");
  assert.equal(ready.integrity,"ok","SCHEMA_LIVE_INTEGRITY_FAILED");
  assert.equal(ready.configured_total,25,"SCHEMA_AFFILIATE_READINESS_INCOMPLETE");
  assert.equal(ready.slot_total,25,"SCHEMA_AFFILIATE_READINESS_INCOMPLETE");
  const entries=Object.entries(SOURCE_DATES);
  assert.equal(entries.length,11,"SCHEMA_SOURCE_EXPECTED_ELEVEN");
  const now=new Date();
  for(const [path,date] of entries){
    const html=await publicGet(ORIGIN+path,"text/html");
    assertMaterialWebpageSchema(html,path,date,SOURCE_THEME_RELEASE,now);
  }
  return {status:"verified_read_only",release:SOURCE_THEME_RELEASE,pages:entries.length,
    note:"Factual material metadata consistency only. Not Google indexing or revenue"};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().then(result=>console.log("ZP_SCHEMA_MATERIAL_DATES",JSON.stringify(result)))
    .catch(error=>{
      console.error("ZP_SCHEMA_MATERIAL_DATES_FAILED",String(error));
      process.exitCode=1;
    });
}
