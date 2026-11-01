/**
 * Strict, read-only post-deploy acceptance for Mobility acquisition UX #541/#543/#545.
 * Never submits Advisor answers, clicks merchants or writes to WordPress.
 * Only invoke after an authorized WordPress Pull + Deploy.
 */
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {checkReadiness,isExactAnchor} from "./verify-live-release-and-guides.mjs";

const origin="https://zaprazi.cz";
const paths=Object.freeze({
  hub:"/choditka-pro-seniory/",
  insurance:"/choditko-na-pojistovnu/",
  rental:"/pujceni-choditka/",
  measuring:"/co-zmerit-pred-vyberem-choditka/"
});

function attr(tag,name){
  const matches=[...String(tag).matchAll(/\b([a-z-]+)\s*=\s*(["'])(.*?)\2/gi)];
  return matches.find(m=>m[1].toLowerCase()===name)?.[3]??null;
}
function clean(html){
  return String(html).replace(/<!--[\s\S]*?-->/g,"")
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"");
}
function section(html,id){
  const doc=clean(html);
  for(const m of doc.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section\s*>/gi)){
    if(attr(m[1],"id")===id)return m[2];
  }
  assert.fail("Missing real editorial section #"+id);
}
function links(html,basePath="/"){
  return [...clean(html).matchAll(/<a\b[^>]*>/gi)]
    .map(m=>attr(m[0],"href")).filter(Boolean)
    .map(href=>new URL(href,origin+basePath));
}
function requireLinks(html,targets,label){
  const actual=links(html).map(u=>u.href);
  for(const path of targets){
    assert.ok(actual.includes(origin+path),"Missing safe "+label+" link: "+path);
  }
}
function meta(html,name){
  const tags=[...clean(html).split(/<\/head\s*>/i)[0].matchAll(/<meta\b[^>]*>/gi)];
  return tags.map(m=>m[0]).filter(tag=>attr(tag,"name")===name).map(tag=>attr(tag,"content"));
}
function assertPublicPage(html,path,release){
  assert.deepEqual(meta(html,"zaprazi-release"),[release],"Stale/missing page release: "+path);
  assert.deepEqual(meta(html,"zaprazi-integrity"),["ok"],"Partial page integrity: "+path);
  const canonical=[...clean(html).split(/<\/head\s*>/i)[0].matchAll(/<link\b[^>]*>/gi)]
    .map(m=>m[0]).filter(tag=>attr(tag,"rel")==="canonical")
    .map(tag=>attr(tag,"href"));
  assert.deepEqual(canonical,[origin+path],"Missing/incorrect canonical: "+path);
}
// A monthly SÚKL amount must never look current after its validity ends.
// Check only server-rendered public HTML; do not fetch medical/visitor data.
export function assertExpiredSuklEvidence(html,pragueDate){
  assert.match(pragueDate,/^\\d{4}-\\d{2}-\\d{2}$/,"Expected Prague calendar date");
  if(pragueDate<="2026-10-31")return {status:"not_yet_expired"};
  const rendered=clean(html);
  assert.match(rendered,/<h2>\\s*Říjnový záznam už není aktuální\\./i,
    "Expired SÚKL record still presented without a prominent stale headline");
  assert.match(rendered,/class=["']zp-stale-evidence["']/,
    "Expired SÚKL amount lacks a visible historical-data warning");
  assert.match(rendered,/Historická úhrada v říjnovém seznamu/i,
    "Expired SÚKL amount lacks a historical label");
  assert.doesNotMatch(rendered,/MEYRA Ideal:\\s*3\\s*408\\s*Kč/i,
    "Expired SÚKL amount still appears as a current hero claim");
  assert.doesNotMatch(rendered,/Úhrada v aktuálním říjnovém seznamu/i,
    "Expired SÚKL amount still appears current in the fact card");
  return {status:"expired_record_clearly_historical"};
}

export function assertMobilityAcquisition(pages,release){
  for(const [key,path] of Object.entries(paths)){
    assertPublicPage(pages[key],path,release);
  }
  assert.ok(isExactAnchor(pages.hub,"jak-ziskat-choditko"),"Missing acquisition anchor");
  assert.ok(isExactAnchor(pages.hub,"choditko-pred-ziskanim-nadpis"),"Missing four-point checklist");
  const acquisition=section(pages.hub,"jak-ziskat-choditko");
  assert.match(acquisition,/Čtyři věci, které si ověřit/i,"Missing practical checklist");
  requireLinks(acquisition,[
    "/#poradce",
    "/co-zmerit-pred-vyberem-choditka/#co-zmerit",
    "/pujceni-choditka/",
    "/choditko-na-pojistovnu/"
  ],"walker acquisition");
  assert.ok(isExactAnchor(pages.insurance,"kdyz-cekate-na-epoukaz"),"Missing ePoukaz waiting guidance");
  const waiting=section(pages.insurance,"kdyz-cekate-na-epoukaz");
  assert.match(waiting,/půjčení/i,"Waiting guidance must mention rental");
  assert.match(waiting,/bezpečn/i,"Waiting guidance must explain safety");
  requireLinks(waiting,[
    "/pujceni-choditka/",
    "/co-zmerit-pred-vyberem-choditka/#co-zmerit"
  ],"ePoukaz waiting");
  assert.ok(links(section(pages.insurance,"postup"),paths.insurance).some(u=>u.hash==="#kdyz-cekate-na-epoukaz"&&
    u.pathname===paths.insurance),"Missing jump to interim options");
  assert.ok(isExactAnchor(pages.rental,"rozpocet-pujceni-choditka"),"Rental budget target missing");
  assert.ok(isExactAnchor(pages.measuring,"co-zmerit"),"Measurement target missing");
  return {release,pages_checked:4,acquisition_links_checked:4,waiting_links_checked:2,
    section_targets_checked:4};
}
async function get(path){
  assert.ok(Object.values(paths).includes(path)||path==="/wp-json/zaprazi/v1/affiliate-readiness");
  const url=origin+path;
  const response=await fetch(url,{redirect:"manual",
    headers:{Accept:path.startsWith("/wp-json/")?"application/json":"text/html"},
    signal:AbortSignal.timeout(25000)});
  assert.equal(response.status,200,"Public GET failed: "+path+" ("+response.status+")");
  const body=await response.text();
  assert.ok(body.length>0&&body.length<2500000,"Unexpected public response size: "+path);
  return body;
}
export async function verifyLiveMobilityAcquisition(){
  const readiness=checkReadiness(JSON.parse(await get("/wp-json/zaprazi/v1/affiliate-readiness")),
    SOURCE_THEME_RELEASE);
  assert.equal(readiness.release_matches,true,
    "PENDING DEPLOY: source release is not yet live; postdeploy acceptance cannot pass");
  const pages={};
  for(const [key,path] of Object.entries(paths))pages[key]=await get(path);
  // WordPress uses local calendar time. The audit runs after the monthly
  // expiry in Europe/Prague, not according to a potentially different CI TZ.
  const pragueDate=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Prague",
    year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const sukl=assertExpiredSuklEvidence(pages.insurance,pragueDate);
  const report=assertMobilityAcquisition(pages,SOURCE_THEME_RELEASE);
  console.log("ZP_MOBILITY_ACQUISITION_POSTDEPLOY",JSON.stringify({
    status:"verified",...report,integrity:"ok",affiliate_slots:25,
    sukl_monthly_evidence:sukl.status,
    note:"Public read-only acceptance; not proof of traffic, suitability or commissions"
  }));
  return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  verifyLiveMobilityAcquisition().catch(error=>{
    console.error("ZP_MOBILITY_ACQUISITION_POSTDEPLOY_FAILED",String(error));
    process.exitCode=1;
  });
}
