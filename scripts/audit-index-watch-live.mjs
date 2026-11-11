#!/usr/bin/env node
/**
 * Narrow, read-only LIVE HTML/indexability gate for the four Google URL
 * Inspection excluded-version candidates recorded on 2026-11-11.
 * This does NOT prove that Google will crawl, select or index a page.
 * It complements the existing sitemap audit, never requests indexing,
 * follows redirects or reads query parameters / merchant URLs.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {auditPublicSitemap,assertPublicSitemapHealthy}
  from "./audit-public-sitemap.mjs";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";

const ORIGIN="https://zaprazi.cz";
export const INDEX_WATCH_PATHS=Object.freeze([
  "/choditka-pro-seniory/",
  "/choditko-do-bytu-pro-seniory/",
  "/co-zmerit-pred-vyberem-choditka/",
  "/sprchovaci-zidle-pro-seniory/"
]);
const WATCH=new Set(INDEX_WATCH_PATHS);
const MAX_HTML=1_500_000;

function headTags(html) {
  if(typeof html!=="string"||html.length<350||html.length>MAX_HTML)
    throw Error("INDEX_LIVE_BAD_HTML_SIZE");
  // Only the real document head; disallow comments/scripts as data sources.
  const m=/<head(?:\s[^>]*)?>([\s\S]*?)<\/head\s*>/i.exec(html);
  if(!m)throw Error("INDEX_LIVE_HEAD_MISSING");
  const head=m[1].replace(/<!--[\s\S]*?-->/g,"")
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"");
  return [...head.matchAll(/<(link|meta)\b[^>]*>/gi)]
    .map(x=>({tag:x[1].toLowerCase(),attrs:attributes(x[0])}));
}
function attributes(tag){
  const out=Object.create(null);
  for(const m of tag.matchAll(/\s([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)){
    const key=m[1].toLowerCase();
    if(Object.hasOwn(out,key))throw Error("INDEX_LIVE_DUPLICATE_ATTRIBUTE");
    out[key]=m[2]??m[3]??m[4];
  }
  return out;
}
function meta(tags,name){
  const matches=tags.filter(x=>x.tag==="meta"&&x.attrs.name?.toLowerCase()===name);
  if(matches.length!==1||typeof matches[0].attrs.content!=="string")
    throw Error("INDEX_LIVE_META_MISSING");
  return matches[0].attrs.content;
}
/** Inspect only predetermined public paths. Never include raw HTML/headers in errors. */
export function inspectIndexabilityHtml(path,html,headers,release=SOURCE_THEME_RELEASE){
  if(!WATCH.has(path)||!headers||typeof headers.get!=="function")
    throw Error("INDEX_LIVE_UNAUTHORIZED_PATH");
  const tags=headTags(html);
  const canonical=tags.filter(x=>x.tag==="link"&&
    (x.attrs.rel||"").toLowerCase().split(/\s+/).includes("canonical"));
  if(canonical.length!==1||canonical[0].attrs.href!==ORIGIN+path)
    throw Error("INDEX_LIVE_CANONICAL_MISMATCH");
  const robots=tags.filter(x=>x.tag==="meta"&&
    ["robots","googlebot"].includes(x.attrs.name?.toLowerCase()))
    .map(x=>x.attrs.content);
  if(robots.some(x=>typeof x!=="string"||
      /(?:^|[,;\s])(?:noindex|none)(?:$|[,;\s])/i.test(x))||
      /(?:^|[,;\s])(?:noindex|none)(?:$|[,;\s])/i.test(headers.get("x-robots-tag")||""))
    throw Error("INDEX_LIVE_NOINDEX_DETECTED");
  const releaseTag=meta(tags,"zaprazi-release");
  const integrity=meta(tags,"zaprazi-integrity");
  if(releaseTag!==release||integrity!=="ok")
    throw Error("INDEX_LIVE_RELEASE_INTEGRITY_MISMATCH");
  return {path,http:200,canonical:"self",explicitNoindex:false,
    release:releaseTag,integrity:"ok"};
}

export async function fetchLiveIndexability(path,fetcher=fetch,release=SOURCE_THEME_RELEASE){
  if(!WATCH.has(path))throw Error("INDEX_LIVE_UNAUTHORIZED_PATH");
  let response;
  try{
    response=await fetcher(ORIGIN+path,{redirect:"error",
      signal:AbortSignal.timeout(15000),headers:{"Accept":"text/html"}});
  }catch{throw Error("INDEX_LIVE_NETWORK_OR_REDIRECT_FAILED");}
  if(response.status!==200)throw Error("INDEX_LIVE_HTTP_NOT_200");
  const ct=response.headers?.get?.("content-type")||"";
  if(!/^text\/html(?:\s*;|$)/i.test(ct))
    throw Error("INDEX_LIVE_NOT_HTML");
  const length=response.headers.get("content-length");
  if(length!==null&&Number(length)>MAX_HTML)
    throw Error("INDEX_LIVE_BODY_TOO_LARGE");
  let html;
  try{html=await response.text();}catch{throw Error("INDEX_LIVE_HTML_UNREADABLE");}
  return inspectIndexabilityHtml(path,html,response.headers,release);
}
export async function auditIndexWatch(fetcher=fetch,release=SOURCE_THEME_RELEASE){
  // Existing full public XML/robots gate proves each watched path has an
  // exact canonical URL in page-sitemap and no known Googlebot path block.
  const sitemap=await auditPublicSitemap(fetcher);
  assertPublicSitemapHealthy(sitemap);
  for(const path of INDEX_WATCH_PATHS){
    if(sitemap.required_decision_path_locations?.[path]?.url!==ORIGIN+path)
      throw Error("INDEX_LIVE_NOT_IN_PAGE_SITEMAP");
  }
  const pages=await Promise.all(INDEX_WATCH_PATHS.map(path=>
    fetchLiveIndexability(path,fetcher,release)));
  return {status:"live_technical_checks_passed",scope:"four_fixed_google_excluded_candidates",
    release,checked:pages.length,pages,
    evidence:"public HTML + robots.txt + sitemap, not Googlebot live inspection",
    limitations:"No conclusion about Google crawl, indexing decision, SERP ranking, duplicates or traffic. No Google indexing requests or site writes."};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditIndexWatch().then(r=>console.log("INDEX_WATCH_LIVE "+JSON.stringify(r)))
    .catch(()=>{console.error("INDEX_WATCH_LIVE_FAILED: targeted technical gate did not pass");process.exitCode=1;});
}
