/**
 * Live real-Chrome read-only PR #490 acceptance of the five staged Bathroom
 * Advisors. Never click merchant URLs or send POST/analytics payloads.
 * The release marker is deliberately not a feature gate: multiple deploys
 * can use the same 0.8.183 marker, so verify real behavior in live Chrome.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
 .filter(Boolean).find(path=>{try{accessSync(path,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Chrome is mandatory for real live UX acceptance");

const specs=[
 {key:"toilet-riser",path:"/nastavec-na-wc-pro-seniory/",
  first:{transferAbility:"independent",duration:"long_term"},
  fit:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"yes"},
  focus:"transferAbility",fitFocus:"toiletFit"},
 {key:"shower-chair",path:"/sprchovaci-zidle-pro-seniory/",
  first:{transferAbility:"independent",floorStable:"yes",duration:"long_term"},
  fit:{spaceFit:"yes",loadFit:"yes"},focus:"transferAbility",fitFocus:"spaceFit"},
 {key:"toilet-chair",path:"/toaletni-zidle-pro-seniory/",
  first:{chairMode:"nearby",transferAbility:"independent",floorStable:"yes",duration:"long_term"},
  fit:{spaceFit:"yes",loadFit:"yes"},focus:"chairMode",fitFocus:"spaceFit"},
 {key:"toilet-support",path:"/madlo-k-wc-pro-seniory/",
  first:{transferAbility:"steadying",wallFixing:"unverified",duration:"long_term"},
  fit:{supportFrameFit:"yes",loadFit:"yes"},focus:"transferAbility",fitFocus:"loadFit"},
 {key:"bath-transfer",path:"/sedatko-do-vany-pro-seniory/",
  first:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"long_term"},
  fit:{bathFit:"yes",loadFit:"yes"},focus:"transferAbility",fitFocus:"bathFit"}
];

const readinessResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",
 {headers:{Accept:"application/json"},signal:AbortSignal.timeout(25000)});
assert.equal(readinessResponse.status,200);
const ready=await readinessResponse.json();
assert.equal(ready.integrity,"ok","Live release integrity must be OK");
assert.ok(ready.slot_total>=25);
assert.equal(ready.configured_total,ready.slot_total);
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]});
const pageErrors=[],writeRequests=[],verified=[];
try{
 for(const spec of specs){
  const page=await browser.newPage();
  const root="#zp-"+spec.key,form=root+"-advisor",
   submit=root+"-submit",preview=root+"-preview",stage=root+"-fit-stage",result=root+"-result";
  const merchantSelector="[data-zp-merchant-link],[data-zp-toilet-merchant-link],[data-zp-shower-merchant-link],"+
   "[data-zp-chair-merchant-link],[data-zp-support-merchant-link],[data-zp-bath-merchant-link]";
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   page.setDefaultTimeout(15000);
   await page.setRequestInterception(true);
   page.on("request",req=>{
    const url=req.url();
    if(req.method()!=="GET"){
     writeRequests.push({advisor:spec.key,method:req.method()});return req.abort();
    }
    if(!url.startsWith(origin+"/")&&!url.startsWith("data:")&&!url.startsWith("about:"))return req.abort();
    req.continue();
   });
   page.on("pageerror",err=>pageErrors.push({advisor:spec.key,message:err.message}));
   const res=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:42000});
   assert.equal(res?.status(),200,spec.key+" missing page");
   const meta=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    h1:document.querySelectorAll("main h1").length
   }));
   assert.equal(meta.release,ready.release,spec.key+" release mismatch");
   assert.equal(meta.integrity,"ok",spec.key+" integrity mismatch");
   assert.equal(meta.canonical,origin+spec.path,spec.key+" canonical mismatch");
   assert.equal(meta.h1,1,spec.key+" H1 count");
   assert.ok(await page.$(form),spec.key+" form missing");

   const choose=async(name,value)=>{
    await page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>{
     if(el.closest("[hidden]"))throw Error("Cannot pick hidden field "+el.name);
     el.click();
    });
   };
   const press=async()=>page.$eval(submit,el=>el.click());
   const waitShown=async(selector)=>page.waitForFunction(
     selector=>document.querySelector(selector)?.hidden===false,{timeout:15000},selector);
   const state=()=>page.$eval(result,(el,merchant)=>({
    hidden:el.hidden,htmlSize:el.innerHTML.length,
    merchants:el.querySelectorAll(merchant).length,
    offers:el.querySelectorAll(".zp-offer").length,
    situation:!!el.querySelector('button[data-zp-bath-edit="situation"]'),
    fit:!!el.querySelector('button[data-zp-bath-edit="fit"]'),
    buttonCount:el.querySelectorAll("[data-zp-bath-edit]").length
   }),merchantSelector);
   const edit=async(phase,name)=>{
    const selector=result+' button[data-zp-bath-edit="'+phase+'"]';
    await page.$eval(selector,b=>b.click());
    const focus=await page.evaluate(()=>({
     field:document.activeElement?.name,
     visible:!!document.activeElement?.getClientRects().length
    }));
    assert.equal(focus.field,name,spec.key+" wrong "+phase+" edit focus");
    assert.equal(focus.visible,true,spec.key+" edit focused a hidden field");
   };

   // Stage 1: a real provisional model preview without any commercial URL.
   for(const [key,val] of Object.entries(spec.first))await choose(key,val);
   await press();await waitShown(stage);
   const stageOne=await page.$eval(preview,(el,merchant)=>({
    hidden:el.hidden,productCards:el.querySelectorAll(".zp-product-card").length,
    merchantLinks:el.querySelectorAll(merchant).length,
    allLinks:el.querySelectorAll("a[href]").length
   }),merchantSelector);
   assert.equal(stageOne.hidden,false);
   assert.ok(stageOne.productCards>0,spec.key+" no provisional model");
   assert.equal(stageOne.merchantLinks,0,spec.key+" preliminary stage exposed merchant");
   assert.equal(stageOne.allLinks,0,spec.key+" provisional stage has outbound links");

   // Stage 2: approved fit result, never guess load capacity.
   for(const [key,val] of Object.entries(spec.fit))await choose(key,val);
   await press();await waitShown(result);
   await page.waitForFunction(sel=>!!document.querySelector(sel+' [data-zp-bath-edit="fit"]'),
    {timeout:14000},result);
   let accepted=await state();
   assert.ok(accepted.merchants>0,spec.key+" safe verified fit should show actual product offers");
   assert.equal(accepted.situation,true);
   assert.equal(accepted.fit,true);
   assert.equal(accepted.buttonCount,2,"Edit controls must never duplicate");

   await edit("fit",spec.fitFocus);
   // Changing capacity instantly invalidates all old product URLs.
   await choose("loadFit","unknown");
   let cleared=await state();
   assert.equal(cleared.hidden,true,spec.key+" stale result still visible");
   assert.equal(cleared.htmlSize,0,spec.key+" stale merchant HTML retained");
   assert.equal(cleared.merchants,0);

   // Unknown capacity: no commerce, but still allow editing fit again.
   await press();await waitShown(result);
   await page.waitForFunction(sel=>!!document.querySelector(sel+' [data-zp-bath-edit="fit"]'),
    {timeout:14000},result);
   const unknown=await state();
   assert.equal(unknown.merchants,0,spec.key+" uncertain fit exposed merchant");
   assert.equal(unknown.situation,true);
   assert.equal(unknown.fit,true);
   await edit("fit",spec.fitFocus);
   await choose("loadFit","yes");
   await press();await waitShown(result);
   await page.waitForFunction(sel=>!!document.querySelector(sel+' [data-zp-bath-edit="fit"]'),
    {timeout:14000},result);
   let again=await state();
   assert.ok(again.merchants>0,spec.key+" restored verified fit has no model offers");
   assert.equal(again.buttonCount,2,"Repeated evaluation duplicated edit buttons");

   // Changing the situation discards old model approvals and hides stale results.
   await edit("situation",spec.focus);
   await choose("transferAbility","person_assist");
   cleared=await state();
   assert.equal(cleared.hidden,true,spec.key+" stale result still visible after situation edit");
   assert.equal(cleared.htmlSize,0,spec.key+" stale result HTML retained after situation edit");
   assert.equal(cleared.merchants,0);
   const reset=await page.evaluate(root=>({
    fitHidden:document.querySelector(root+"-fit-stage")?.hidden,
    previewHidden:document.querySelector(root+"-preview")?.hidden,
    verifiedFit:[...document.querySelectorAll(root+"-fit-stage input[type=radio]:checked")].length
   }),root);
   assert.equal(reset.fitHidden,true,spec.key+" stage two remains visible after changed needs");
   assert.equal(reset.previewHidden,true,spec.key+" stale provisional model remains");
   assert.equal(reset.verifiedFit,0,spec.key+" stale fit confirmations reused");

   // High-risk transfer is blocked by stage one, before any provisional model.
   await press();await waitShown(result);
   await page.waitForFunction(sel=>!!document.querySelector(sel+' [data-zp-bath-edit="situation"]'),
    {timeout:14000},result);
   const blocked=await state();
   assert.equal(blocked.merchants,0,spec.key+" high-risk branch exposes merchant");
   assert.equal(blocked.offers,0,spec.key+" high-risk branch shows product offers");
   assert.equal(blocked.situation,true,spec.key+" blocked branch has no edit route");
   assert.equal(blocked.fit,false,spec.key+" blocked branch must not suggest verifying a model");
   await edit("situation",spec.focus);

   verified.push({advisor:spec.key,path:spec.path,previewNoCommerce:true,
    verifiedFitMerchants:accepted.merchants,
    fitEditFocus:spec.fitFocus,uncertainFitNoCommerce:true,
    staleMerchantCleared:true,resetModelConfirmations:true,
    blockedNoCommerce:true,blockedEditFocus:spec.focus,editButtonsDeduplicated:true});
   console.log("PASS Bathroom real Chrome edit and safety:",spec.key);
  }finally{await page.close();}
 }
 assert.deepEqual(pageErrors,[],"JavaScript errors on live pages");
 assert.deepEqual(writeRequests,[],"Any attempted non-GET request fails acceptance");
 console.log("LIVE_BATHROOM_FIVE_EDIT_490",JSON.stringify({
  release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
  advisors:verified.length,verified,merchantClicks:0,postRequests:writeRequests.length
 }));
}finally{await browser.close();}
