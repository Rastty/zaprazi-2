/**
 * PR #498 read-only real Chrome acceptance for the production Bathroom hub.
 * Verifies engine-specific missing answer focus, hidden field safety, candidate
 * and merchant invalidation, blocked professional transfer and data privacy.
 * No commerce clicks, non-GET requests, storage or answer telemetry.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
 .filter(Boolean).find(file=>{try{accessSync(file,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Real Chrome required for production acceptance");
const readyResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(25000)});
assert.equal(readyResponse.status,200);
const ready=await readyResponse.json();
assert.equal(ready.integrity,"ok");assert.equal(ready.configured_total,ready.slot_total);
assert.ok(ready.slot_total>=25);
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const jsErrors=[],writes=[],results=[];
const caseDefs=[
 {id:"unknown_transfer_stage_one",stageOne:{primaryNeed:"raise_toilet",transferAbility:"unknown",duration:"long_term"},focus:"transferAbility",correction:["transferAbility","independent"],stageTwo:null},
 {id:"unknown_floor_stage_one",stageOne:{primaryNeed:"shower_seated",transferAbility:"independent",floorStable:"unknown",duration:"long_term"},focus:"floorStable",correction:["floorStable","yes"],stageTwo:null},
 {id:"unknown_load_stage_two",stageOne:{primaryNeed:"raise_toilet",transferAbility:"independent",duration:"long_term"},
  stageTwo:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"unknown"},focus:"loadFit",correction:["loadFit","yes"]}
];
try{
 for(const spec of caseDefs){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   page.setDefaultTimeout(16000);
   await page.setRequestInterception(true);
   page.on("request",request=>{
    if(request.method()!=="GET"){writes.push({scenario:spec.id,method:request.method()});return request.abort();}
    if(request.url().startsWith(origin+"/")||request.url().startsWith("data:")||request.url().startsWith("about:"))return request.continue();
    request.abort();
   });
   page.on("pageerror",error=>jsErrors.push({scenario:spec.id,message:error.message}));
   const response=await page.goto(origin+"/koupelna-a-wc/",{waitUntil:"networkidle2",timeout:45000});
   assert.equal(response?.status(),200,spec.id+" route");
   const metadata=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href
   }));
   assert.equal(metadata.release,ready.release);
   assert.equal(metadata.integrity,"ok");assert.equal(metadata.canonical,origin+"/koupelna-a-wc/");

   const pick=async(name,value)=>page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>{
    if(el.closest("[hidden]"))throw Error("Attempt to choose hidden "+el.name);
    el.click();
   });
   const submit=async()=>page.$eval("#zp-bathroom-submit",el=>el.click());
   const waitResult=async()=>page.waitForFunction(()=>document.querySelector("#zp-bathroom-result")?.hidden===false,{timeout:16000});
   const waitStage=async()=>page.waitForFunction(()=>document.querySelector("#zp-bathroom-fit-stage")?.hidden===false,{timeout:16000});
   const getResult=async()=>page.$eval("#zp-bathroom-result",el=>({
    hidden:el.hidden,htmlLength:el.innerHTML.length,
    focus:[...el.querySelectorAll("[data-zp-bathroom-focus]")].map(x=>x.dataset.zpBathroomFocus),
    merchant:el.querySelectorAll('[data-zp-bath-merchant-link],[data-zp-merchant-link],.zp-offers a[href]').length,
    offers:el.querySelectorAll(".zp-offer").length,
    productCards:el.querySelectorAll(".zp-product-card").length,
    editSituation:el.querySelectorAll('[data-zp-bathroom-edit="situation"]').length,
    editFit:el.querySelectorAll('[data-zp-bathroom-edit="fit"]').length
   }));
   const assertClean=async()=>{
    const before=await getResult();
    assert.equal(before.hidden,true,spec.id+" stale result visible after correction");
    assert.equal(before.htmlLength,0,spec.id+" stale result retained");
    assert.equal(before.merchant,0);
   };
   for(const [name,val] of Object.entries(spec.stageOne))await pick(name,val);
   await submit();
   if(spec.stageTwo){
    await waitStage();
    const provisional=await page.$eval("#zp-bathroom-preview",el=>({
      hidden:el.hidden,
      cards:el.querySelectorAll(".zp-product-card").length,
      merchants:el.querySelectorAll('[data-zp-bath-merchant-link],.zp-offers a[href]').length
    }));
    assert.equal(provisional.hidden,false);
    assert.ok(provisional.cards>0);
    assert.equal(provisional.merchants,0,"Provisional preview has commercial link");
    for(const [name,val] of Object.entries(spec.stageTwo))await pick(name,val);
    await submit();
   }
   await waitResult();
   let before=await getResult();
   assert.deepEqual(before.focus,[spec.focus],spec.id+" must show exactly one precise missing answer");
   assert.equal(before.merchant,0,spec.id+" exposed merchant on unknown input");
   assert.equal(before.offers,0);
   assert.equal(before.productCards,0);
   if(!spec.stageTwo){
     assert.equal(await page.$eval("#zp-bathroom-fit-stage",x=>x.hidden),true,"Fit stage unexpectedly visible");
     assert.equal(before.editFit,0,"Hidden fit editing button incorrectly available");
     assert.notEqual(before.focus[0],"loadFit","Hidden loadFit must not be focus target");
   }
   await page.$eval('#zp-bathroom-result [data-zp-bathroom-focus]',button=>button.click());
   const focused=await page.evaluate(()=>({
      name:document.activeElement?.name,
      visible:!!document.activeElement?.getClientRects().length,
      hiddenAncestor:!!document.activeElement?.closest("[hidden]")
   }));
   assert.equal(focused.name,spec.focus,spec.id+" incorrect exact question focus");
   assert.equal(focused.visible,true);assert.equal(focused.hiddenAncestor,false);
   const retained=await page.evaluate(names=>Object.fromEntries(names.map(name=>[
     name,document.querySelector('#zp-bathroom-advisor input[name="'+name+'"]:checked')?.value
   ])),[...Object.keys(spec.stageOne),...Object.keys(spec.stageTwo||{})]);
   assert.deepEqual(retained,{...spec.stageOne,...spec.stageTwo},spec.id+" answers lost on edit");
   await pick(...spec.correction);
   await assertClean();
   if(spec.stageTwo){
     await submit();await waitResult();
     const accepted=await getResult();
     assert.ok(accepted.merchant>0,"Confirmed capacity should restore candidate offers");
     assert.deepEqual(accepted.focus,[],"Confirmed candidate must have no missing-answer shortcut");
     assert.equal(accepted.editSituation,1);assert.equal(accepted.editFit,1);
     // Changing the main need must discard previously confirmed model-fit facts.
     await page.$eval('#zp-bathroom-result [data-zp-bathroom-edit="situation"]',b=>b.click());
     await pick("primaryNeed","shower_seated");
     await assertClean();
     const reset=await page.evaluate(()=>({
       stageHidden:document.querySelector("#zp-bathroom-fit-stage")?.hidden,
       previewHidden:document.querySelector("#zp-bathroom-preview")?.hidden,
       fitChecked:[...document.querySelectorAll("#zp-bathroom-fit-stage input[type=radio]:checked")].length
     }));
     assert.equal(reset.stageHidden,true);
     assert.equal(reset.previewHidden,true);
     assert.equal(reset.fitChecked,0,"Old model confirmations reused across needs");
     // High-risk transfer stays fully blocked, without an actionable missing answer.
     await pick("transferAbility","person_assist");
     await pick("floorStable","yes");
     await submit();await waitResult();
     const blocked=await getResult();
     assert.deepEqual(blocked.focus,[]);
     assert.equal(blocked.merchant,0);
     assert.equal(blocked.offers,0);
     assert.equal(blocked.editFit,0);
   }else{
     await submit();
     await page.waitForFunction(()=>document.querySelector("#zp-bathroom-result")?.hidden===true||
       document.querySelector("#zp-bathroom-fit-stage")?.hidden===false,{timeout:16000});
     assert.equal(await page.$eval("#zp-bathroom-fit-stage",x=>x.hidden),false,
       "After correction, advisor did not reach the next safe stage");
     const provisional=await page.$eval("#zp-bathroom-preview",x=>({
       hidden:x.hidden,merchant:x.querySelectorAll('[data-zp-bath-merchant-link],.zp-offers a[href]').length
     }));
     assert.equal(provisional.hidden,false);
     assert.equal(provisional.merchant,0);
   }
   const url=await page.evaluate(()=>({path:location.pathname,query:location.search}));
   assert.deepEqual(url,{path:"/koupelna-a-wc/",query:""});
   results.push({scenario:spec.id,exactFocus:spec.focus,merchantsBeforeCorrection:0,
     staleOfferRemoved:true,answersKept:true,hiddenFitSafe:true});
   console.log("PASS live Bathroom precise correction:",spec.id);
  }finally{await page.close();}
 }
 assert.deepEqual(jsErrors,[],"Live JavaScript errors");
 assert.deepEqual(writes,[],"Non-GET browser request");
 console.log("LIVE_BATHROOM_MISSING_FOCUS_498",JSON.stringify({
   release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
   scenarios:results.length,results,merchantClicks:0,postRequests:writes.length
 }));
}finally{await browser.close();}
