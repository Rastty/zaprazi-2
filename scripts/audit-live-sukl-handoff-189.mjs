/**
 * Read-only Chrome acceptance for the 0.8.189 monthly SÚKL source handoff.
 * No Advisor answers, form submissions, merchant clicks, login, or WP writes.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request")
  throw new Error("0.8.189 exact-source Chrome check is postdeploy only");
if(SOURCE_THEME_RELEASE!=="0.8.189"){
  console.log("NOT_APPLICABLE: SÚKL handoff release 0.8.189");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE);
const origin="https://zaprazi.cz";
const readinessResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  redirect:"error",signal:AbortSignal.timeout(25000)
});
assert.equal(readinessResponse.status,200,"Readiness API must respond HTTP 200");
const readiness=await readinessResponse.json();
assert.equal(readiness.release,"0.8.189","New WordPress release must be deployed");
assert.equal(readiness.integrity,"ok","100-file integrity must be complete");
assert.equal(readiness.configured_total,25,"25 configured merchant slots preserved");
assert.equal(readiness.slot_total,25,"25 merchant slots preserved");

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let writes=0;
try {
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",req=>{
    if(req.method()!=="GET"){writes++;return req.abort();}
    req.continue();
  });
  const response=await page.goto(origin+"/choditko-na-pojistovnu/",{
    waitUntil:"domcontentloaded",timeout:30000
  });
  assert.equal(response.status(),200);
  const snapshot=await page.evaluate(()=>{
    const official="https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01973@SUKLAA";
    const index="https://eud.sukl.gov.cz/pub/deska/40000001/athena/?kategorie_id=11";
    const section=document.getElementById("zp-overit-mesicni-seznam");
    const link=(href)=>[...document.querySelectorAll("a[href]")].some(a=>a.href===href);
    return {
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      section:!!section,sectionText:section?.innerText||"",
      novemberLink:link(official),
      officialIndexLink:link(index),
      historical:document.body.innerText.includes("Historická úhrada v říjnovém seznamu"),
      octoberCurrent:document.body.innerText.includes("Úhrada v aktuálním říjnovém seznamu"),
      heroHandoff:[...document.querySelectorAll(".zp-hero a[href]")].some(a=>a.hash==="#zp-overit-mesicni-seznam"),
      hasMerchantRoute:!!section?.querySelector("[data-zp-merchant-link], [data-zp-offer]")
    };
  });
  assert.equal(snapshot.release,"0.8.189");
  assert.equal(snapshot.integrity,"ok");
  assert.equal(snapshot.section,true,"Current-source section must be present");
  assert.equal(snapshot.heroHandoff,true,"Expired summary must link to source section");
  assert.equal(snapshot.officialIndexLink,true,"Always provide official SÚKL ZP index");
  assert.equal(snapshot.historical,true,"October amount must remain labelled historical");
  assert.equal(snapshot.octoberCurrent,false,"Do not show an expired amount as current");
  assert.equal(snapshot.hasMerchantRoute,false,"Official-source section must not become a sales route");
  const today=new Intl.DateTimeFormat("sv-SE",{
    timeZone:"Europe/Prague",year:"numeric",month:"2-digit"
  }).format(new Date());
  if(today==="2026-11"){
    assert.equal(snapshot.novemberLink,true,"Exact final November SÚKL record link");
    assert.match(snapshot.sectionText,/sukl313250\/2026/);
    assert.match(snapshot.sectionText,/nemáme jednotlivý záznam kódu 5005963 pro listopad ověřený/);
  } else {
    assert.equal(snapshot.novemberLink,false,"Do not imply November record is the current month");
  }
  assert.equal(writes,0,"No POST or submission permitted in browser audit");
  console.log("PASS_0_8_189_SUKL_SOURCE_HANDOFF",JSON.stringify({
    release:snapshot.release,integrity:snapshot.integrity,
    official_source_index:true,historical_amount_label:true,
    november_direct_link:snapshot.novemberLink,merchant_clicks:0,
    synthetic_health_answers:0,forbidden_writes:writes
  }));
  await page.close();
} finally {await browser.close();}
