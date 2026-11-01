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
  assert.match(pragueDate,/^\d{4}-\d{2}-\d{2}$/,"Expected Prague calendar date");
  if(pragueDate<="2026-10-31")return {status:"not_yet_expired"};
  const rendered=clean(html);
  assert.match(rendered,/<h2>\s*Říjnový záznam už není aktuální\./i,
    "Expired SÚKL record still presented without a prominent stale headline");
  assert.match(rendered,/class=["']zp-stale-evidence["']/,
    "Expired SÚKL amount lacks a visible historical-data warning");
  assert.match(rendered,/Historická úhrada v říjnovém seznamu/i,
    "Expired SÚKL amount lacks a historical label");
  assert.doesNotMatch(rendered,/MEYRA Ideal:\s*3\s*408\s*Kč/i,
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

// 0.8.185 acceptance must inspect the *deployed HTML*, not only the PHP
// templates or the old 0.8.184 production seen by pull-request CI.
// It is intentionally read-only: no Advisor answers, merchant clicks or storage.
export function assertMobility185UX(pages,pragueDate){
  assert.match(pragueDate,/^\d{4}-\d{2}-\d{2}$/,"Expected Prague calendar date");
  const rental=clean(pages.rental),measuring=clean(pages.measuring);
  assert.ok(isExactAnchor(rental,"zp-otazky-pujcovna"),
    "0.8.185 rental call-preparation anchor not deployed");
  const callStart=rental.indexOf('id="zp-otazky-pujcovna"');
  const callEnd=rental.indexOf("</section>",callStart);
  assert.ok(callStart>=0&&callEnd>callStart,"Rental call preparation section missing");
  const call=rental.slice(callStart,callEnd);
  assert.match(call,/role="region"[^>]*tabindex="-1"[^>]*aria-labelledby="otazky-pujcovna-nadpis"/,
    "Rental call questions must be keyboard-focusable and named");
  const list=call.match(/<ol\b[^>]*class="zp-checklist"[^>]*>([\s\S]*?)<\/ol>/i)?.[1];
  assert.ok(list,"Rental call questions must be a visible ordered list");
  assert.equal((list.match(/<li\b/gi)||[]).length,5,
    "All five rental call questions must be present");
  for(const topic of ["Typ a dostupnost","Technická kontrola","Celkové náklady",
    "Předání a zaučení","Vrácení a závady"]){
    assert.ok(list.includes(topic),"Missing rental call question: "+topic);
  }
  assert.match(call,/Neberte automaticky jiný typ/,
    "Unavailable rental type must not silently become a substitute");
  assert.match(call,/pomůcku k převozu nepoužívejte/,
    "Rollator seat must not imply transport suitability");
  requireLinks(call,["/co-zmerit-pred-vyberem-choditka/#co-zmerit","/#poradce"],
    "rental call preparation");
  assert.doesNotMatch(call,/<form\b|<input\b|data-zp-merchant-link/i,
    "Call preparation must not collect answers or bypass fit gate");

  const measureStart=measuring.indexOf("Kontrolní seznam pro rodinu");
  const measureEnd=measuring.indexOf("Teď zvolte správnou cestu",measureStart);
  assert.ok(measureStart>=0&&measureEnd>measureStart,
    "Seven-point home checklist not deployed");
  const checklist=measuring.slice(measureStart,measureEnd);
  const steps=[...checklist.matchAll(/<div>\s*<span>(\d{2})<\/span>\s*<strong>/g)]
    .map(m=>m[1]);
  assert.deepEqual(steps,["01","02","03","04","05","06","07"],
    "Seven visible home checks must be in sequence");
  // Seven numbered cards alone are insufficient: a deployed template could
  // silently duplicate a topic and omit a safety-critical check.
  for(const topic of ["Nejužší průchod","Místo pro otočení","Výška madel",
    "Prahy a podlaha","Brzdy a sedátko","Nosnost a návod",
    "Složení a převoz"]){
    assert.ok(checklist.includes("<strong>"+topic+"</strong>"),
      "Missing live home checklist topic: "+topic);
  }
  assert.match(checklist,/Prahy a podlaha/);
  assert.match(checklist,/mokrá místa/);
  requireLinks(checklist,["/prahy-pro-choditko-a-vozik/#mereni-prahu"],
    "threshold measuring guidance");
  assert.doesNotMatch(checklist,/<form\b|<input\b|data-zp-merchant-link/i,
    "Home checklist must not collect private answers or show offers");

  if(pragueDate>"2026-11-06"){
    // The calculator can be disabled while individual price cards silently
    // revert to undated, apparently current amounts. Check the *rendered*
    // nine card values as well as the visible historical-evidence warning.
    const priceSection=section(rental,"ceny");
    assert.match(priceSection,/class=["']zp-stale-evidence["']/i,
      "Expired rental price cards need a visible stale-evidence warning");
    const priceValues=[...priceSection.matchAll(/<dd\\b[^>]*>([\\s\\S]*?)<\\/dd>/gi)]
      .map(m=>m[1].replace(/<[^>]*>/g,"").replace(/\\s+/g," ").trim());
    assert.equal(priceValues.length,9,
      "Expected all nine displayed rental rates/deposits in three provider cards");
    for(const value of priceValues){
      assert.match(value,/^(?:historicky\\b|ověřit u půjčovny \\(starší příklad:)/i,
        "Expired rental rate/deposit appears current instead of historical");
    }
    assert.doesNotMatch(rental,/<form\\b[^>]*id="zp-walker-rental-budget"/i,
      "Expired rental calculator must be absent from rendered HTML");
    assert.doesNotMatch(rental,/data-monthly-price=/i,
      "Expired rates must not remain in calculator attributes");
    assert.match(rental,/Přepočet není k dispozici/);
    assert.match(rental,/historicky 360 Kč/);
    assert.match(rental,/Historické příklady, nikoli aktuální nabídka/);
    assert.doesNotMatch(rental,/>Spočítat orientační půjčovné</,
      "Expired rental CTA must not imply a current rate");
  }else{
    assert.match(rental,/<form\b[^>]*id="zp-walker-rental-budget"/i,
      "Current-window calculator unexpectedly missing");
  }
  return {rental_call_questions:5,home_checks:7,
    rental_prices:pragueDate>"2026-11-06"?"expired_fail_closed":"within_review_window"};
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
  const release185=SOURCE_THEME_RELEASE.split(".").map(Number);
  const mobility185=(release185[0]>0||release185[1]>8||
    (release185[1]===8&&release185[2]>=185))
    ?assertMobility185UX(pages,pragueDate):null;
  console.log("ZP_MOBILITY_ACQUISITION_POSTDEPLOY",JSON.stringify({
    status:"verified",...report,integrity:"ok",affiliate_slots:25,
    sukl_monthly_evidence:sukl.status,release_185_ux:mobility185,
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
