/**
 * 0.8.187 production-only browser acceptance: practical next action after
 * mobility decisions. Synthetic answers only; no merchant clicks, no writes,
 * and no health answers or user identifiers in the recorded logs.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE, EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";
if(process.env.GITHUB_EVENT_NAME==="pull_request")
  throw new Error("Postdeploy acceptance cannot be substituted by PR against an old site");
if(SOURCE_THEME_RELEASE!=="0.8.187"){
  console.log("NOT_APPLICABLE: legacy Mobility first-action 0.8.187 smoke");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE);
const origin="https://zaprazi.cz";
const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness");
assert.equal(response.status,200);
const readiness=await response.json();
assert.equal(readiness.release,"0.8.187","Exact production version required");
assert.equal(readiness.integrity,"ok","All theme files must agree");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const rejected=[],errors=[];
async function scenario(values){
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",request=>{
    if(request.method()!=="GET" || !request.url().startsWith(origin+"/")){
      rejected.push({method:request.method(),type:request.resourceType()});
      return request.abort();
    }
    request.continue();
  });
  page.on("pageerror",error=>errors.push(String(error?.message||error)));
  const res=await page.goto(origin+"/",{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(res.status(),200);
  const meta=await page.evaluate(()=>({
    version:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
  }));
  assert.deepEqual(meta,{version:"0.8.187",integrity:"ok"});
  const banner=await page.$("#zp-analytics-consent");
  if(banner && await page.$eval("#zp-analytics-consent",e=>!e.hidden)){
    await page.click("#zp-analytics-deny");
    assert.equal(await page.$eval("#zp-analytics-consent",e=>e.hidden),true);
  }
  for(const [name,value]of Object.entries(values)){
    const selector='input[name="'+name+'"][value="'+value+'"]';
    await page.$eval(selector,e=>{e.checked=true;e.dispatchEvent(new Event("change",{bubbles:true}));});
  }
  await page.click("#zp-mobility-submit");
  const snapshot=await page.evaluate(()=>{
    const result=document.querySelector("#zp-mobility-result");
    const guide=result?.querySelector(".zp-result-orientation");
    const products=result?.querySelector(".zp-product-section");
    const sections=[...result?.querySelectorAll(".zp-orientation-list li")||[]];
    return{
      shown:!!result&&!result.hidden,
      guideCount:sections.length,
      headings:sections.map(e=>e.querySelector("strong")?.textContent?.trim()),
      guideBeforeProducts:!!guide&&!!products&&
        !!(guide.compareDocumentPosition(products)&Node.DOCUMENT_POSITION_FOLLOWING),
      productCount:result?.querySelectorAll(".zp-product-card").length||0,
      locked:result?.querySelectorAll(".zp-fit-locked-offers[hidden]").length||0,
      visibleMerchantLinks:result?.querySelectorAll('a[data-zp-merchant-link]:not(.zp-fit-locked-offers a)').length||0,
      hasAcquisition:!!result?.querySelector(".zp-acquisition-summary"),
      title:guide?.querySelector("h3")?.textContent?.trim(),
      hasEdit:!!result?.querySelector("[data-zp-edit-answers]"),
      hash:location.hash,search:location.search
    };
  });
  assert.equal(snapshot.shown,true);
  assert.equal(snapshot.guideCount,3,"Plain-language three-step overview required");
  assert.deepEqual(snapshot.headings,["Co víme","Co ověřit","Jak bezpečně pokračovat"]);
  assert.equal(snapshot.title,"Co teď udělat");
  assert.equal(snapshot.search,"","Answers must not leak into URL");
  assert.equal(snapshot.hasEdit,true);
  return{page,snapshot};
}
try{
  const safe=await scenario({environment:"indoor",supportNeed:"steady",canLiftWalker:"yes"});
  assert.equal(safe.snapshot.guideBeforeProducts,true,"Guide must precede detail and offers");
  assert.ok(safe.snapshot.productCount>0,"Safe candidate should show details");
  assert.ok(safe.snapshot.locked>0,"Product offers must remain individually locked");
  // Changing a safety answer must immediately invalidate the visible result.
  await safe.page.$eval('input[name="supportNeed"][value="unknown"]',e=>{
    e.checked=true;e.dispatchEvent(new Event("change",{bubbles:true}));
  });
  assert.equal(await safe.page.$eval("#zp-mobility-result",e=>e.hidden),true);
  assert.equal(await safe.page.$eval("#zp-mobility-result",e=>e.innerHTML),"");
  await safe.page.close();

  const brake=await scenario({environment:"outdoor",supportNeed:"steady",handBrakes:"no"});
  assert.equal(brake.snapshot.productCount,0);
  assert.equal(brake.snapshot.locked,0);
  assert.equal(brake.snapshot.hasAcquisition,false);
  assert.equal(brake.snapshot.visibleMerchantLinks,0);
  await brake.page.close();

  const human=await scenario({environment:"indoor",supportNeed:"person_assist"});
  assert.equal(human.snapshot.productCount,0);
  assert.equal(human.snapshot.hasAcquisition,false);
  assert.equal(human.snapshot.visibleMerchantLinks,0);
  await human.page.close();
  assert.deepEqual(errors,[],"No JavaScript runtime errors");
  assert.ok(!rejected.some(x=>x.method!=="GET"),"No POST, health submission or merchant writes");
  console.log("PASS 0.8.187 live Mobility: safe candidate, unknown change clears result, blocked brakes and physical help, 25/25");
}finally{await browser.close();}
