#!/usr/bin/env node
/**
 * Exact read-only 0.8.205 postdeploy SEO check.
 * Proves two contextual homepage links and four evidence-backed Yoast
 * lastmod signals on published pages. Public pages only; never submit URLs,
 * write to WordPress or expose raw HTML/XML in CI logs.
 */
import {pathToFileURL} from "node:url";

const ORIGIN="https://zaprazi.cz";
export const SOURCE_DATES=Object.freeze({
  "/pujceni-choditka/":"2026-11-09",
  "/choditko-na-pojistovnu/":"2026-11-09",
  "/koupelna-a-wc/":"2026-11-09",
  "/kompenzacni-pomucky-pro-seniory/":"2026-11-09"
});
const HOME_CARDS=Object.freeze([
  {heading:"Chůze a opora",path:"/co-zmerit-pred-vyberem-choditka/",word:"změřit"},
  {heading:"Koupelna a WC",path:"/sprchovaci-zidle-pro-seniory/",word:"sprchovací"}
]);
const toText=x=>x.replace(/<[^>]*>/g," ").replace(/&nbsp;/gi," ").replace(/\s+/g," ").trim();
function urlPath(href) {
  try {
    const u=new URL(href,ORIGIN);
    if(u.origin!==ORIGIN||u.protocol!=="https:"||u.search||u.hash||u.username||u.password)
      return null;
    return u.pathname;
  }catch{return null;}
}
export function assertHomepageCards(html) {
  if(typeof html!=="string"||html.length<200)throw Error("HOMEPAGE_HTML_UNAVAILABLE");
  const cards=[...html.matchAll(/<article\b[^>]*class=["'][^"']*\bzp-decision-card\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi)].map(x=>x[1]);
  for(const target of HOME_CARDS) {
    const card=cards.find(c=>new RegExp("<h3[^>]*>\\s*"+target.heading+"\\s*</h3>","i").test(c));
    if(!card)throw Error("MISSING_HOME_CARD");
    const anchors=[...card.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    const matches=anchors.filter(x=>urlPath(x[1])===target.path&&
      toText(x[2]).toLowerCase().includes(target.word));
    if(matches.length!==1)throw Error("MISSING_CONTEXTUAL_HOME_LINK");
  }
  return {linksVerified:HOME_CARDS.length,paths:HOME_CARDS.map(x=>x.path)};
}
export function assertMaterialLastmod(xml, now="2026-11-09") {
  if(typeof xml!=="string"||!/<urlset\b/i.test(xml)||xml.length<100)
    throw Error("SITEMAP_XML_UNAVAILABLE");
  const validNow=/^\d{4}-\d{2}-\d{2}$/.test(now)?now:null;
  if(!validNow)throw Error("INVALID_EVIDENCE_DATE");
  const rows=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  if(rows.length<4)throw Error("SITEMAP_MISSING_URLS");
  const verified=[];
  const stale=[];
  for(const [path,minimumDate] of Object.entries(SOURCE_DATES)) {
    const hits=rows.filter(x=>{
      const loc=x[1].match(/<loc>([^<]+)<\/loc>/i)?.[1];
      return loc&&urlPath(loc)===path;
    });
    if(hits.length!==1)throw Error("SITEMAP_MISSING_OR_DUPLICATE_PAGE");
    const raw=hits[0][1].match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1];
    const valid=raw&&/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2}))?$/.test(raw);
    if(!valid||!Number.isFinite(Date.parse(raw)))throw Error("SITEMAP_LASTMOD_UNVERIFIED");
    const recorded=new Date(raw).toISOString().slice(0,10);
    if(recorded<minimumDate||recorded>validNow)
      stale.push({path,lastmod:recorded});
    else verified.push({path,lastmod:recorded});
  }
  if(stale.length)throw Error("SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW "+
    JSON.stringify(stale));
  return {lastmodsVerified:verified.length,pages:verified};
}
async function fetchPublic(path) {
  const url=ORIGIN+path;
  const response=await fetch(url,{redirect:"error",signal:AbortSignal.timeout(15000),
    headers:{"Accept":"text/html,application/xml,text/xml"}});
  if(response.status!==200)throw Error("PUBLIC_SEO_HTTP_NOT_200");
  const content=await response.text();
  if(content.length>4_000_000)throw Error("PUBLIC_SEO_BODY_TOO_LARGE");
  return content;
}
export async function verifyPublicSeo205(now=new Date().toISOString().slice(0,10)) {
  const [html,xml]=await Promise.all([fetchPublic("/"),fetchPublic("/page-sitemap.xml")]);
  return {...assertHomepageCards(html),...assertMaterialLastmod(xml,now),
    release:"0.8.206",status:"verified_read_only",
    limitations:"Public links and sitemap freshness signals; NOT evidence of Google indexing, traffic or commission"};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  verifyPublicSeo205().then(r=>console.log("ZP_205_PUBLIC_SEO_ACCEPTANCE "+JSON.stringify(r)))
  .catch(e=>{console.error("ZP_205_PUBLIC_SEO_FAILED "+e.message);process.exitCode=1;});
}
