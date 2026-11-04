/**
 * Exact-release Chrome acceptance for 0.8.193's two Mobility acquisition CTAs.
 * Strict read-only browser: same-origin GET only, no forms, offers, user answers,
 * analytics, merchant clicks or outbound requests.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_0_8_193_DIRECT_ENTRY");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.193"){
  console.log("NOT_APPLICABLE_0_8_193_DIRECT_ENTRY");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.193");

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const res=await fetch(readinessUrl,{redirect:"error",headers:{Accept:"application/json"},
  signal:AbortSignal.timeout(25000)});
assert.equal(res.status,200,"Live release readiness unavailable");
assert.equal(res.url,readinessUrl,"Readiness redirected");
const ready=await res.json();
assert.equal(ready.release,"0.8.193","WordPress 0.8.193 not deployed");
assert.equal(ready.integrity,"ok","Mixed production theme");
assert.equal(ready.configured_total,25,"Missing existing affiliate configuration");
assert.equal(ready.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage"]
});
const journeys=[
  "/pujceni-choditka/",
  "/choditko-na-pojistovnu/"
];
try{
  for(const path of journeys){
    const page=await browser.newPage();
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      await page.setRequestInterception(true);
      page.on("request",request=>{
        let isSameOrigin=false;
        try{isSameOrigin=new URL(request.url()).origin===origin;}catch{}
        if(request.method()!=="GET"||!isSameOrigin)return request.abort();
        return request.continue();
      });
      const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
      assert.equal(response.status(),200,"Acquisition landing missing: "+path);
      const landing=await page.evaluate(expected=>{
        const hero=document.querySelector("main .zp-hero");
        const primary=hero?.querySelector("a.zp-btn");
        const alternate=[...(hero?.querySelectorAll("a[href]")||[])].filter(a=>
          a.href===location.origin+"/choditka-pro-seniory/#vyber-typu");
        return {
          release:document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          primaryHref:primary?.href,
          journey:primary?.getAttribute("data-zp-journey"),
          primaryVisible:Boolean(primary&&primary.getClientRects().length&&
            getComputedStyle(primary).visibility!=="hidden"),
          primaryText:primary?.textContent?.trim(),
          alternateCount:alternate.length,
          merchantShortcut:Boolean(hero?.querySelector(
            '[data-zp-offer],[data-zp-merchant-link],[data-zp-affiliate-target],a[rel~="sponsored"]')),
          forms:hero?.querySelectorAll("form").length||0
        };
      },origin+"/#poradce");
      assert.equal(landing.release,"0.8.193","Landing template stale");
      assert.equal(landing.integrity,"ok");
      assert.equal(landing.primaryHref,origin+"/#poradce","Primary CTA must skip hub");
      assert.equal(landing.journey,"advisor","Consent-gated generic handoff marker missing");
      assert.equal(landing.primaryVisible,true,"Main CTA must be visible on mobile");
      assert.match(landing.primaryText,/Ověřit vhodný typ v poradci/);
      assert.equal(landing.alternateCount,1,"Keep exactly one compare-first option");
      assert.equal(landing.merchantShortcut,false,"Acquisition hero must not bypass product fit gate");
      assert.equal(landing.forms,0,"No answer collection on acquisition hero");

      // Some WordPress navigation may commit as a same-document history update
      // rather than a new document load. Assert the destination URL and real
      // Advisor instead of requiring a Puppeteer NavigationResponse object.
      const navigatedPaths=[];
      page.on("framenavigated",frame=>{
        if(frame===page.mainFrame()){
          try{
            const u=new URL(frame.url());
            navigatedPaths.push(u.pathname+u.hash);
          }catch{}
        }
      });
      await page.click("main .zp-hero a.zp-btn");
      try{
        await page.waitForFunction(
          url=>window.location.href===url,
          {timeout:15000,polling:250},
          origin+"/#poradce"
        );
      }catch(error){
        let current="unavailable";
        try{
          const u=new URL(page.url());
          current=u.pathname+u.hash;
        }catch{}
        // Public paths only. Never log sensitive query strings or Advisor answers.
        console.error("ZP_DIRECT_ENTRY_CLICK_DIAGNOSTIC",JSON.stringify({
          source:path,destination:current,
          browserTransitions:navigatedPaths,
          expected:"/#poradce"
        }));
        throw error;
      }
      assert.equal(page.url(),origin+"/#poradce","Unclean or incorrect Advisor handoff URL");
      const target=await page.evaluate(()=>{
        const section=document.getElementById("poradce");
        return {
          release:document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          sectionVisible:Boolean(section&&section.getClientRects().length&&
            getComputedStyle(section).visibility!=="hidden"),
          form:Boolean(section?.querySelector("#zp-mobility-advisor"))
        };
      });
      assert.equal(target.release,"0.8.193");
      assert.equal(target.integrity,"ok");
      assert.equal(target.sectionVisible,true,"Advisor is hidden or missing");
      assert.equal(target.form,true,"Actual Home Advisor form not found");
    }finally{await page.close();}
  }
  console.log("PASS_0_8_193_DIRECT_MOBILITY_ENTRY",JSON.stringify({
    release:"0.8.193",journeys,advisor:"/#poradce",compareFirst:true,
    merchantClicks:0,answerPayloads:0,postRequests:0
  }));
}finally{await browser.close();}
