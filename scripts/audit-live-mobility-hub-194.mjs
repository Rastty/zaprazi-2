/**
 * Exact-version read-only Chrome postdeploy acceptance for 0.8.194 Mobility hub.
 * Only safe same-origin GET requests; no offers, forms, tracking or user answers.
 * Tests the real click into Home Advisor after declining optional analytics.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_0_8_194_HUB");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.194"){
  console.log("NOT_APPLICABLE_0_8_194_HUB");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.194","Exact production version required");

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const response=await fetch(readinessUrl,{redirect:"error",
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(25000)});
assert.equal(response.status,200);
assert.equal(response.url,readinessUrl);
const readiness=await response.json();
assert.equal(readiness.release,"0.8.194","Version 0.8.194 not deployed");
assert.equal(readiness.integrity,"ok","Partial WordPress deploy");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    let blocked=0;
    page.on("request",req=>{
      let permitted=false;
      try{
        const url=new URL(req.url());
        permitted=req.method()==="GET" && url.origin===origin && !url.searchParams.has("s");
      }catch{}
      if(!permitted){blocked++;return req.abort().catch(()=>{});}
      return req.continue().catch(()=>{});
    });
    const live=await page.goto(origin+"/choditka-pro-seniory/",
      {waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(live.status(),200,"Mobility hub missing");

    const hero=await page.evaluate(()=>{
      const root=document.querySelector("main .zp-hero");
      const primary=root?.querySelector("a.zp-btn");
      const alternate=[...(root?.querySelectorAll("a[href]")||[])].filter(a=>
        a.href===location.origin+"/choditka-pro-seniory/#vyber-typu");
      return{
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        primaryHref:primary?.href,
        primaryText:primary?.textContent?.trim(),
        primaryVisible:Boolean(primary&&primary.getClientRects().length&&
          getComputedStyle(primary).visibility!=="hidden"),
        event:primary?.getAttribute("data-zp-journey"),
        alternateCount:alternate.length,
        compareSection:Boolean(document.querySelector("#vyber-typu")),
        merchantShortcut:Boolean(root?.querySelector(
          'a[rel~="sponsored"],[data-zp-offer],[data-zp-affiliate-target]')),
        forms:root?.querySelectorAll("form").length||0,
        secondaryTitles:[...root?.querySelectorAll("a.zp-text-link")||[]]
          .map(a=>a.textContent?.trim()||"")
      };
    });
    assert.equal(hero.release,"0.8.194");
    assert.equal(hero.integrity,"ok");
    assert.equal(hero.primaryHref,origin+"/#poradce");
    assert.equal(hero.primaryText,"Ověřit vhodný typ v poradci");
    assert.equal(hero.primaryVisible,true);
    assert.equal(hero.event,"advisor");
    assert.equal(hero.alternateCount,1);
    assert.equal(hero.compareSection,true);
    assert.equal(hero.merchantShortcut,false);
    assert.equal(hero.forms,0);
    assert.ok(hero.secondaryTitles.includes("Porovnat typy chodítek"));

    // First-visit privacy banner can overlay the actual CTA at mobile width.
    const showConsent=await page.evaluate(()=>{
      const panel=document.querySelector("#zp-analytics-consent");
      return Boolean(panel&&!panel.hidden&&panel.getClientRects().length);
    });
    if(showConsent){
      await page.click("#zp-analytics-deny");
      await page.waitForFunction(
        ()=>document.querySelector("#zp-analytics-consent")?.hidden===true,
        {timeout:5000});
    }

    await page.click("main .zp-hero a.zp-btn");
    await page.waitForFunction(url=>location.href===url,
      {timeout:18000,polling:250},origin+"/#poradce");
    assert.equal(page.url(),origin+"/#poradce",
      "Actual user must be routed directly into Home Advisor");
    await page.waitForSelector("#poradce #zp-mobility-advisor",
      {visible:true,timeout:18000});
    const target=await page.evaluate(()=>{
      const section=document.querySelector("#poradce");
      return {
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        visible:Boolean(section&&section.getClientRects().length),
        form:Boolean(section?.querySelector("#zp-mobility-advisor"))
      };
    });
    assert.equal(target.release,"0.8.194");
    assert.equal(target.integrity,"ok");
    assert.equal(target.visible,true);
    assert.equal(target.form,true);
    console.log("PASS_0_8_194_MOBILITY_HUB_TO_ADVISOR",JSON.stringify({
      release:"0.8.194",entry:"/choditka-pro-seniory/",
      destination:"/#poradce",comparisonPreserved:true,
      affiliateConfigured:25,requestsBlocked:blocked,
      merchantClicks:0,posts:0,answersSent:0
    }));
  }finally{await page.close();}
}finally{await browser.close();}
