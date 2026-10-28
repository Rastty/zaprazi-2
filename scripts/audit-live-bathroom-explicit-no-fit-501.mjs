/**
 * Read-only, production Chrome acceptance for explicit negative practical fit.
 * Never clicks merchants, never sends non-GET requests, and never persists answers.
 * Requires a FULL WordPress deploy of PR #501 and PR #502.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
  .filter(Boolean).find(file=>{try{accessSync(file,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Chrome binary required; do not pretend this is browser QA");
const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(25000)});
assert.equal(response.status,200,"readiness");
const ready=await response.json();
assert.equal(ready.integrity,"ok","full WordPress deployment is required");
assert.equal(ready.configured_total,ready.slot_total);
assert.ok(ready.slot_total>=25);

const specs=[
 {id:"unstable_shower_floor",need:"shower_seated",stageOne:{floorStable:"no"}},
 {id:"shower_space_incompatible",need:"shower_seated",stageOne:{floorStable:"yes"},stageTwo:{spaceFit:"no",loadFit:"yes"}},
 {id:"WC_attachment_incompatible",need:"raise_toilet",stageTwo:{toiletFit:"no",feetFlatAtRaisedHeight:"yes",loadFit:"yes"},fix:["toiletFit","yes"]},
 {id:"WC_feet_unsupported",need:"raise_toilet",stageTwo:{toiletFit:"yes",feetFlatAtRaisedHeight:"no",loadFit:"yes"},fix:["feetFlatAtRaisedHeight","yes"]},
 {id:"WC_capacity_insufficient",need:"raise_toilet",stageTwo:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"no"},fix:["loadFit","yes"]},
 {id:"WC_support_frame_incompatible",need:"toilet_support",stageOne:{wallFixing:"unverified"},stageTwo:{supportFrameFit:"no",loadFit:"yes"},fix:["supportFrameFit","yes"]},
 {id:"bath_both_variants_incompatible",need:"bath_transfer",stageOne:{bathTransferIndependent:"yes"},stageTwo:{bathFit:"no",bathBenchFit:"no",loadFit:"yes"}}
];

const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const jsErrors=[],nonGets=[],checks=[];
try{
 for(const spec of specs){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   page.setDefaultTimeout(16000);
   await page.evaluateOnNewDocument(()=>{
     window.__zpQaEvents=[];
     window.addEventListener("zaprazi:analytics",e=>window.__zpQaEvents.push(e.detail));
   });
   await page.setRequestInterception(true);
   page.on("request",req=>{
     if(req.method()!=="GET"){nonGets.push({scenario:spec.id,method:req.method()});return req.abort();}
     if(req.url().startsWith(origin+"/")||req.url().startsWith("data:")||req.url().startsWith("about:"))
       return req.continue();
     return req.abort();
   });
   page.on("pageerror",error=>jsErrors.push({scenario:spec.id,message:error.message}));
   const route=await page.goto(origin+"/koupelna-a-wc/",{waitUntil:"networkidle2",timeout:45000});
   assert.equal(route?.status(),200,spec.id+" HTTP");
   const meta=await page.evaluate(()=>({
     release:document.querySelector('meta[name="zaprazi-release"]')?.content,
     integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
     canonical:document.querySelector('link[rel="canonical"]')?.href
   }));
   assert.equal(meta.release,ready.release);
   assert.equal(meta.integrity,"ok");
   assert.equal(meta.canonical,origin+"/koupelna-a-wc/");
   const pick=async(name,value)=>page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>{
     if(el.closest("[hidden]"))throw new Error("Cannot select hidden "+el.name);
     el.click();
   });
   const submit=()=>page.$eval("#zp-bathroom-submit",b=>b.click());
   const waitResult=()=>page.waitForFunction(()=>document.querySelector("#zp-bathroom-result")?.hidden===false);
   const readResult=()=>page.$eval("#zp-bathroom-result",el=>({
     hidden:el.hidden,
     html:el.innerHTML,
     label:el.querySelector(".zp-result-status")?.textContent?.trim(),
     focus:el.querySelectorAll("[data-zp-bathroom-focus]").length,
     merchant:el.querySelectorAll('[data-zp-bath-merchant-link],[data-zp-merchant-link],.zp-offers a[href]').length,
     offers:el.querySelectorAll(".zp-offer").length,
     cards:el.querySelectorAll(".zp-product-card").length,
     acquisition:el.querySelectorAll(".zp-acquisition,.zp-acquisition-options").length,
     guides:el.querySelectorAll(".zp-bath-safe-guide").length
   }));
   await pick("primaryNeed",spec.need);
   await pick("transferAbility","independent");
   await pick("duration","long_term");
   for(const [name,value] of Object.entries(spec.stageOne||{}))await pick(name,value);
   await submit();
   if(spec.stageTwo){
     await page.waitForFunction(()=>document.querySelector("#zp-bathroom-fit-stage")?.hidden===false);
     const preview=await page.$eval("#zp-bathroom-preview",el=>({
       hidden:el.hidden,
       cards:el.querySelectorAll(".zp-product-card").length,
       merchant:el.querySelectorAll('[data-zp-bath-merchant-link],.zp-offers a[href]').length
     }));
     assert.equal(preview.hidden,false,spec.id+" no preliminary stage");
     assert.ok(preview.cards>0,spec.id+" no factual preview");
     assert.equal(preview.merchant,0,spec.id+" commercial link before confirmation");
     for(const [name,value] of Object.entries(spec.stageTwo))await pick(name,value);
     await submit();
   }
   await waitResult();
   const blocked=await readResult();
   assert.equal(blocked.label,"Tato varianta nevyhovuje",spec.id+" must distinguish no from unknown");
   assert.equal(blocked.focus,0,spec.id+" must not suggest changing a known negative");
   assert.equal(blocked.merchant,0,spec.id+" merchant revealed after explicit negative");
   assert.equal(blocked.offers,0,spec.id+" offer revealed after explicit negative");
   assert.equal(blocked.cards,0,spec.id+" recommendation card revealed after explicit negative");
   assert.equal(blocked.acquisition,0,spec.id+" acquisition revealed after explicit negative");
   assert.equal(blocked.guides,1,spec.id+" must retain one safe editorial route");
   const analytics=await page.evaluate(()=>window.__zpQaEvents);
   assert.ok(!analytics.some(e=>["builder_complete","recommendation_view","merchant_click","product_click"].includes(e?.event)),
      spec.id+" must not record blocked outcome as a successful recommendation or merchant click");
   assert.ok(analytics.every(e=>e&&Object.keys(e).length===1&&typeof e.event==="string"),
      spec.id+" analytics must contain event only, never answers");
   if(!spec.stageTwo){
     assert.equal(await page.$eval("#zp-bathroom-fit-stage",el=>el.hidden),true,
       spec.id+" must not show product fit stage on unsafe floor/space");
   }
   if(spec.fix){
     await pick(...spec.fix);
     const cleared=await readResult();
     assert.equal(cleared.hidden,true,spec.id+" stale negative result still visible");
     assert.equal(cleared.html.length,0,spec.id+" old result still retained");
     await submit();await waitResult();
     const approved=await readResult();
     assert.ok(approved.merchant>0,spec.id+" safe correction should permit verified candidate");
     assert.equal(approved.focus,0);
   }
   const url=await page.evaluate(()=>({path:location.pathname,search:location.search}));
   assert.deepEqual(url,{path:"/koupelna-a-wc/",search:""});
   checks.push({scenario:spec.id,blocked:true,offers:0,merchantClicks:0,postRequests:0});
   console.log("PASS live explicit negative fit:",spec.id);
  }finally{await page.close();}
 }
 assert.deepEqual(jsErrors,[],"JavaScript exceptions in live browser");
 assert.deepEqual(nonGets,[],"Non-GET request from live browser");
 console.log("LIVE_BATHROOM_EXPLICIT_NO_FIT_501",JSON.stringify({
  release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
  scenarios:checks.length,results:checks,merchantClicks:0,postRequests:0
 }));
}finally{await browser.close();}
