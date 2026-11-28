#!/usr/bin/env node
/**
 * Narrow, read-only LIVE HTML/indexability gate for the homepage and four
 * Google URL Inspection candidates. Homepage was reported as
 * crawled_not_indexed in the 2026-11-20 Core GSC capture.
 * This does NOT prove that Google will crawl, select or index a page.
 * It complements the existing sitemap audit, never requests indexing,
 * follows redirects or reads query parameters / merchant URLs.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {auditPublicSitemap,assertPublicSitemapHealthy}
  from "./audit-public-sitemap.mjs";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {fetchPublicWithNetworkRetry} from "./lib/public-readonly-retry.mjs";
import {googlebotBlockedByXRobotsTag} from "./lib/editorial-seo-rules.mjs";

const ORIGIN="https://zaprazi.cz";
const READINESS=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
export const INDEX_WATCH_PATHS=Object.freeze([
  "/",
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
      googlebotBlockedByXRobotsTag(headers.get("x-robots-tag")))
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
    response=await fetchPublicWithNetworkRetry(fetcher,ORIGIN+path,
      {redirect:"error",headers:{"Accept":"text/html"}});
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
/** Only independently verified exact predecessors are permitted in PR gates.
 * A push/schedule or any unrelated release must audit its own live code.
 */
export function selectIndexWatchScope(event,sourceRelease,readiness){
  if(readiness?.integrity!=="ok"||readiness?.configured_total!==25||
     readiness?.slot_total!==25)throw Error("INDEX_LIVE_READINESS_INCOMPLETE");
  if(readiness.release===sourceRelease)
    return {release:sourceRelease,mode:"exact_live_source"};
  if(event==="pull_request"&&sourceRelease==="0.8.221"&&readiness.release==="0.8.220")
    return {release:"0.8.220",mode:"predeploy_verified_220_only"};
  // Editorial 0.8.234 does not alter these four watched canonical pages.
  // Check precisely the live 0.8.233 predecessor until owner deploys.
  if(event==="pull_request"&&sourceRelease==="0.8.234"&&readiness.release==="0.8.233")
    return {release:"0.8.233",mode:"predeploy_verified_233_only"};
  // 0.8.235 only changes the presentation of a sole product card. All four
  // indexed decision URLs have identical canonical, robots and content scope.
  if(event==="pull_request"&&sourceRelease==="0.8.235"&&readiness.release==="0.8.234")
    return {release:"0.8.234",mode:"predeploy_verified_234_only"};
  // 0.8.236 changes only the opt-in GA4 consent adapter and release markers;
  // the four watched public HTML/canonical/sitemap paths remain unchanged.
  if(event==="pull_request"&&sourceRelease==="0.8.236"&&readiness.release==="0.8.235")
    return {release:"0.8.235",mode:"predeploy_verified_235_only"};
  // 0.8.237 changes only the curated Yoast timestamps of three already
  // published pages. The four watched HTML canonical/robots/anchors are
  // unchanged; audit the exact independently verified live 0.8.236 release.
  if(event==="pull_request"&&sourceRelease==="0.8.237"&&readiness.release==="0.8.236")
    return {release:"0.8.236",mode:"predeploy_verified_236_only"};
  // 0.8.243 adjusts the evidenced rollator page's Yoast material date only.
  // None of the five fixed GSC watch paths or their canonical/robots content
  // changes; PR audits exact 0.8.242, while push/schedule remain fail-closed.
  if(event==="pull_request"&&sourceRelease==="0.8.243"&&readiness.release==="0.8.242")
    return {release:"0.8.242",mode:"predeploy_verified_242_only"};
  // Check only exact accepted production in PRs; never substitute for deployment.
  if(event==="pull_request"&&sourceRelease==="0.8.250"&&readiness.release==="0.8.249")
    return {release:"0.8.249",mode:"predeploy_verified_249_only"};
  if(event==="pull_request"&&sourceRelease==="0.8.251"&&readiness.release==="0.8.250")
    return {release:"0.8.250",mode:"predeploy_verified_250_only"};
  if(event==="pull_request"&&sourceRelease==="0.8.252"&&readiness.release==="0.8.251")
    return {release:"0.8.251",mode:"predeploy_verified_251_only"};
  if(event==="pull_request"&&sourceRelease==="0.8.253"&&readiness.release==="0.8.252")
    return {release:"0.8.252",mode:"predeploy_verified_252_only"};
  if(event==="pull_request"&&sourceRelease==="0.8.254"&&readiness.release==="0.8.253")
    return {release:"0.8.253",mode:"predeploy_verified_253_only"};
  if(event==="pull_request"&&sourceRelease==="0.8.255"&&readiness.release==="0.8.254")
    return {release:"0.8.254",mode:"predeploy_verified_254_only"};
  throw Error("INDEX_LIVE_RELEASE_INTEGRITY_MISMATCH");
}
async function fetchReadiness(fetcher){
  let response;
  try{response=await fetchPublicWithNetworkRetry(fetcher,READINESS,
    {redirect:"error",headers:{Accept:"application/json"}});}
  catch{throw Error("INDEX_LIVE_READINESS_NETWORK_FAILED");}
  if(response.status!==200||(response.url&&response.url!==READINESS))
    throw Error("INDEX_LIVE_READINESS_HTTP_FAILED");
  let readiness;
  try{readiness=await response.json();}
  catch{throw Error("INDEX_LIVE_READINESS_INVALID");}
  return readiness;
}
export async function auditIndexWatch(fetcher=fetch,release=SOURCE_THEME_RELEASE,event=process.env.GITHUB_EVENT_NAME){
  // Existing full public XML/robots gate proves each watched path has an
  // exact canonical URL in page-sitemap and no known Googlebot path block.
  const sitemap=await auditPublicSitemap(fetcher);
  assertPublicSitemapHealthy(sitemap);
  assertIndexWatchSitemap(sitemap);
  const scope=selectIndexWatchScope(event,release,await fetchReadiness(fetcher));
  const pages=await Promise.all(INDEX_WATCH_PATHS.map(path=>
    fetchLiveIndexability(path,fetcher,scope.release)));
  return {status:"live_technical_checks_passed",scope:"homepage_and_four_gsc_candidates",
    sourceRelease:release,liveRelease:scope.release,releaseCheck:scope.mode,
    checked:pages.length,pages,
    evidence:"public HTML + robots.txt + sitemap, not Googlebot live inspection",
    limitations:"No conclusion about Google crawl, indexing decision, SERP ranking, duplicates or traffic. No Google indexing requests or site writes."};
}
/** The homepage must be in Yoast's page sitemap and crawable even when
 * a robots rule blocks only the exact root path (Disallow: /$).
 */
export function assertIndexWatchSitemap(sitemap){
  if(sitemap?.robots_googlebot_homepage_blocked!==false)
    throw Error("INDEX_LIVE_HOMEPAGE_GOOGLEBOT_BLOCKED_OR_UNKNOWN");
  for(const path of INDEX_WATCH_PATHS){
    const location=path==="/" ? sitemap.homepage_location :
      sitemap.required_decision_path_locations?.[path];
    if(location?.url!==ORIGIN+path||location.noncanonical||
       !/^\/page-sitemap\d*\.xml$/.test(location.sitemap||""))
      throw Error("INDEX_LIVE_NOT_IN_PAGE_SITEMAP");
  }
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditIndexWatch().then(r=>console.log("INDEX_WATCH_LIVE "+JSON.stringify(r)))
    .catch(()=>{console.error("INDEX_WATCH_LIVE_FAILED: targeted technical gate did not pass");process.exitCode=1;});
}
