/**
 * Exact-release read-only live Chrome acceptance for moving the optional
 * consent adapter from <head> to wp_footer() in 0.8.195.
 *
 * It NEVER grants analytics consent, sends answer payloads, POSTs, or follows
 * affiliate links. Tests a real mobile user denying measurement, reopening
 * preferences, and reaching the existing Home Advisor from the Mobility hub.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_0_8_195_FOOTER_CONSENT");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.195"){
  console.log("NOT_APPLICABLE_0_8_195_FOOTER_CONSENT");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.195");

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const fetched=await fetch(readinessUrl,{redirect:"error",
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(20000)});
assert.equal(fetched.status,200,"Readiness JSON unavailable");
assert.equal(fetched.url,readinessUrl,"Redirected readiness");
const readiness=await fetched.json();
assert.equal(readiness.release,"0.8.195","New theme not yet deployed");
assert.equal(readiness.integrity,"ok","Mixed theme runtime release");
assert.equal(readiness.configured_total,25,"Existing configured merchant slots missing");
assert.equal(readiness.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]
});
try{
  const page=await browser.newPage();
  let analyticsAttempts=0,externalBlocked=0,postRequests=0,merchantAttempts=0;
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setDefaultTimeout(18000);
    await page.setRequestInterception(true);
    page.on("request",request=>{
      const url=request.url();
      let allowed=false;
      try{
        const parsed=new URL(url);
        allowed=request.method()==="GET"&&parsed.origin===origin&&
          !parsed.searchParams.has("s");
        if(/(?:^|\.)google-analytics\.com$|(?:^|\.)googletagmanager\.com$/i.test(parsed.hostname))
          analyticsAttempts++;
        if(parsed.origin!==origin){
          externalBlocked++;
          if(/rehabilitacn|lekarna|drmax|unizdrav|rehavita|obuv/i.test(parsed.hostname))
            merchantAttempts++;
        }
      }catch{}
      if(request.method()!=="GET")postRequests++;
      (allowed?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });
    const response=await page.goto(origin+"/choditka-pro-seniory/",
      {waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(response?.status(),200);
    assert.equal(page.url(),origin+"/choditka-pro-seniory/");

    const footer=await page.evaluate(()=>{
      const script=[...document.querySelectorAll('script[src]')].filter(el=>
        el.src.includes("/assets/js/analytics-consent.js"));
      const config=document.querySelector('#zaprazi-analytics-consent-js-before');
      const adapter=script[0];
      const banner=document.querySelector("#zp-analytics-consent");
      const settings=document.querySelector("#zp-analytics-settings");
      const hero=document.querySelector("main .zp-hero");
      return{
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        count:script.length,
        inFooter:adapter?.parentElement===document.body,
        configInFooter:Boolean(config&&config.parentElement===document.body),
        configBeforeAdapter:Boolean(config&&adapter&&
          (config.compareDocumentPosition(adapter)&Node.DOCUMENT_POSITION_FOLLOWING)),
        bannerBeforeConfig:Boolean(banner&&config&&
          (banner.compareDocumentPosition(config)&Node.DOCUMENT_POSITION_FOLLOWING)),
        settingsBeforeConfig:Boolean(settings&&config&&
          (settings.compareDocumentPosition(config)&Node.DOCUMENT_POSITION_FOLLOWING)),
        bannerPresent:Boolean(banner),
        bannerHidden:banner?.hidden,
        allowPresent:Boolean(document.querySelector("#zp-analytics-allow")),
        denyPresent:Boolean(document.querySelector("#zp-analytics-deny")),
        heroPrimary:hero?.querySelector("a.zp-btn")?.href,
        compareAlternate:Boolean([...hero?.querySelectorAll("a[href]")||[]]
          .find(a=>a.href===location.origin+"/choditka-pro-seniory/#vyber-typu"))
      };
    });
    assert.equal(footer.release,"0.8.195");
    assert.equal(footer.integrity,"ok");
    assert.equal(footer.count,1,"Exactly one analytics adapter");
    assert.equal(footer.inFooter,true,"Opt-in script still blocks head");
    assert.equal(footer.configInFooter,true,"Inline config not moved together with adapter");
    assert.equal(footer.configBeforeAdapter,true,"Config executes too late");
    assert.equal(footer.bannerBeforeConfig,true,"Banner must exist when adapter executes");
    assert.equal(footer.settingsBeforeConfig,true,"Settings must exist when adapter executes");
    assert.equal(footer.allowPresent,true);
    assert.equal(footer.denyPresent,true);
    assert.equal(footer.heroPrimary,origin+"/#poradce");
    assert.equal(footer.compareAlternate,true);

    await page.waitForFunction(()=>{
      const b=document.querySelector("#zp-analytics-consent");
      return Boolean(b&&!b.hidden&&b.getClientRects().length);
    },{timeout:12000});
    assert.equal(analyticsAttempts,0,"GA4 attempted before explicit consent");

    await page.click("#zp-analytics-deny");
    await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===true);
    assert.equal(analyticsAttempts,0,"GA4 attempted after user declined");
    await page.click("#zp-analytics-settings");
    await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===false);
    await page.click("#zp-analytics-deny");
    await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===true);

    await page.click("main .zp-hero a.zp-btn");
    await page.waitForFunction(url=>location.href===url,
      {timeout:18000,polling:250},origin+"/#poradce");
    await page.waitForSelector("#poradce #zp-mobility-advisor",
      {visible:true,timeout:18000});
    const target=await page.evaluate(()=>({
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      formVisible:Boolean(document.querySelector("#poradce #zp-mobility-advisor")?.getClientRects().length),
      preference:localStorage.getItem("zaprazi_analytics_consent_v1"),
      ga4ScriptPresent:Boolean(document.querySelector('script[src*="googletagmanager.com/gtag/js"]'))
    }));
    assert.equal(target.release,"0.8.195");
    assert.equal(target.integrity,"ok");
    assert.equal(target.formVisible,true);
    assert.equal(target.preference,"denied");
    assert.equal(target.ga4ScriptPresent,false);
    assert.equal(analyticsAttempts,0,"Analytics must not load on either page after denial");
    assert.equal(postRequests,0,"Read-only test may not post any data");
    assert.equal(merchantAttempts,0,"Read-only test may not click affiliate merchants");
    console.log("PASS_0_8_195_FOOTER_CONSENT_MOBILITY",JSON.stringify({
      release:"0.8.195",source:"/choditka-pro-seniory/",
      advisor:"/#poradce",scriptPlacement:"footer",configBeforeAdapter:true,
      controlsPresentBeforeScript:true,preferences:"denied",analyticsAttempts,
      externalBlocked,postRequests,merchantAttempts,affiliateSlots:25
    }));
  }finally{await page.close();}
}finally{await browser.close();}
