/**
 * Production-only read acceptance for deployed 0.8.141 wheelchair doorway guide.
 * No CMS writes, product purchase, affiliate click or personal-data upload.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
const origin="https://zaprazi.cz",version="0.8.141";
const article="/projede-invalidni-vozik-dvermi/",advisor="/invalidni-vozik/";
const readiness=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(30000)
});
assert.equal(readiness.status,200,"Affiliate readiness route not accessible");
const ready=await readiness.json();
assert.equal(ready.release,version,"Live theme has wrong version");
assert.equal(ready.integrity,"ok","Release integrity broken");
assert.equal(ready.configured_total,25,"Affiliate slots changed");
assert.equal(ready.slot_total,25,"Affiliate inventory changed");
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const interactions=[],errors=[];
const flat=s=>String(s??"").replace(/\s+/g," ").trim();
async function pageAt(path,js=true){
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setJavaScriptEnabled(js);
  await page.setRequestInterception(true);
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",request=>{
    const url=request.url(),method=request.method();
    interactions.push({url,method});
    if(!url.startsWith(origin+"/")||method!=="GET")return request.abort();
    request.continue();
  });
  const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response?.status(),200,"Live page unavailable: "+path);
  const meta=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    description:document.querySelector('meta[name="description"]')?.content||"",
    h1:document.querySelectorAll("main h1").length,
    ids:[...document.querySelectorAll("[id]")].map(el=>el.id),
    links:[...document.querySelectorAll("main a[href]")].map(a=>a.href),
    viewportOverflow:document.documentElement.scrollWidth-innerWidth
  }));
  assert.equal(meta.release,version,"Unexpected release "+path);
  assert.equal(meta.integrity,"ok","Partial render "+path);
  assert.equal(meta.canonical,origin+path,"Unexpected canonical "+path);
  assert.equal(meta.h1,1,"Each page needs exactly one H1 "+path);
  assert.equal(meta.viewportOverflow<=2,true,"Mobile horizontal overflow "+path);
  return {page,meta};
}
try{
  const {page,meta}=await pageAt(article);
  try{
    assert.ok(meta.ids.includes("mereni-pruchodu"),"Six-step guide anchor missing");
    assert.ok(meta.ids.includes("porovnani-sirek"),"Calculator anchor missing");
    assert.ok(meta.description.length>=70,"No helpful SEO snippet");
    assert.ok(meta.links.includes(origin+advisor+"#poradce-vozik"),"No safe advisor link");
    const count=await page.$$eval("#mereni-pruchodu .zp-decision-card",ns=>ns.length);
    assert.equal(count,6,"Six distinct practical checks expected");
    await page.waitForSelector("#zp-doorway-check:not([hidden])",{timeout:15000});
    const inputCount=await page.$$eval("#zp-doorway-check input[type=number]",ns=>ns.length);
    assert.equal(inputCount,2);
    const nativeCalc=await page.evaluate(()=>typeof compareDoorwayWidths==="function");
    assert.ok(nativeCalc,"Local-only width checker not loaded");
    const before=interactions.length;
    const fill=async (d,c)=>page.evaluate(([door,chair])=>{
      const a=document.querySelector("#zp-door-clear-width");
      const b=document.querySelector("#zp-chair-overall-width");
      a.value=door;a.dispatchEvent(new Event("input",{bubbles:true}));
      b.value=chair;b.dispatchEvent(new Event("input",{bubbles:true}));
    },[d,c]);
    const result=async()=>flat(await page.$eval("#zp-doorway-result",el=>el.textContent));
    const submit=async()=>{await page.click('#zp-doorway-check button[type="submit"]');return result();};
    await fill("76.5","70");
    let text=await submit();
    assert.match(text,/6,5 cm/);
    assert.match(text,/NENÍ potvrzení bezpečného průjezdu/);
    await fill("65","68");
    text=await result();
    assert.match(text,/Předchozí přepočet už neplatí/,"Changing measurements must invalidate stale result");
    text=await submit();
    assert.match(text,/rozdíl -3 cm/);
    assert.match(text,/nestačí/);
    await fill("70","70");
    text=await submit();
    assert.match(text,/rozdíl 0 cm/);
    assert.match(text,/nestačí/);
    await fill("0","70");
    text=await result();
    assert.match(text,/Předchozí přepočet už neplatí/);
    const valid=await page.$eval("#zp-doorway-check",el=>el.checkValidity());
    assert.equal(valid,false,"Native bounds should block zero width");
    await page.click('#zp-doorway-check button[type="submit"]');
    text=await result();
    assert.doesNotMatch(text,/rozdíl 0 cm|potvrzení bezpečného průjezdu/);
    await fill("80","70");
    text=await result();
    assert.match(text,/Předchozí přepočet už neplatí/);
    text=await submit();
    assert.match(text,/10 cm/);
    assert.match(text,/NENÍ potvrzení bezpečného průjezdu/);
    assert.ok(!interactions.slice(before).some(x=>x.method!=="GET"),"Calculator sent a request");
    assert.ok(!interactions.slice(before).some(x=>/[\?&#](?:door|width|chair|clear|d)=/.test(x.url)),
      "Measurements leaked into URL");
    assert.deepEqual(errors,[],"Runtime JavaScript error");
  }finally{await page.close();}
  for(const [path,needed] of [
    [advisor,origin+article+"#mereni-pruchodu"],
    ["/bezpecny-byt-pro-seniora/",origin+article+"#mereni-pruchodu"]
  ]){
    const {page,meta}=await pageAt(path,false);
    try{assert.ok(meta.links.includes(needed),"Missing reciprocal, useful path from "+path);}
    finally{await page.close();}
  }
  console.log("LIVE_WHEELCHAIR_DOORWAY_0_8_141",JSON.stringify({
    version,integrity:ready.integrity,affiliate_slots:ready.configured_total,
    page:article,advisor,steps:6,inputs:2,scenarios:[
      "positive_margin_without_safety_clearance","negative_margin_block",
      "zero_margin_block","invalid_input_clears_old_result","recalculation"
    ],reciprocal_links:2,merchant_clicks:0,script_errors:errors.length
  }));
}finally{await browser.close();}
