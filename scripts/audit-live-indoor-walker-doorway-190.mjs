/**
 * Release 0.8.190 read-only Chrome acceptance: indoor walker narrow doorway.
 * Checks human-facing copy and safe links, not medical fit or merchant purchases.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request")
  throw new Error("Exact-source 0.8.190 Chrome acceptance is postdeploy-only");
if(SOURCE_THEME_RELEASE!=="0.8.190") {
  console.log("NOT_APPLICABLE: indoor walker door acceptance release 0.8.190");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.190");
const origin="https://zaprazi.cz";
const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(25000)
});
assert.equal(response.status,200,"Readiness endpoint unavailable");
const ready=await response.json();
assert.equal(ready.release,"0.8.190","WordPress source version not deployed");
assert.equal(ready.integrity,"ok","WordPress theme integrity incomplete");
assert.equal(ready.configured_total,25,"Merchant readiness must stay complete");
assert.equal(ready.slot_total,25,"Merchant positions must stay complete");

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
try {
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",request=>{
    // The audit must not submit, track a merchant click, or send answers.
    if(request.method()!=="GET")return request.abort();
    request.continue();
  });
  const result=await page.goto(origin+"/choditko-do-bytu-pro-seniory/",{
    waitUntil:"domcontentloaded",timeout:30000
  });
  assert.equal(result.status(),200,"Indoor walker page not HTTP 200");
  const actual=await page.evaluate(()=>{
    const id="zp-pruchod-choditko-byt";
    const section=document.getElementById(id);
    const faq=[...document.querySelectorAll("details")].find(d=>d.querySelector("summary")?.textContent?.includes("Kolik místa chodítko potřebuje"));
    const title=section?.querySelector("#zp-pruchod-choditko-byt-nadpis")?.textContent||"";
    const text=section?.innerText||"";
    const samePage=Array.from(section?.querySelectorAll("a")||[]).some(a=>a.hash==="#poradce-choditko-byt" && a.origin===location.origin);
    const measuring=Array.from(section?.querySelectorAll("a")||[]).some(a=>a.origin===location.origin && a.pathname==="/co-zmerit-pred-vyberem-choditka/" && a.hash==="#co-zmerit");
    return {
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      h1:document.querySelectorAll("main h1").length,
      section:!!section,title,text,
      steps:section?.querySelectorAll("ol.zp-checklist > li").length||0,
      warning:[...document.querySelectorAll("p.zp-disclaimer")].some(p=>p.textContent?.includes("šířka chodítka v katalogu není totéž")),
      faq:faq?.textContent||"",samePage,measuring,
      advisor:!!document.getElementById("zp-indoor-walker-advisor"),
      merchant:!!section?.querySelector("[data-zp-merchant-link], [data-zp-offer], form")
    };
  });
  assert.equal(actual.release,"0.8.190");
  assert.equal(actual.integrity,"ok");
  assert.equal(actual.h1,1);
  assert.equal(actual.section,true);
  assert.match(actual.title,/Projde chodítko dveřmi širokými 60 cm\?/);
  assert.match(actual.text,/Ze samotného čísla to bezpečně určit nelze/);
  assert.match(actual.text,/prostor pro ruce/);
  assert.match(actual.text,/neobjednávejte konkrétní model podle šířky z katalogu/);
  assert.equal(actual.steps,3);
  assert.equal(actual.warning,true);
  assert.match(actual.faq,/samotná stejná šířka dveří nestačí/);
  assert.equal(actual.samePage,true);
  assert.equal(actual.measuring,true);
  assert.equal(actual.advisor,true);
  assert.equal(actual.merchant,false);
  console.log("PASS_0_8_190_INDOOR_WALKER_DOOR",JSON.stringify({
    release:actual.release,integrity:actual.integrity,steps:actual.steps,
    advisorHandoff:true,measurementGuide:true,merchantClick:false
  }));
} finally {
  await browser.close();
}
