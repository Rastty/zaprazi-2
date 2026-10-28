/**
 * PR #496: read-only REAL Chrome production acceptance of the central Bathroom
 * Advisor's blocked educational links, popup destination, answer preservation,
 * merchant safety and invalid-input / complex-case fail-closed branches.
 *
 * No merchant clicks, no POST/PUT/etc, no analytics payload, no user answers
 * in logs, URLs or persistent storage. No release-version shortcut.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const executable=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
  .filter(Boolean).find(file=>{try{accessSync(file,constants.X_OK);return true;}catch{return false;}});
assert.ok(executable,"A real Chrome binary is required");
const scenarios=[
 {need:"raise_toilet",more:{},guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc"},
 {need:"toilet_support",more:{wallFixing:"unverified"},guide:"/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton"},
 {need:"toilet_nearby",more:{floorStable:"yes"},guide:"/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel"},
 {need:"shower_seated",more:{floorStable:"yes"},guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha"},
 {need:"bath_transfer",more:{bathTransferIndependent:"yes"},guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana"},
 {need:"multifunction_toilet_shower",more:{floorStable:"yes"},guide:"/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel"},
 // Deliberate exclusions: no generic DIY guide for complex wheelchair transfer,
 // nor an arbitrary product link when the practical need is unknown.
 {need:"combined_shower_toilet",more:{},guide:null},
 {need:"unknown",more:{},guide:null}
];
const r=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",
  {signal:AbortSignal.timeout(25000)});
assert.equal(r.status,200,"Readiness HTTP response");
const ready=await r.json();
assert.equal(ready.integrity,"ok");
assert.equal(ready.configured_total,ready.slot_total);
assert.ok(ready.configured_total>=25);
const browser=await puppeteer.launch({executablePath:executable,headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]});
const issues=[],writes=[],passed=[];
try{
 for(const spec of scenarios){
  const page=await browser.newPage();
  try{
   page.setDefaultTimeout(16000);
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   await page.setRequestInterception(true);
   page.on("request",req=>{
    if(req.method()!=="GET"){writes.push({scenario:spec.need,method:req.method()});return req.abort();}
    const url=req.url();
    if(url.startsWith(origin+"/")||url.startsWith("data:")||url.startsWith("about:"))return req.continue();
    req.abort();
   });
   page.on("pageerror",err=>issues.push({scenario:spec.need,error:err.message}));
   const response=await page.goto(origin+"/koupelna-a-wc/",{waitUntil:"networkidle2",timeout:45000});
   assert.equal(response?.status(),200,"Missing live Bathroom hub");
   const meta=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href
   }));
   assert.equal(meta.release,ready.release);
   assert.equal(meta.integrity,"ok");
   assert.equal(meta.canonical,origin+"/koupelna-a-wc/");

   const answers={primaryNeed:spec.need,transferAbility:"person_assist",duration:"long_term",...spec.more};
   for(const [name,value] of Object.entries(answers)){
    await page.$eval('input[name="'+name+'"][value="'+value+'"]',input=>{
      if(input.closest("[hidden]"))throw new Error("Unexpectedly hidden "+input.name);
      input.click();
    });
   }
   await page.$eval("#zp-bathroom-submit",el=>el.click());
   await page.waitForFunction(()=>document.querySelector("#zp-bathroom-result")?.hidden===false,
      {timeout:16000});
   const state=await page.$eval("#zp-bathroom-result",root=>{
     const guide=root.querySelector("a.zp-bath-safe-guide[href]");
     const links=[...root.querySelectorAll("a[href]")];
     return{
      guide:guide?.getAttribute("href")??null,
      label:guide?.textContent?.trim(),
      rel:guide?.rel?.split(/\s+/).sort(),
      target:guide?.target,
      links:links.length,
      merchantLinks:root.querySelectorAll(
       "[data-zp-bath-merchant-link],[data-zp-merchant-link],.zp-offer a[href],.zp-offers a[href]").length,
      productCards:root.querySelectorAll(".zp-product-card").length,
      acquisition:root.querySelectorAll(".zp-acquisition-summary a[href]").length,
      editSituation:root.querySelectorAll('button[data-zp-bathroom-edit="situation"]').length,
      editFit:root.querySelectorAll('button[data-zp-bathroom-edit="fit"]').length,
      disclaimer:root.textContent?.includes("bez bezpečných podkladů"),
      hasProfessionalNote:root.textContent?.includes("samotné měření nestačí")
     };
   });
   assert.equal(state.guide,spec.guide,spec.need+" wrong blocked guide");
   assert.equal(state.links,spec.guide?1:0,spec.need+" unexpected outbound links");
   assert.equal(state.merchantLinks,0,spec.need+" merchant access in blocked branch");
   assert.equal(state.acquisition,0);
   assert.equal(state.productCards,0);
   assert.equal(state.editSituation,1);
   assert.equal(state.editFit,0);
   assert.equal(state.disclaimer,true);
   assert.equal(await page.$eval("#zp-bathroom-fit-stage",el=>el.hidden),true);
   assert.equal(await page.$eval("#zp-bathroom-preview",el=>el.hidden),true);
   if(spec.guide){
    assert.equal(state.target,"_blank");
    assert.deepEqual(state.rel,["noopener","noreferrer"].sort());
    assert.match(state.label,/bezpečný kontrolní návod/i);
    assert.equal(state.hasProfessionalNote,true);
    const popup= new Promise((resolve,reject)=>{
      const id=setTimeout(()=>reject(new Error("No new guide tab: "+spec.need)),18000);
      page.once("popup",p=>{clearTimeout(id);resolve(p);});
    });
    await page.$eval("#zp-bathroom-result a.zp-bath-safe-guide",a=>a.click());
    const newTab=await popup;
    try{
      const url=new URL(spec.guide,origin);
      await newTab.waitForFunction(({path,hash})=>location.pathname===path&&location.hash===hash,
        {timeout:18000},{path:url.pathname,hash:url.hash});
      const dest=await newTab.evaluate(anchor=>({
        path:location.pathname,hash:location.hash,query:location.search,
        anchorExists:Boolean(document.getElementById(anchor)),
        title:document.querySelector("main h1")?.textContent?.trim()
      }),url.hash.slice(1));
      assert.equal(dest.path,url.pathname);
      assert.equal(dest.hash,url.hash);
      assert.equal(dest.query,"","Sensitive answers leaked in guide query");
      assert.equal(dest.anchorExists,true,spec.need+" broken guide anchor");
      assert.ok(dest.title?.length>10);
    }finally{await newTab.close();}
   }

   const after=await page.evaluate(names=>({
     path:location.pathname,query:location.search,
     retained:Object.fromEntries(names.map(n=>[
       n,document.querySelector('#zp-bathroom-advisor input[name="'+n+'"]:checked')?.value
     ])),
     resultVisible:!document.querySelector("#zp-bathroom-result").hidden,
     merchantLinks:document.querySelectorAll("#zp-bathroom-result [data-zp-bath-merchant-link]").length
   }),Object.keys(answers));
   assert.equal(after.path,"/koupelna-a-wc/");
   assert.equal(after.query,"");
   assert.deepEqual(after.retained,answers,spec.need+" answers were lost");
   assert.equal(after.resultVisible,true);
   assert.equal(after.merchantLinks,0);
   await page.$eval('#zp-bathroom-result [data-zp-bathroom-edit="situation"]',el=>el.click());
   const focus=await page.evaluate(()=>({
     name:document.activeElement?.name,visible:!!document.activeElement?.getClientRects().length
   }));
   assert.equal(focus.name,"primaryNeed");
   assert.equal(focus.visible,true);
   passed.push({need:spec.need,guide:spec.guide,blocked:true,merchantLinks:0,
      originalAnswersRetained:true,guideAnchorValid:spec.guide!==null?true:null});
   console.log("PASS live Chrome blocked hub guide:",spec.need);
  }finally{await page.close();}
 }
 assert.deepEqual(issues,[],"Browser JS errors");
 assert.deepEqual(writes,[],"Browser attempted non-GET request");
 console.log("LIVE_BATHROOM_HUB_BLOCKED_GUIDES_496",JSON.stringify({
   release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
   scenarios:passed.length,passed,merchantClicks:0,postRequests:writes.length
 }));
}finally{await browser.close();}
