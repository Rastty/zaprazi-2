#!/usr/bin/env node
/**
 * Exact read-only 0.8.205 postdeploy SEO check.
 * Proves two contextual homepage links and four evidence-backed Yoast
 * lastmod signals, two Mobility revisions and the live 0.8.211 bed guide. Published pages only. Public pages only; never submit URLs,
 * write to WordPress or expose raw HTML/XML in CI logs.
 */
import {pathToFileURL} from "node:url";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";

const ORIGIN="https://zaprazi.cz";
export const SOURCE_DATES=Object.freeze({
  "/pujceni-choditka/":"2026-11-09",
  "/choditko-na-pojistovnu/":"2026-11-09",
  "/koupelna-a-wc/":"2026-11-09",
  "/kompenzacni-pomucky-pro-seniory/":"2026-11-09",
  "/co-zmerit-pred-vyberem-choditka/":"2026-11-08",
  "/choditka-pro-seniory/":"2026-11-09",
  "/senior-nemuze-vstat-z-postele/":"2026-11-09"
});
export const PREDEPLOY_BASELINE_DATES=Object.freeze(Object.fromEntries(
  Object.entries(SOURCE_DATES).filter(([path])=>
    path!=="/co-zmerit-pred-vyberem-choditka/"&&path!=="/choditka-pro-seniory/"&&
    path!=="/senior-nemuze-vstat-z-postele/")
));
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
export function assertMaterialLastmod(xml, now="2026-11-09", expectedDates=SOURCE_DATES) {
  if(typeof xml!=="string"||!/<urlset\b/i.test(xml)||xml.length<100)
    throw Error("SITEMAP_XML_UNAVAILABLE");
  const validNow=/^\d{4}-\d{2}-\d{2}$/.test(now)?now:null;
  if(!validNow)throw Error("INVALID_EVIDENCE_DATE");
  const rows=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  if(rows.length<4)throw Error("SITEMAP_MISSING_URLS");
  const verified=[];
  const stale=[];
  for(const [path,minimumDate] of Object.entries(expectedDates)) {
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
/**
 * Live 0.8.211 specific proof: exact first-screen decision guidance, safety
 * wording and real in-page targets. This is NOT a clinical suitability check.
 * No merchant links, forms, visitor answers or page HTML enter CI artifacts.
 */
export function assertBedFirstAnswer(html, expectedRelease=SOURCE_THEME_RELEASE) {
  if(typeof html!=="string"||html.length<350)throw Error("BED_HTML_UNAVAILABLE");
  const version=html.match(/<meta\s+name=["']zaprazi-release["']\s+content=["']([^"']+)["'][^>]*>/i)?.[1];
  const integrity=html.match(/<meta\s+name=["']zaprazi-integrity["']\s+content=["']([^"']+)["'][^>]*>/i)?.[1];
  if(version!==expectedRelease||integrity!=="ok")throw Error("BED_RELEASE_INTEGRITY_MISMATCH");
  const heroes=[...html.matchAll(/<section\s+class=["']zp-hero["']\s*>/gi)];
  if(heroes.length!==1)throw Error("BED_HERO_MISSING_OR_DUPLICATE");
  const start=heroes[0].index+heroes[0][0].length;
  const end=html.indexOf("</section>",start);
  if(end<=start)throw Error("BED_HERO_INCOMPLETE");
  const hero=html.slice(start,end);
  const answers=[...hero.matchAll(/<p\s+class=["']zp-muted-copy["']\s*>([\s\S]*?)<\/p>/gi)]
    .map(m=>m[1]).filter(v=>toText(v).includes("Rychlá odpověď:"));
  if(answers.length!==1)throw Error("BED_FIRST_ANSWER_MISSING_OR_DUPLICATE");
  const answer=answers[0];
  const plain=toText(answer.replace(/<!--[\s\S]*?-->/g,""));
  for(const phrase of ["Rychlá odpověď:","nedokáže posadit","zvednout ze sedu",
    "nezkoušejte zvedat silou","odborníkem"])
    if(!plain.includes(phrase))throw Error("BED_FIRST_ANSWER_INCOMPLETE");
  for(const id of ["rozhodnuti-vstavani-postel","kontroly-postele"]){
    const links=[...answer.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
      .map(match=>match[1]);
    if(links.filter(href=>href==="#"+id).length!==1)
      throw Error("BED_FIRST_ANSWER_NAVIGATION_MISSING");
    const destinations=[...html.matchAll(new RegExp('\\bid=["\\u0027]'+id+'["\\u0027]','g'))];
    if(destinations.length!==1)throw Error("BED_DESTINATION_MISSING_OR_DUPLICATE");
  }
  if(/<form\b|data-zp-merchant-link|data-zp-offer|affiliateMap/i.test(hero))
    throw Error("BED_HERO_UNSAFE_MERCHANT_OR_FORM");
  return {bedFirstAnswer:"verified",bedAnchorsVerified:2};
}

export function selectLiveSitemapScope({event,sourceRelease=SOURCE_THEME_RELEASE,liveRelease,integrity}) {
  if(integrity!=="ok")throw Error("SITEMAP_LIVE_INTEGRITY_FAILED");
  if(liveRelease===sourceRelease)return {dates:SOURCE_DATES,mode:"postdeploy_exact_release"};
  if(event==="pull_request"&&sourceRelease==="0.8.209"&&liveRelease==="0.8.208")
    return {dates:PREDEPLOY_BASELINE_DATES,mode:"predeploy_verified_baseline_only"};
  throw Error("SITEMAP_LIVE_RELEASE_MISMATCH");
}
async function fetchPublic(path,accept="text/html,application/xml,text/xml") {
  const url=ORIGIN+path;
  const response=await fetch(url,{redirect:"error",signal:AbortSignal.timeout(15000),
    headers:{"Accept":accept}});
  if(response.status!==200)throw Error("PUBLIC_SEO_HTTP_NOT_200");
  const content=await response.text();
  if(content.length>4_000_000)throw Error("PUBLIC_SEO_BODY_TOO_LARGE");
  return content;
}
export async function verifyPublicSeo205(now=new Date().toISOString().slice(0,10)) {
  const [html,xml,json,bedHtml]=await Promise.all([
    fetchPublic("/"),fetchPublic("/page-sitemap.xml"),
    fetchPublic("/wp-json/zaprazi/v1/affiliate-readiness","application/json"),
    fetchPublic("/senior-nemuze-vstat-z-postele/")
  ]);
  const readiness=JSON.parse(json);
  if(readiness?.configured_total!==25||readiness?.slot_total!==25)
    throw Error("SITEMAP_READINESS_INCOMPLETE");
  const scope=selectLiveSitemapScope({event:process.env.GITHUB_EVENT_NAME,
    liveRelease:readiness.release,integrity:readiness.integrity});
  return {...assertHomepageCards(html),...assertMaterialLastmod(xml,now,scope.dates),
    ...assertBedFirstAnswer(bedHtml,SOURCE_THEME_RELEASE),
    source_release:SOURCE_THEME_RELEASE,live_release:readiness.release,
    check_scope:scope.mode,status:"verified_read_only",
    limitations:"Public links and sitemap freshness signals; NOT evidence of Google indexing, traffic or commission"};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  verifyPublicSeo205().then(r=>console.log("ZP_205_PUBLIC_SEO_ACCEPTANCE "+JSON.stringify(r)))
  .catch(e=>{console.error("ZP_205_PUBLIC_SEO_FAILED "+e.message);process.exitCode=1;});
}
