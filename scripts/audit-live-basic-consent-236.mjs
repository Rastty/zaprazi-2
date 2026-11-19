#!/usr/bin/env node
/**
 * Read-only 0.8.236+ postdeploy Basic Consent Mode acceptance in real Chrome.
 * Fresh browser contexts; no POST, affiliate clicks, questionnaire input, or
 * external requests. Google scripts are deliberately blocked at interception.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";
import {verifyBasicConsentQueue} from "./lib/basic-consent-audit.mjs";

const ORIGIN="https://zaprazi.cz";
const PATH="/choditka-pro-seniory/";
const LOCATION=ORIGIN+PATH;
const CONSENT_KEY="zaprazi_analytics_consent_v1";
const TAG_HOSTS=new Set([
  "www.googletagmanager.com","googletagmanager.com",
  "www.google-analytics.com","google-analytics.com",
  "region1.google-analytics.com"
]);
if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("BASIC_CONSENT_POSTDEPLOY_PR_SKIP");
  process.exit(0);
}
assert.equal(SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE,
  "The postdeploy smoke must inspect the checked-out theme release");
const [major,minor,patch]=SOURCE_THEME_RELEASE.split(".").map(Number);
assert.ok(major>0||(minor===8&&patch>=236)||(minor>8),
  "Basic Consent Mode was introduced in theme 0.8.236");

async function inspectReadiness(){
  const response=await fetch(ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness",{
    method:"GET",redirect:"error",signal:AbortSignal.timeout(20000),
    headers:{Accept:"application/json"}
  });
  assert.equal(response.status,200,"Production readiness must be public");
  const readiness=await response.json();
  assert.equal(readiness.release,SOURCE_THEME_RELEASE,"Source/theme not yet deployed");
  assert.equal(readiness.integrity,"ok","Theme assets are inconsistent");
  assert.ok(Number.isSafeInteger(readiness.slot_total)&&readiness.slot_total>=25);
  assert.equal(readiness.configured_total,readiness.slot_total);
}

function collectSnapshot(){
  const queue=Array.from(window.dataLayer||[],entry=>
    Array.from(entry,value=>JSON.parse(JSON.stringify(value))));
  return {
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    path:window.location.pathname,search:window.location.search,
    bannerVisible:document.querySelector("#zp-analytics-consent")?.hidden===false,
    allowPresent:Boolean(document.querySelector("#zp-analytics-allow")),
    denyPresent:Boolean(document.querySelector("#zp-analytics-deny")),
    settingsPresent:Boolean(document.querySelector("#zp-analytics-settings")),
    tagInDOM:Boolean(document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')),
    stored:localStorage.getItem("zaprazi_analytics_consent_v1"),
    queue
  };
}

function verifyPage(snapshot){
  assert.equal(snapshot.release,SOURCE_THEME_RELEASE,"Mixed production theme version");
  assert.equal(snapshot.integrity,"ok","Page integrity marker failed");
  assert.equal(snapshot.path,PATH);
  assert.equal(snapshot.search,"","No user query parameters permitted");
  assert.ok(snapshot.allowPresent&&snapshot.denyPresent&&snapshot.settingsPresent,
    "Consent controls missing");
}

async function runScenario(browser,preference){
  const context=await browser.createBrowserContext();
  let externalRequestsBlocked=0,tagRequestsBlocked=0,nonGetBlocked=0;
  let result;
  try{
    const page=await context.newPage();
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setBypassServiceWorker(true);
    await page.evaluateOnNewDocument((key,value)=>{
      try{
        if(value==="unknown")localStorage.removeItem(key);
        else localStorage.setItem(key,value);
      }catch{}
    },CONSENT_KEY,preference);
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let allowed=false;
      try{
        const url=new URL(request.url());
        allowed=url.origin===ORIGIN&&url.protocol==="https:"&&
          request.method()==="GET"&&
          ![...url.searchParams.keys()].some(key=>
            /answer|symptom|diagnos|health|patient|search|^s$/i.test(key));
        if(url.origin!==ORIGIN){
          externalRequestsBlocked++;
          if(TAG_HOSTS.has(url.hostname))tagRequestsBlocked++;
        }
      }catch{}
      if(request.method()!=="GET")nonGetBlocked++;
      void (allowed?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });
    const response=await page.goto(LOCATION,{waitUntil:"networkidle2",timeout:40000});
    assert.equal(response?.status(),200,"Consent smoke page not available");
    const before=await page.evaluate(collectSnapshot);
    verifyPage(before);
    assert.equal(before.stored,preference==="unknown"?null:preference);
    assert.equal(before.bannerVisible,preference==="unknown");
    if(preference!=="granted"){
      // An analytics event while still unknown/denied must not load Google.
      await page.evaluate(()=>window.dispatchEvent(new CustomEvent("zaprazi:analytics",{
        detail:{event:"builder_start"}
      })));
      const silent=await page.evaluate(collectSnapshot);
      assert.deepEqual(silent.queue,[],"Analytics queue exists without opt-in");
      assert.equal(silent.tagInDOM,false,"Google tag injected before consent");
      assert.equal(tagRequestsBlocked,0,"Google network request attempted before consent");
    }
    if(preference==="denied"){
      result={scenario:preference,ga4Calls:0};
    }else{
      if(preference==="unknown"){
        await page.click("#zp-analytics-allow");
        await page.waitForFunction(()=>window.dataLayer?.length>=4);
      }
      const allowed=await page.evaluate(collectSnapshot);
      verifyPage(allowed);
      assert.equal(allowed.stored,"granted");
      assert.equal(allowed.bannerVisible,false);
      assert.equal(allowed.tagInDOM,true,"Expected opted-in Google script element");
      verifyBasicConsentQueue(allowed.queue,LOCATION);
      await page.evaluate(()=>{
        window.dispatchEvent(new CustomEvent("zaprazi:analytics",{
          detail:{event:"builder_start"}
        }));
        window.dispatchEvent(new CustomEvent("zaprazi:analytics",{
          detail:{event:"builder_start",answer:"not-sent"}
        }));
      });
      const measured=await page.evaluate(collectSnapshot);
      const evidence=verifyBasicConsentQueue(measured.queue,LOCATION);
      assert.equal(evidence.anonymousEvents,1,"Anonymous funnel event once per page");
      for(let retry=0;retry<20&&tagRequestsBlocked===0;retry++){
        await new Promise(resolve=>setTimeout(resolve,100));
      }
      assert.ok(tagRequestsBlocked>=1,"Google tag request should be attempted only after opt-in");
      result={scenario:preference,ga4Calls:measured.queue.length};
      if(preference==="unknown"){
        await page.click("#zp-analytics-settings");
        await Promise.all([
          page.waitForNavigation({waitUntil:"networkidle2",timeout:30000}),
          page.click("#zp-analytics-deny")
        ]);
        const revoked=await page.evaluate(collectSnapshot);
        verifyPage(revoked);
        assert.equal(revoked.stored,"denied");
        assert.equal(revoked.tagInDOM,false,"Tag must not reload after revocation");
        assert.deepEqual(revoked.queue,[],"Revoked session may not queue GA4");
        result.revocation="denied_after_reload";
      }
    }
    assert.equal(nonGetBlocked,0,"No browser write requests allowed");
    return {...result,externalRequestsSent:0,externalRequestsBlocked};
  }finally{
    await context.close();
  }
}

async function main(){
  await inspectReadiness();
  const puppeteer=(await import("puppeteer-core")).default;
  const browser=await puppeteer.launch({
    executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
    headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
  });
  try{
    const unknown=await runScenario(browser,"unknown");
    const denied=await runScenario(browser,"denied");
    const granted=await runScenario(browser,"granted");
    await inspectReadiness();
    console.log("BASIC_CONSENT_POSTDEPLOY_PASS "+JSON.stringify({
      release:SOURCE_THEME_RELEASE,consent:"basic",unknown,denied,granted,
      thirdPartyRequestsSent:0,questionnairesSubmitted:0
    }));
  }finally{await browser.close()}
}

try{await main()}
catch{
  // Do not echo raw queue entries, page bodies, URLs, storage, or user values.
  console.error("BASIC_CONSENT_POSTDEPLOY_FAILED: one or more consent, privacy or release assertions failed");
  process.exitCode=1;
}
