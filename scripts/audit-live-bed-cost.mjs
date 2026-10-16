/**
 * Read-only 0.8.139 acceptance: real optional rent-vs-buy calculation, no
 * WP writes, no form transmission, no invented pricing or merchant click.
 * Purely fabricated amounts are test inputs, not user-facing price claims.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
const origin="https://zaprazi.cz",version="0.8.139";
const acquisition="/polohovaci-postel-na-pojistovnu/";
const advisor="/polohovaci-postel/";
const readyResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(30000)
});
assert.equal(readyResponse.status,200,"Readiness route is unavailable");
const ready=await readyResponse.json();
assert.equal(ready.release,version,"Live WordPress version does not match 0.8.139");
assert.equal(ready.integrity,"ok","Theme deployment incomplete");
assert.equal(ready.configured_total,25,"Affiliate setup unexpectedly changed");
assert.equal(ready.slot_total,25,"Affiliate slot inventory unexpectedly changed");
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const activity=[],jsErrors=[];
const normalize=s=>String(s??"").replace(/\s+/g," ").trim();
async function pageFor(path,js){
  const page=await browser.newPage();
  await page.setJavaScriptEnabled(js);
  await page.setRequestInterception(true);
  page.on("pageerror",err=>jsErrors.push(String(err.message)));
  page.on("request",req=>{
    const url=req.url(),method=req.method();
    activity.push({url,method,type:req.resourceType(),main:req.isNavigationRequest()});
    // Prevent external marketing, analytics, CDN and all outbound merchant calls.
    if(!url.startsWith(origin+"/")||method!=="GET")return req.abort();
    req.continue();
  });
  const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response?.status(),200,"Page unavailable "+path);
  const metadata=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    h1:document.querySelectorAll("main h1").length,
    ids:[...document.querySelectorAll("[id]")].map(n=>n.id),
    links:[...document.querySelectorAll("main a[href]")].map(a=>({href:a.href,text:a.textContent?.trim()}))
  }));
  assert.equal(metadata.release,version,"Incorrect page release "+path);
  assert.equal(metadata.integrity,"ok","Incorrect integrity "+path);
  assert.equal(metadata.canonical,origin+path,"Incorrect canonical "+path);
  assert.equal(metadata.h1,1,"Unexpected H1 "+path);
  return {page,metadata};
}
try{
  const {page:entry,metadata:summary}=await pageFor(acquisition,true);
  try{
    assert.ok(summary.ids.includes("porovnani-pujceni-postele"),"No anchor for calculator");
    assert.ok(summary.links.some(a=>a.href===origin+advisor+"#poradce-postel"),
      "Acquisition page no longer links to the fit-gated bed advisor");
    await entry.waitForSelector("#zp-bed-cost-comparison:not([hidden])",{timeout:15000});
    const fieldCount=await entry.$$eval("#zp-bed-cost-comparison input",nodes=>nodes.length);
    assert.equal(fieldCount,4,"Expected exactly four numeric inputs");
    const scriptLoaded=await entry.evaluate(()=>typeof compareBedCosts==="function");
    assert.ok(scriptLoaded,"Calculator JavaScript not running");
    const populate=async ({months,monthly,extras,purchase})=>{
      await entry.evaluate(values=>{
        for(const [id,v] of Object.entries(values)){
          const el=document.querySelector("#zp-bed-cost-"+id);
          if(!el)throw Error("No bed input "+id);
          el.value=v;
          el.dispatchEvent(new Event("input",{bubbles:true}));
        }
      },{"months":months,"monthly":monthly,"rental-extras":extras,"purchase":purchase});
    };
    const submit=async ()=>{
      await entry.click("#zp-bed-cost-comparison button[type=submit]");
      return normalize(await entry.$eval("#zp-bed-cost-result",el=>el.textContent));
    };
    const before=activity.length;
    await populate({months:"6",monthly:"900",extras:"500",purchase:"12000"});
    let result=await submit();
    assert.match(result,/Za 6 měsíců/);
    assert.match(result,/půjčení 5 ?900/);
    assert.match(result,/nákup 12 ?000/);
    assert.match(result,/6 ?100 [Kk]č levněji/);
    assert.match(result,/vratnou kauci/);
    await populate({months:"24",monthly:"950",extras:"0",purchase:"15000"});
    result=await submit();
    assert.match(result,/půjčení 22 ?800/);
    assert.match(result,/nákup 15 ?000/);
    assert.match(result,/koupě o 7 ?800 [Kk]č levněji/);
    await populate({months:"10",monthly:"1000",extras:"",purchase:"10000"});
    result=await submit();
    assert.match(result,/obě cesty finančně stejně/);
    await populate({months:"0",monthly:"900",extras:"",purchase:"10000"});
    result=await submit();
    assert.match(result,/Vyplňte platné celé částky/);
    const newRequests=activity.slice(before);
    assert.ok(!newRequests.some(x=>x.method!=="GET"),"Calculator sent a non-GET request");
    assert.ok(!newRequests.some(x=>/(\?|#).*(900|12000|15000)/.test(x.url)),
      "Entered financial values leaked into a URL");
    const {page:bed,metadata:bedInfo}=await pageFor(advisor,false);
    try{
      assert.ok(bedInfo.links.some(a=>
        a.href===origin+acquisition+"#porovnani-pujceni-postele"),
        "Bed advisor missing calculator link");
    }finally{await bed.close();}
    assert.deepEqual(jsErrors,[],"JavaScript errors on real calculator page");
    console.log("LIVE_BED_COST_0_8_139",JSON.stringify({
      version,integrity:ready.integrity,affiliate_slots:ready.configured_total,
      page:acquisition,advisor,calculator_fields:fieldCount,
      scenarios:["rent_cheaper","buy_cheaper","equal","invalid_blocked"],
      reciprocal_advisor_link:true,
      merchant_clicks:0,post_requests_after_interaction:0,js_errors:jsErrors.length
    }));
  }finally{await entry.close();}
}finally{await browser.close();}
