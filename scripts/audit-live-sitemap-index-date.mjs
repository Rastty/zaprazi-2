#!/usr/bin/env node
/**
 * Read-only postdeploy acceptance for the Yoast sitemap-index revision fix.
 * Never run as a predeploy gate: an older live release is expected to fail.
 * No WordPress writes, Google indexing requests, affiliate clicks or analytics.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {fetchPublicWithNetworkRetry} from "./lib/public-readonly-retry.mjs";

const ORIGIN="https://zaprazi.cz";
const INDEX=ORIGIN+"/sitemap_index.xml";
const READINESS=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
const PAGE_SITEMAP=ORIGIN+"/page-sitemap.xml";

function parseTimestamp(value){
  if(typeof value!=="string"||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value))
    throw Error("SITEMAP_DATE_INVALID_FORMAT");
  const time=Date.parse(value);
  if(!Number.isFinite(time))throw Error("SITEMAP_DATE_INVALID_VALUE");
  return time;
}

/** Use the existing reviewed PHP whitelist, not a second hand-maintained date. */
export function latestReviewedSitemapDate(php){
  const section=/function zaprazi_2_material_sitemap_page_dates\(\)\s*\{\s*return array\(([\s\S]*?)\n  \);\s*\}/.exec(php);
  if(!section)throw Error("SITEMAP_SOURCE_WHITELIST_MISSING");
  const entries=[...section[1].matchAll(/^\s*'([a-z0-9-]+)'\s*=>\s*'([^']+)',\s*$/gm)];
  if(entries.length<1||entries.length>100||
      section[1].replace(/^\s*'([a-z0-9-]+)'\s*=>\s*'([^']+)',\s*$/gm,"").trim())
    throw Error("SITEMAP_SOURCE_WHITELIST_UNEXPECTED");
  if(new Set(entries.map(e=>e[1])).size!==entries.length)
    throw Error("SITEMAP_SOURCE_WHITELIST_DUPLICATE");
  let latest=entries[0][2];
  for(const [, , date] of entries){
    if(parseTimestamp(date)>parseTimestamp(latest))latest=date;
  }
  return latest;
}

/** Only the exact canonical child entry may satisfy this release gate. */
export function inspectPageSitemapIndexDate(xml,reviewedDate){
  if(typeof xml!=="string"||xml.length<50||xml.length>100_000||
      /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<!--/i.test(xml)||
      !/<sitemapindex(?:\s[^>]*)?>/i.test(xml))
    throw Error("SITEMAP_INDEX_XML_INVALID");
  const entries=[...xml.matchAll(/<sitemap(?:\s[^>]*)?>([\s\S]*?)<\/sitemap\s*>/gi)];
  if(entries.length<1||entries.length>40)throw Error("SITEMAP_INDEX_ENTRY_COUNT");
  const expected=[];
  for(const entry of entries){
    const locs=[...entry[1].matchAll(/<loc>\s*([^<]+)\s*<\/loc\s*>/gi)];
    if(locs.length!==1)throw Error("SITEMAP_INDEX_LOC_INVALID");
    if(locs[0][1].trim()===PAGE_SITEMAP)expected.push(entry[1]);
  }
  if(expected.length!==1)throw Error("SITEMAP_INDEX_PAGE_ENTRY_MISSING_OR_DUPLICATE");
  const dates=[...expected[0].matchAll(/<lastmod>\s*([^<]+)\s*<\/lastmod\s*>/gi)];
  if(dates.length!==1)throw Error("SITEMAP_INDEX_LASTMOD_MISSING_OR_DUPLICATE");
  const observed=dates[0][1].trim();
  if(parseTimestamp(observed)<parseTimestamp(reviewedDate))
    throw Error("SITEMAP_INDEX_LASTMOD_STALE");
  return {status:"verified",indexLastmod:observed,latestReviewedDate:reviewedDate,
    scope:"exact_page_sitemap_only"};
}

async function readExact(fetcher,url,maxBytes){
  let response;
  try{response=await fetchPublicWithNetworkRetry(fetcher,url,{redirect:"error"});}
  catch{throw Error("SITEMAP_DATE_NETWORK_FAILED");}
  if(response?.status!==200||(response.url&&response.url!==url))
    throw Error("SITEMAP_DATE_HTTP_OR_REDIRECT_FAILED");
  let text;
  try{text=await response.text();}catch{throw Error("SITEMAP_DATE_BODY_UNAVAILABLE");}
  if(typeof text!=="string"||text.length>maxBytes)
    throw Error("SITEMAP_DATE_BODY_INVALID_SIZE");
  return text;
}

export async function auditLiveSitemapIndexDate(fetcher=fetch,phpSource){
  const source=phpSource??readFileSync(new URL("../src/seo/https-sitemaps.php",import.meta.url),"utf8");
  const reviewedDate=latestReviewedSitemapDate(source);
  const readiness=JSON.parse(await readExact(fetcher,READINESS,20_000));
  if(readiness?.release!==SOURCE_THEME_RELEASE||readiness?.integrity!=="ok"||
      readiness?.configured_total!==25||readiness?.slot_total!==25)
    throw Error("SITEMAP_DATE_RELEASE_NOT_DEPLOYED");
  const result=inspectPageSitemapIndexDate(await readExact(fetcher,INDEX,100_000),reviewedDate);
  return {...result,release:SOURCE_THEME_RELEASE,integrity:"ok",
    affiliateConfigured:25,conclusion:"XML revision signal only; not proof of Google indexing or traffic"};
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditLiveSitemapIndexDate().then(result=>
    console.log("SITEMAP_INDEX_DATE_POSTDEPLOY "+JSON.stringify(result)))
    .catch(()=>{console.error("SITEMAP_INDEX_DATE_POSTDEPLOY_FAILED");process.exitCode=1;});
}
